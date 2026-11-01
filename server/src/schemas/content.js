import { z } from 'zod';

export const contentSections = [
  'home-services',
  'booking-process',
  'hd-index',
  'hd-overview',
  'hd-types',
  'hd-profiles',
  'hd-authority',
  'hd-centers',
  'hd-channels',
  'hd-cross',
  'hd-origin',
];

export const contentParams = z.object({ section: z.string().min(1).max(50) });
