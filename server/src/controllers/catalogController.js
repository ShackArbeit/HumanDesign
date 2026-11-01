import { notFound } from '../lib/errors.js';
import * as catalogRepository from '../repositories/catalogRepository.js';
import { contentSections } from '../schemas/content.js';

export const listServices = async (req, res) => {
  const services = await catalogRepository.listActiveServices();
  res.json({
    data: services.map(({ id, name, description, options, imagePath }) => ({
      id,
      name,
      description,
      options,
      imagePath,
    })),
  });
};

export const getContent = async (req, res) => {
  const { section } = req.validated.params;
  const items = contentSections.includes(section)
    ? await catalogRepository.getContentSection(section)
    : null;
  if (!items) throw notFound('找不到此內容');
  res.json({ data: items });
};

export const listAboutTimeline = async (req, res) => {
  res.json({ data: await catalogRepository.listAboutTimeline() });
};

export const listFeedbackVideos = async (req, res) => {
  res.json({ data: await catalogRepository.listFeedbackVideos() });
};
