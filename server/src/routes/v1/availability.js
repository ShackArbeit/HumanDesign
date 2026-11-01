import { Router } from 'express';
import { createAvailabilityController } from '../../controllers/availabilityController.js';
import { noStore } from '../../middleware/cache.js';
import { validate } from '../../middleware/validate.js';
import { availabilityQuery } from '../../schemas/availability.js';

export const createAvailabilityRouter = ({ now }) => {
  const router = Router();
  router.get(
    '/availability',
    noStore,
    validate({ query: availabilityQuery }),
    createAvailabilityController({ now }),
  );
  return router;
};
