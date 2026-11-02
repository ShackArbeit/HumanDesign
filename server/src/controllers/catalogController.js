import { notFound } from '../lib/errors.js';
import {
  getContentSection,
  listAboutTimeline as findAboutTimeline,
  listActiveServices,
  listFeedbackVideos as findFeedbackVideos,
} from '../repositories/catalogRepository.js';
import { contentSections } from '../schemas/content.js';

export async function listServices(req, res) {
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
}

export async function getContent(req, res) {
  const { section } = req.validated.params;

  if (!contentSections.includes(section)) {
    throw notFound('找不到此內容');
  }

  const items = await getContentSection(section);
  if (!items) {
    throw notFound('找不到此內容');
  }
  res.json({ data: items });
}

export async function listAboutTimeline(req, res) {
  const data = await findAboutTimeline();
  res.json({ data });
}

export async function listFeedbackVideos(req, res) {
  const data = await findFeedbackVideos();
  res.json({ data });
}
