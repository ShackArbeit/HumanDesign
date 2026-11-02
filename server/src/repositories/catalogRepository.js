import { db } from '../lib/firebase.js';

export async function listActiveServices() {
  const snapshot = await db().collection('services').orderBy('order').get();

  const services = [];
  for (const doc of snapshot.docs) {
    const service = { id: doc.id, ...doc.data() };
    if (service.active) {
      services.push(service);
    }
  }
  return services;
}

export async function getService(id) {
  const doc = await db().collection('services').doc(id).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() };
}

export async function getContentSection(section) {
  const doc = await db().collection('content').doc(section).get();
  if (!doc.exists) {
    return null;
  }
  return doc.data().items;
}

export async function listAboutTimeline() {
  const snapshot = await db().collection('aboutTimeline').get();

  const timeline = [];
  for (const doc of snapshot.docs) {
    timeline.push({ year: doc.id, ...doc.data() });
  }
  return timeline;
}

export async function listFeedbackVideos() {
  const snapshot = await db().collection('feedbackVideos').orderBy('order').get();

  const videos = [];
  for (const doc of snapshot.docs) {
    const data = doc.data();
    videos.push({
      id: doc.id,
      title: data.title,
      body: data.body,
      youtubeId: data.youtubeId,
      imagePath: data.imagePath,
    });
  }
  return videos;
}
