import 'dotenv/config';
import { pathToFileURL } from 'node:url';
import { defaultScheduleRules } from '../src/config/scheduleRules.js';
import { db } from '../src/lib/firebase.js';
import { aboutTimeline, content, feedbackVideos } from './seedContent.js';
import { services } from './seedServices.js';

export const seedAll = async () => {
  const firestore = db();
  const writer = firestore.bulkWriter();

  for (const { id, ...service } of services) {
    writer.set(firestore.collection('services').doc(id), service);
  }
  for (const [section, items] of Object.entries(content)) {
    writer.set(firestore.collection('content').doc(section), { items });
  }
  for (const { year, ...entry } of aboutTimeline) {
    writer.set(firestore.collection('aboutTimeline').doc(year), entry);
  }
  for (const { id, ...video } of feedbackVideos) {
    writer.set(firestore.collection('feedbackVideos').doc(id), video);
  }
  writer.set(firestore.collection('settings').doc('schedule'), defaultScheduleRules);
  await writer.close();
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const toProduction = process.argv.includes('--production');
  if (!process.env.FIRESTORE_EMULATOR_HOST && !toProduction) {
    console.error('FIRESTORE_EMULATOR_HOST is not set. Pass --production to seed a real project.');
    process.exit(1);
  }
  await seedAll();
  console.log('Seed complete');
  process.exit(0);
}
