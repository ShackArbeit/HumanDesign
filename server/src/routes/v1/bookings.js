import { Router } from 'express';
import { createBookingController } from '../../controllers/bookingController.js';
import { optionalAuth, requireAuth } from '../../middleware/auth.js';
import { noStore } from '../../middleware/cache.js';
import { createBookingRateLimit } from '../../middleware/rateLimit.js';
import { validate } from '../../middleware/validate.js';
import { bookingParams, cancelBookingQuery, createBookingBody } from '../../schemas/bookings.js';

export const createBookingsRouter = ({ bookingService, rateLimitMax }) => {
  const router = Router();
  const controller = createBookingController(bookingService);

  router.post(
    '/bookings',
    noStore,
    createBookingRateLimit(rateLimitMax),
    optionalAuth,
    validate({ body: createBookingBody }),
    controller.create,
  );
  router.delete(
    '/bookings/:id',
    noStore,
    optionalAuth,
    validate({ params: bookingParams, query: cancelBookingQuery }),
    controller.cancel,
  );
  router.get('/me/bookings', noStore, requireAuth, controller.listMine);
  return router;
};
