import express from 'express';
import helmet from 'helmet';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { createAvailabilityRouter } from './routes/availability.js';
import { createBookingsRouter } from './routes/bookings.js';
import { contentRouter } from './routes/content.js';

const DEFAULT_BOOKING_RATE_LIMIT = 10;

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

  app.get('/api/v1/health', (req, res) => {
    res.json({ data: { status: 'ok' } });
  });
  app.use('/api/v1', createAvailabilityRouter({ now }));
  app.use('/api/v1', createBookingsRouter({ mail, now, webBaseUrl, rateLimitMax }));
  app.use('/api/v1', contentRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
