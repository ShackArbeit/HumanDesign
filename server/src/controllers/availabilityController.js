import { listStartingBetween } from '../repositories/bookingRepository.js';
import { getScheduleRules, listClosures } from '../repositories/scheduleRepository.js';
import { computeAvailability, getDayRange } from '../services/availabilityService.js';

const DAY_MS = 24 * 60 * 60 * 1000;

export const createAvailabilityController =
  ({ now }) =>
  async (req, res) => {
    const { from, to, durationMin } = req.validated.query;
    const rules = await getScheduleRules();
    const { startMs, endMs } = getDayRange(from, to, rules.timezone);
    const [closures, bookings] = await Promise.all([
      listClosures(from, to),
      // Reach one day back to include a booking that spills into the requested range.
      listStartingBetween(startMs - DAY_MS, endMs),
    ]);
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
