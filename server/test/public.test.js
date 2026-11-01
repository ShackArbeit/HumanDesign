import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../src/lib/firebase.js';
import { contentSections } from '../src/schemas/content.js';
import { buildApp, resetDatabase } from './helpers.js';

describe('public API', () => {
  let api;

  beforeEach(async () => {
    await resetDatabase();
    api = request(buildApp().app);
  });

  it('reports health', async () => {
    const response = await api.get('/api/v1/health').expect(200);
    expect(response.body.data.status).toBe('ok');
  });

  it('lists services with 60 and 120 minute options, cached', async () => {
    const response = await api.get('/api/v1/services').expect(200);
    expect(response.headers['cache-control']).toBe('public, max-age=300');
    expect(response.body.data.map((service) => service.id)).toEqual([
      'personal',
      'multi-person',
      'family',
      'group',
    ]);
    expect(response.body.data[0].options).toEqual([
      { durationMin: 60, priceTwd: 5000 },
      { durationMin: 120, priceTwd: 9000 },
    ]);
  });

  it.each(contentSections)('serves the %s section', async (section) => {
    const response = await api.get(`/api/v1/content/${section}`).expect(200);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(JSON.stringify(response.body.data)).not.toContain('localhost');
  });

  it('returns 404 for an unknown section', async () => {
    const response = await api.get('/api/v1/content/nope').expect(404);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });

  it('serves the timeline in year order and the videos', async () => {
    const timeline = await api.get('/api/v1/about/timeline').expect(200);
    expect(timeline.body.data.map((entry) => entry.year)).toEqual([
      '2013',
      '2016',
      '2019',
      '2021',
      '2022',
    ]);
    const videos = await api.get('/api/v1/feedback/videos').expect(200);
    expect(videos.body.data[0].youtubeId).toBe('rkgEqVzYbzY');
  });

  describe('GET /availability', () => {
    const url = '/api/v1/availability';

    it('is not cached and shows a booking without its owner', async () => {
      await api
        .post('/api/v1/bookings')
        .send({
          serviceId: 'personal',
          durationMin: 60,
          startAt: '2026-11-10T02:00:00Z',
          guestEmail: 'private@example.test',
        })
        .expect(201);

      const response = await api
        .get(`${url}?from=2026-11-10&to=2026-11-10&durationMin=60`)
        .expect(200);
      expect(response.headers['cache-control']).toBe('no-store');
      expect(response.body.data.days[0].slots[0].status).toBe('booked');
      expect(JSON.stringify(response.body)).not.toContain('private@example.test');
    });

    it('applies a closure stored in Firestore', async () => {
      await db()
        .collection('closures')
        .doc('2026-11-10')
        .set({ reason: '國定假日休息', ranges: null });
      const response = await api.get(`${url}?from=2026-11-10&to=2026-11-11`).expect(200);
      expect(response.body.data.days[0].closedReason).toBe('國定假日休息');
      expect(response.body.data.days[1].closedReason).toBeNull();
    });

    it.each([
      ['from=2026-11-10&to=2026-12-11'],
      ['from=2026-11-10'],
      ['from=2026-11-12&to=2026-11-10'],
      ['from=2026-02-30&to=2026-03-01'],
    ])('returns 400 for %s', async (query) => {
      const response = await api.get(`${url}?${query}`).expect(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('accepts a 31-day range', async () => {
      const response = await api.get(`${url}?from=2026-11-01&to=2026-12-01`).expect(200);
      expect(response.body.data.days).toHaveLength(31);
    });
  });

  it('returns the error envelope for unknown routes and bad JSON', async () => {
    const missing = await api.get('/api/v1/nope').expect(404);
    expect(missing.body.error.code).toBe('NOT_FOUND');
    const malformed = await api
      .post('/api/v1/bookings')
      .set('Content-Type', 'application/json')
      .send('{bad')
      .expect(400);
    expect(malformed.body.error.code).toBe('VALIDATION_ERROR');
  });
});
