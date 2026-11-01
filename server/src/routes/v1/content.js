import { Router } from 'express';
import * as controller from '../../controllers/catalogController.js';
import { publicCache } from '../../middleware/cache.js';
import { validate } from '../../middleware/validate.js';
import { contentParams } from '../../schemas/content.js';

export const contentRouter = Router();

contentRouter.get('/services', publicCache, controller.listServices);
contentRouter.get(
  '/content/:section',
  publicCache,
  validate({ params: contentParams }),
  controller.getContent,
);
contentRouter.get('/about/timeline', publicCache, controller.listAboutTimeline);
contentRouter.get('/feedback/videos', publicCache, controller.listFeedbackVideos);
