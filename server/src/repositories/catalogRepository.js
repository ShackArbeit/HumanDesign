import { db } from '../lib/firebase.js';

export const listActiveServices = async () => {
  const snapshot = await db().collection('services').orderBy('order').get();
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((service) => service.active);
};

export const getService = async (id) => {
  const doc = await db().collection('services').doc(id).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

export const getContentSection = async (section) => {
  const doc = await db().collection('content').doc(section).get();
  return doc.exists ? doc.data().items : null;
};

export const listAboutTimeline = async () => {
  const snapshot = await db().collection('aboutTimeline').get();
  return snapshot.docs.map((doc) => ({ year: doc.id, ...doc.data() }));
};

export const listFeedbackVideos = async () => {
  const snapshot = await db().collection('feedbackVideos').orderBy('order').get();
  return snapshot.docs.map((doc) => {
    const { title, body, youtubeId, imagePath } = doc.data();
    return { id: doc.id, title, body, youtubeId, imagePath };
  });
};
