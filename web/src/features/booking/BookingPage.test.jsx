import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { API, server } from '../../test/server';
import { renderWithClient, setViewport } from '../../test/utils';
import BookingPage from './BookingPage';

const authState = { user: null };

vi.mock('../auth/AuthProvider', () => ({
  useAuth: () => ({ user: authState.user }),
}));

vi.mock('../../lib/firebase', () => ({
  getFirebaseAuth: () => ({ currentUser: null }),
}));

const created = {
  id: 'b1',
  serviceId: 'personal',
  durationMin: 60,
  priceTwd: 5000,
  startAt: '2026-11-03T02:00:00.000Z',
  endAt: '2026-11-03T03:00:00.000Z',
  status: 'pending_payment',
};

const openForm = async (user) => {
  await user.click(await screen.findByRole('button', { name: /11月3日 星期二 10:00/ }));
  return screen.findByRole('dialog');
};

describe('BookingPage', () => {
  beforeEach(() => {
    authState.user = null;
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-02T04:00:00Z'));
    setViewport(1280);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('prefills the slot and shows the server price', async () => {
    const user = userEvent.setup();
    renderWithClient(<BookingPage />);
    await openForm(user);
    expect(screen.getByText('時間：2026年11月3日 星期二 10:00')).toBeTruthy();
    expect(screen.getByText('費用：NT$ 5,000')).toBeTruthy();
  });

  it('updates the price when the service changes', async () => {
    const user = userEvent.setup();
    renderWithClient(<BookingPage />);
    await openForm(user);
    await user.click(screen.getByRole('combobox', { name: '服務' }));
    await user.click(await screen.findByRole('option', { name: '親子解析' }));
    expect(await screen.findByText('費用：NT$ 8,000')).toBeTruthy();
  });

  it('validates the guest email only after submitting', async () => {
    const user = userEvent.setup();
    renderWithClient(<BookingPage />);
    await openForm(user);
    expect(screen.queryByText('Email 格式不正確')).toBeNull();
    await user.click(screen.getByRole('button', { name: '確認預約' }));
    expect(await screen.findByText('Email 格式不正確')).toBeTruthy();
  });

  it('submits a guest booking and shows the summary', async () => {
    const user = userEvent.setup();
    let body;
    server.use(
      http.post(`${API}/bookings`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ data: created }, { status: 201 });
      }),
    );
    renderWithClient(<BookingPage />);
    await openForm(user);
    await user.type(screen.getByRole('textbox', { name: /Email/ }), 'guest@example.test');
    await user.click(screen.getByRole('button', { name: '確認預約' }));

    expect(await screen.findByText('預約成功')).toBeTruthy();
    expect(body).toEqual({
      serviceId: 'personal',
      durationMin: 60,
      startAt: '2026-11-03T02:00:00Z',
      guestEmail: 'guest@example.test',
    });
    const calendar = screen.getByRole('link', { name: '加入 Google 日曆' });
    expect(calendar.getAttribute('href')).toContain('20261103T020000Z%2F20261103T030000Z');
  });

  it('hides the email field for members', async () => {
    const user = userEvent.setup();
    authState.user = { uid: 'u1' };
    renderWithClient(<BookingPage />);
    await openForm(user);
    expect(screen.queryByRole('textbox', { name: /Email/ })).toBeNull();
  });

  it('closes, warns and refetches when the slot was just taken', async () => {
    const user = userEvent.setup();
    let availabilityCalls = 0;
    server.use(
      http.post(`${API}/bookings`, () =>
        HttpResponse.json(
          { error: { code: 'SLOT_TAKEN', message: '此時段已被預約' } },
          { status: 409 },
        ),
      ),
      http.get(`${API}/availability`, async ({ request }) => {
        const url = new URL(request.url);
        if (url.searchParams.get('from') === '2026-11-02') availabilityCalls += 1;
        const { buildWeek } = await import('../../test/server');
        return HttpResponse.json({ data: buildWeek(url.searchParams.get('from')) });
      }),
    );
    renderWithClient(<BookingPage />);
    await openForm(user);
    await user.type(screen.getByRole('textbox', { name: /Email/ }), 'guest@example.test');
    await user.click(screen.getByRole('button', { name: '確認預約' }));

    expect(await screen.findByText('此時段剛剛被別人預約了，請選擇其他時段')).toBeTruthy();
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(availabilityCalls).toBe(2));
  });

  it('keeps the form open and shows other API errors', async () => {
    const user = userEvent.setup();
    server.use(
      http.post(`${API}/bookings`, () =>
        HttpResponse.json(
          { error: { code: 'TOO_SOON', message: '此時段已超過可預約期限' } },
          { status: 422 },
        ),
      ),
    );
    renderWithClient(<BookingPage />);
    await openForm(user);
    await user.type(screen.getByRole('textbox', { name: /Email/ }), 'guest@example.test');
    await user.click(screen.getByRole('button', { name: '確認預約' }));
    expect(await screen.findByText('此時段已超過可預約期限')).toBeTruthy();
    expect(screen.getByRole('dialog')).toBeTruthy();
  });
});
