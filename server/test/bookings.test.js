import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../src/lib/firebase.js';
import { buildApp, countLocks, resetDatabase, signUp } from './helpers.js';

// Tuesday 2026-11-10 10:00 in Taipei.
const START = '2026-11-10T02:00:00Z';
const memberBooking = (overrides = {}) => ({
  serviceId: 'personal',
  durationMin: 120,
  startAt: START,
  ...overrides,
});
const guestBooking = (overrides = {}) =>
  memberBooking({ guestEmail: 'guest@example.test', ...overrides });
const uniqueEmail = () => `${randomUUID()}@example.test`;
const bearer = (token) => ({ Authorization: `Bearer ${token}` });
const statuses = (responses) => responses.map((response) => response.status).sort();

describe('bookings API', () => {
  let sent;
  let api;

  beforeEach(async () => {
    await resetDatabase();
    const built = buildApp();
    sent = built.sent;
    api = request(built.app);
  });

  describe('POST /bookings', () => {
    it('creates a guest booking priced by the server', async () => {
      const response = await api.post('/api/v1/bookings').send(guestBooking()).expect(201);
      expect(response.body.data).toMatchObject({
        serviceId: 'personal',
        priceTwd: 9000,
        status: 'pending_payment',
      });
      expect(response.body.data.cancelToken).toEqual(expect.any(String));
      expect(response.body.data.cancelTokenHash).toBeUndefined();
      expect(response.body.data.slotLockIds).toBeUndefined();
      expect(sent).toHaveLength(1);
      expect(sent[0].to).toBe('guest@example.test');
    });

    it('rejects unknown fields such as a client-supplied price', async () => {
      const body = guestBooking({ priceTwd: 1 });
      const response = await api.post('/api/v1/bookings').send(body).expect(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('returns 400 when a guest omits the email', async () => {
      const response = await api.post('/api/v1/bookings').send(memberBooking()).expect(400);
      expect(response.body.error.details[0].path).toBe('guestEmail');
    });

    it.each([60, 90])('returns 400 for a %i-minute duration', async (durationMin) => {
      const body = guestBooking({ durationMin });
      await api.post('/api/v1/bookings').send(body).expect(400);
    });

    it('returns 404 for an unknown service', async () => {
      const body = guestBooking({ serviceId: 'nope' });
      await api.post('/api/v1/bookings').send(body).expect(404);
    });

    it.each([
      ['2026-11-02T02:00:00Z', 'TOO_SOON'],
      ['2027-02-02T02:00:00Z', 'TOO_FAR'],
      ['2026-11-09T02:00:00Z', 'OUTSIDE_BUSINESS_HOURS'],
    ])('returns 422 for %s', async (startAt, code) => {
      const body = guestBooking({ startAt });
      const response = await api.post('/api/v1/bookings').send(body).expect(422);
      expect(response.body.error.code).toBe(code);
    });

    it('allows only one of two concurrent requests for the same slot', async () => {
      const responses = await Promise.all([
        api.post('/api/v1/bookings').send(guestBooking()),
        api.post('/api/v1/bookings').send(guestBooking({ guestEmail: 'other@example.test' })),
      ]);
      expect(statuses(responses)).toEqual([201, 409]);
      expect(await countLocks()).toBe(1);
    });

    it('lets back-to-back slots be booked because there is no buffer', async () => {
      await api.post('/api/v1/bookings').send(guestBooking()).expect(201);
      const earlier = guestBooking({ startAt: '2026-11-10T00:00:00Z' });
      await api.post('/api/v1/bookings').send(earlier).expect(201);
    });

    it('returns 409 when the slot is already booked', async () => {
      await api.post('/api/v1/bookings').send(guestBooking()).expect(201);
      const response = await api.post('/api/v1/bookings').send(guestBooking()).expect(409);
      expect(response.body.error.code).toBe('SLOT_TAKEN');
    });

    it('returns 422 for a start in the middle of a slot', async () => {
      const offGrid = guestBooking({ startAt: '2026-11-10T03:00:00Z' });
      const response = await api.post('/api/v1/bookings').send(offGrid).expect(422);
      expect(response.body.error.code).toBe('OUTSIDE_BUSINESS_HOURS');
    });

    it('still succeeds when the confirmation email fails', async () => {
      const failing = buildApp({
        mail: {
          sendBookingConfirmation: async () => {
            throw new Error('smtp down');
          },
        },
      });
      const response = await request(failing.app)
        .post('/api/v1/bookings')
        .send(guestBooking())
        .expect(201);
      expect(response.body.data.emailSent).toBe(false);
    });

    it('returns the payment details and reports the email as sent', async () => {
      const response = await api.post('/api/v1/bookings').send(guestBooking()).expect(201);
      expect(response.body.data.emailSent).toBe(true);
      expect(response.body.data.paymentInfo.isDemo).toBe(true);
    });

    it('rejects an invalid token instead of falling back to guest', async () => {
      await api.post('/api/v1/bookings').set(bearer('invalid')).send(guestBooking()).expect(401);
    });

    it('rate limits by client', async () => {
      const limited = request(buildApp({ rateLimitMax: 1 }).app);
      await limited.post('/api/v1/bookings').send(guestBooking()).expect(201);
      const response = await limited.post('/api/v1/bookings').send(guestBooking()).expect(429);
      expect(response.body.error.code).toBe('RATE_LIMITED');
    });
  });

  describe('GET /me/bookings', () => {
    it('requires authentication', async () => {
      await api.get('/api/v1/me/bookings').expect(401);
    });

    it('returns only the caller bookings', async () => {
      const mine = await signUp(uniqueEmail());
      const theirs = await signUp(uniqueEmail());
      const later = memberBooking({ startAt: '2026-11-10T06:00:00Z' });
      await api.post('/api/v1/bookings').set(bearer(mine)).send(memberBooking()).expect(201);
      await api.post('/api/v1/bookings').set(bearer(theirs)).send(later).expect(201);

      const response = await api.get('/api/v1/me/bookings').set(bearer(mine)).expect(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].startAt).toBe('2026-11-10T02:00:00.000Z');
    });
  });

  describe('DELETE /bookings/:id', () => {
    const createMember = async (token) => {
      const response = await api
        .post('/api/v1/bookings')
        .set(bearer(token))
        .send(memberBooking())
        .expect(201);
      return response.body.data.id;
    };

    it('lets a member cancel and frees the slot', async () => {
      const token = await signUp(uniqueEmail());
      const id = await createMember(token);

      const response = await api.delete(`/api/v1/bookings/${id}`).set(bearer(token)).expect(200);
      expect(response.body.data.status).toBe('cancelled');
      expect(await countLocks()).toBe(0);
      await api.post('/api/v1/bookings').send(guestBooking()).expect(201);
    });

    it('deletes the booking from the database when cancelled', async () => {
      const token = await signUp(uniqueEmail());
      const id = await createMember(token);

      await api.delete(`/api/v1/bookings/${id}`).set(bearer(token)).expect(200);

      const doc = await db().collection('bookings').doc(id).get();
      expect(doc.exists).toBe(false);
      const mine = await api.get('/api/v1/me/bookings').set(bearer(token)).expect(200);
      expect(mine.body.data).toHaveLength(0);
      await api.delete(`/api/v1/bookings/${id}`).set(bearer(token)).expect(404);
    });

    it('does not remove another booking lock when deleting an old cancelled record', async () => {
      const created = await api.post('/api/v1/bookings').send(guestBooking()).expect(201);
      const { id, cancelToken } = created.body.data;
      await db().collection('bookings').doc(id).update({ status: 'cancelled' });

      await api.delete(`/api/v1/bookings/${id}?token=${cancelToken}`).expect(200);
      expect(await countLocks()).toBe(1);
    });

    it('returns 403 for another member', async () => {
      const id = await createMember(await signUp(uniqueEmail()));
      const other = await signUp(uniqueEmail());
      await api.delete(`/api/v1/bookings/${id}`).set(bearer(other)).expect(403);
    });

    it('returns 401 for a member booking without a login', async () => {
      const id = await createMember(await signUp(uniqueEmail()));
      await api.delete(`/api/v1/bookings/${id}`).expect(401);
    });

    it('checks the guest cancel token', async () => {
      const created = await api.post('/api/v1/bookings').send(guestBooking()).expect(201);
      const { id, cancelToken } = created.body.data;
      await api.delete(`/api/v1/bookings/${id}?token=wrong`).expect(403);
      await api.delete(`/api/v1/bookings/${id}`).expect(403);
      await api.delete(`/api/v1/bookings/${id}?token=${cancelToken}`).expect(200);
    });

    it('returns 422 within 24 hours of the start', async () => {
      const created = await api.post('/api/v1/bookings').send(guestBooking()).expect(201);
      const { id, cancelToken } = created.body.data;
      const late = buildApp({ now: () => new Date('2026-11-09T03:00:00Z') });
      const response = await request(late.app)
        .delete(`/api/v1/bookings/${id}?token=${cancelToken}`)
        .expect(422);
      expect(response.body.error.code).toBe('TOO_LATE_TO_CANCEL');
    });

    it('returns 404 for an unknown booking', async () => {
      await api.delete('/api/v1/bookings/missing').expect(404);
    });
  });
});
