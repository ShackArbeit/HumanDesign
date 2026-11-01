import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, apiRequest } from './client';

const getIdToken = vi.fn();
let currentUser;

vi.mock('../lib/firebase', () => ({
  getFirebaseAuth: () => ({ currentUser }),
}));

const jsonResponse = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

describe('apiRequest', () => {
  let fetchMock;

  beforeEach(() => {
    currentUser = null;
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('unwraps data and builds the query string, skipping undefined values', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { data: [1] }));
    const data = await apiRequest('/availability', {
      params: { from: '2026-11-05', durationMin: undefined },
    });
    expect(data).toEqual([1]);
    expect(fetchMock.mock.calls[0][0]).toBe('/api/v1/availability?from=2026-11-05');
  });

  it('sends the ID token when signed in', async () => {
    currentUser = { getIdToken };
    getIdToken.mockResolvedValue('id-token');
    fetchMock.mockResolvedValue(jsonResponse(200, { data: null }));
    await apiRequest('/me/bookings');
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer id-token');
  });

  it('sends no Authorization header for guests', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { data: null }));
    await apiRequest('/services');
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it('serializes a JSON body', async () => {
    fetchMock.mockResolvedValue(jsonResponse(201, { data: { id: 'a' } }));
    await apiRequest('/bookings', { method: 'POST', body: { serviceId: 'personal' } });
    const init = fetchMock.mock.calls[0][1];
    expect(init.method).toBe('POST');
    expect(init.headers['Content-Type']).toBe('application/json');
    expect(init.body).toBe('{"serviceId":"personal"}');
  });

  it('converts an error envelope into ApiError', async () => {
    const details = [{ path: 'startAt', message: 'bad' }];
    fetchMock.mockResolvedValue(
      jsonResponse(409, { error: { code: 'SLOT_TAKEN', message: '此時段已被預約', details } }),
    );
    const error = await apiRequest('/bookings').catch((caught) => caught);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 409,
      code: 'SLOT_TAKEN',
      message: '此時段已被預約',
      details,
    });
  });

  it('handles a non-JSON error response', async () => {
    fetchMock.mockResolvedValue(new Response('<html>', { status: 502 }));
    const error = await apiRequest('/services').catch((caught) => caught);
    expect(error).toMatchObject({ status: 502, code: 'INTERNAL' });
  });

  it('reports a network failure as ApiError', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    const error = await apiRequest('/services').catch((caught) => caught);
    expect(error).toMatchObject({ status: 0, code: 'NETWORK_ERROR' });
  });

  it('aborts after the timeout', async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation(
      (url, { signal }) =>
        new Promise((resolve, reject) => {
          signal.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          );
        }),
    );
    const request = apiRequest('/services').catch((caught) => caught);
    await vi.advanceTimersByTimeAsync(10000);
    expect(await request).toMatchObject({ code: 'TIMEOUT' });
  });
});
