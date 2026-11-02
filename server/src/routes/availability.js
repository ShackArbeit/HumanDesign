import { Router } from 'express';
import { computeAvailability, getDayRange } from '../lib/availability.js';
import {
  getScheduleRules,
  listBookingsStartingBetween,
  listClosures,
} from '../lib/database.js';
import { noStore } from '../middleware/cache.js';
import { validate } from '../middleware/validate.js';
import { availabilityQuery } from '../schemas/availability.js';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function createAvailabilityRouter({ now }) {
  const router = Router();

  router.get('/availability', noStore, validate({ query: availabilityQuery }), async (req, res) => {
    const { from, to, durationMin } = req.validated.query;

    const rules = await getScheduleRules();
    const closures = await listClosures(from, to);

    // Start one day earlier to include a booking that runs into the first day.
    const { startMs, endMs } = getDayRange(from, to, rules.timezone);
    const bookings = await listBookingsStartingBetween(startMs - ONE_DAY_MS, endMs);

    const data = computeAvailability({
      rules,
      closures,
      bookings,
      from,
      to,
      now: now(),
      durationMin,
    });
    res.json({ data });
  });

  return router;
}
