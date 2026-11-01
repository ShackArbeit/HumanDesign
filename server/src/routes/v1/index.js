import { Router } from 'express';
import { createAvailabilityRouter } from './availability.js';
import { createBookingsRouter } from './bookings.js';
import { contentRouter } from './content.js';

export const createV1Router = ({ bookingService, now, rateLimitMax }) => {
  const router = Router();
  router.get('/health', (req, res) => res.json({ data: { status: 'ok' } }));
  router.use(createAvailabilityRouter({ now }));
  router.use(createBookingsRouter({ bookingService, rateLimitMax }));
  router.use(contentRouter);
  return router;
};
