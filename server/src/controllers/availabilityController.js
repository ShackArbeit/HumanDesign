import { listStartingBetween } from '../repositories/bookingRepository.js';
import { getScheduleRules, listClosures } from '../repositories/scheduleRepository.js';
import { computeAvailability, getDayRange } from '../services/availabilityService.js';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function createAvailabilityController({ now }) {
  return async function getAvailability(req, res) {
    const { from, to, durationMin } = req.validated.query;

    const rules = await getScheduleRules();
    const closures = await listClosures(from, to);

    // Start one day earlier to include a booking that runs into the first day.
    const { startMs, endMs } = getDayRange(from, to, rules.timezone);
    const bookings = await listStartingBetween(startMs - ONE_DAY_MS, endMs);

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
  };
}
