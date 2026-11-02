// 建立 Express app。獨立成一個檔案，測試時才能直接使用，不用真的啟動伺服器。
import express from 'express';
import helmet from 'helmet';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { createAvailabilityRouter } from './routes/availability.js';
import { createBookingsRouter } from './routes/bookings.js';

const DEFAULT_BOOKING_RATE_LIMIT = 10;

// mail 和 now 由外部傳入，測試時可以換成假的寄信功能和固定時間
export function createApp({
  mail,
  webBaseUrl,
  now = () => new Date(),
  rateLimitMax = DEFAULT_BOOKING_RATE_LIMIT,
  trustProxyHops = 1,
  logRequests = true,
}) {
  const app = express();

  app.set('trust proxy', trustProxyHops);
  app.disable('x-powered-by');
  app.use(helmet());
  if (logRequests) {
    app.use(requestLogger);
  }
  app.use(express.json({ limit: '10kb' }));

  // 健康檢查，用來確認服務有在運作
  app.get('/api/v1/health', (req, res) => {
    res.json({ data: { status: 'ok' } });
  });
  app.use('/api/v1', createAvailabilityRouter({ now }));
  app.use('/api/v1', createBookingsRouter({ mail, now, webBaseUrl, rateLimitMax }));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
