import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { API, buildWeek, server } from '../../test/server';
import { renderWithClient, setViewport } from '../../test/utils';
import AvailabilityWeekGrid from './AvailabilityWeekGrid';

const renderGrid = (props = {}) => {
  const onSelectSlot = vi.fn();
  renderWithClient(
    <AvailabilityWeekGrid
      durationOptions={[60, 120]}
      durationMin={60}
      onDurationChange={() => {}}
      onSelectSlot={onSelectSlot}
      {...props}
    />,
  );
  return { onSelectSlot };
};

describe('AvailabilityWeekGrid', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-02T04:00:00Z'));
    setViewport(1280);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('renders every status with text, not only color, on desktop', async () => {
    renderGrid();
    const table = await screen.findByRole('table');
    expect(within(table).getByText('可預約')).toBeTruthy();
    expect(within(table).getByText('已額滿')).toBeTruthy();
    expect(within(table).getByText('未開放').getAttribute('title')).toBe('需於 3 天前預約');
    expect(within(table).getAllByText('國定假日休息').length).toBeGreaterThan(0);
    expect(within(table).getByText('10:00–10:30')).toBeTruthy();
  });

  it('labels slots for screen readers and supports the keyboard', async () => {
    const user = userEvent.setup();
    const { onSelectSlot } = renderGrid();
    const slot = await screen.findByRole('button', { name: '11月3日 星期二 10:00 可預約' });
    slot.focus();
    await user.keyboard('{Enter}');
    expect(onSelectSlot).toHaveBeenCalledWith(
      expect.objectContaining({ start: '2026-11-03T02:00:00Z' }),
    );
  });

  it('does not offer unavailable slots as buttons', async () => {
    renderGrid();
    await screen.findByRole('table');
    expect(screen.queryByRole('button', { name: /已額滿/ })).toBeNull();
  });

  it('limits navigation to the current week and moves between weeks', async () => {
    const user = userEvent.setup();
    renderGrid();
    await screen.findByRole('table');
    expect(screen.getByRole('button', { name: /上一週/ }).disabled).toBe(true);

    await user.click(screen.getByRole('button', { name: /下一週/ }));
    expect(await screen.findByRole('button', { name: /11月10日/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /上一週/ }).disabled).toBe(false);
  });

  it('stops at the booking window', async () => {
    const user = userEvent.setup();
    renderGrid();
    const next = await screen.findByRole('button', { name: /下一週/ });
    for (let week = 0; week < 8; week += 1) {
      await user.click(next);
    }
    await waitFor(() => expect(next.disabled).toBe(true));
  });

  it('shows the month range across two months', async () => {
    const user = userEvent.setup();
    server.use(
      http.get(`${API}/availability`, ({ request }) =>
        HttpResponse.json({
          data: buildWeek(new URL(request.url).searchParams.get('from')),
        }),
      ),
    );
    renderGrid();
    await screen.findByRole('table');
    expect(screen.getByText('2026年11月')).toBeTruthy();
    for (let week = 0; week < 4; week += 1) {
      await user.click(screen.getByRole('button', { name: /下一週/ }));
    }
    expect(await screen.findByText('2026年11月–12月')).toBeTruthy();
  });

  it('shows a list instead of a table on mobile', async () => {
    const user = userEvent.setup();
    setViewport(375);
    const { onSelectSlot } = renderGrid();

    const slot = await screen.findByRole('button', { name: /11月3日 星期二 10:00/ });
    expect(screen.queryByRole('table')).toBeNull();
    expect(screen.getByRole('button', { name: '11/03 二' }).getAttribute('aria-pressed')).toBe('true');

    await user.click(slot);
    expect(onSelectSlot).toHaveBeenCalledOnce();
  });

  it('shows the closure reason for a closed day on mobile', async () => {
    const user = userEvent.setup();
    setViewport(375);
    renderGrid();
    await user.click(await screen.findByRole('button', { name: '11/04 三' }));
    expect(await screen.findByText('國定假日休息')).toBeTruthy();
  });

  it('offers the next week when this week is full', async () => {
    const user = userEvent.setup();
    server.use(
      http.get(`${API}/availability`, ({ request }) => {
        const from = new URL(request.url).searchParams.get('from');
        const week = buildWeek(from);
        if (from === '2026-11-02') {
          week.days.forEach((day) => {
            day.slots.forEach((slot) => {
              slot.status = 'booked';
            });
          });
        }
        return HttpResponse.json({ data: week });
      }),
    );
    renderGrid();
    await user.click(await screen.findByRole('button', { name: '看下一週' }));
    expect(await screen.findByRole('button', { name: /11月10日/ })).toBeTruthy();
  });

  it('shows an error with a working retry', async () => {
    const user = userEvent.setup();
    let attempts = 0;
    server.use(
      http.get(`${API}/availability`, ({ request }) => {
        const from = new URL(request.url).searchParams.get('from');
        if (from !== '2026-11-02') return HttpResponse.json({ data: buildWeek(from) });
        attempts += 1;
        return attempts === 1
          ? HttpResponse.json({ error: { code: 'INTERNAL', message: 'x' } }, { status: 500 })
          : HttpResponse.json({ data: buildWeek(from) });
      }),
    );
    renderGrid();
    await user.click(await screen.findByRole('button', { name: '重試' }));
    expect(await screen.findByRole('table')).toBeTruthy();
  });
});
