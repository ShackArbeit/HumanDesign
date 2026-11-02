import { Router } from 'express';
import {
  getContentSection,
  listAboutTimeline,
  listActiveServices,
  listFeedbackVideos,
} from '../lib/database.js';
import { notFound } from '../lib/errors.js';
import { publicCache } from '../middleware/cache.js';
import { validate } from '../middleware/validate.js';
import { contentParams, contentSections } from '../schemas/content.js';

export const contentRouter = Router();

contentRouter.get('/services', publicCache, async (req, res) => {
  const services = await listActiveServices();

  const data = [];
  for (const service of services) {
    data.push({
      id: service.id,
      name: service.name,
      description: service.description,
      options: service.options,
      imagePath: service.imagePath,
    });
  }
  res.json({ data });
});

contentRouter.get(
  '/content/:section',
  publicCache,
  validate({ params: contentParams }),
  async (req, res) => {
    const { section } = req.validated.params;

    if (!contentSections.includes(section)) {
      throw notFound('找不到此內容');
    }

    const items = await getContentSection(section);
    if (!items) {
      throw notFound('找不到此內容');
    }
    res.json({ data: items });
  },
);

contentRouter.get('/about/timeline', publicCache, async (req, res) => {
  const data = await listAboutTimeline();
  res.json({ data });
});

contentRouter.get('/feedback/videos', publicCache, async (req, res) => {
  const data = await listFeedbackVideos();
  res.json({ data });
});
