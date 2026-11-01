import express from 'express';
import helmet from 'helmet';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { createV1Router } from './routes/v1/index.js';
import { createBookingService } from './services/bookingService.js';

const DEFAULT_BOOKING_RATE_LIMIT = 10;

// Dependencies are injected so tests can control the clock and capture emails.
export const createApp = ({
  mail,
  webBaseUrl,
  now = () => new Date(),
  rateLimitMax = DEFAULT_BOOKING_RATE_LIMIT,
  trustProxyHops = 1,
  logRequests = true,
}) => {
  const app = express();
  const bookingService = createBookingService({ mail, now, webBaseUrl });

  app.set('trust proxy', trustProxyHops);
  app.disable('x-powered-by');
  app.use(helmet());
  if (logRequests) app.use(requestLogger);
  app.use(express.json({ limit: '10kb' }));
  app.use('/api/v1', createV1Router({ bookingService, now, rateLimitMax }));
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};
