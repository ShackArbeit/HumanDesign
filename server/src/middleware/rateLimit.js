import { rateLimit } from 'express-rate-limit';

// 限制同一個 IP 的預約次數，避免惡意大量送出。
// 計數存在各個執行個體內，小型服務這樣就足夠
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
