// 週曆 API：回傳某段日期內每個時段的狀態。
import { Router } from 'express';
import { defaultScheduleRules as rules } from '../config/scheduleRules.js';
import { computeAvailability, getDayRange } from '../lib/availability.js';
import { listBookingsStartingBetween, listClosures } from '../lib/database.js';
import { noStore } from '../middleware/cache.js';
import { validate } from '../middleware/validate.js';
import { availabilityQuery } from '../schemas/availability.js';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function createAvailabilityRouter({ now }) {
  const router = Router();

  // GET /availability?from=2026-11-05&to=2026-11-11&durationMin=60
  router.get('/availability', noStore, validate({ query: availabilityQuery }), async (req, res) => {
    const { from, to, durationMin } = req.validated.query;

    const closures = await listClosures(from, to);

    // 往前多查一天，才不會漏掉跨到第一天的預約
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
