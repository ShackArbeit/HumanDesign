import { rateLimit } from 'express-rate-limit';

// Counters live per instance. That is enough to slow down abuse on a small service;
// a strict global limit would need a shared store.
export const createBookingRateLimit = (limit) =>
  rateLimit({
    windowMs: 60 * 1000,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res) =>
      res
        .status(429)
        .json({ error: { code: 'RATE_LIMITED', message: '請求過於頻繁，請稍後再試' } }),
  });
