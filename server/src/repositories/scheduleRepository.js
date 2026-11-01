import { FieldPath } from 'firebase-admin/firestore';
import { defaultScheduleRules } from '../config/scheduleRules.js';
import { db } from '../lib/firebase.js';

export const getScheduleRules = async () => {
  const doc = await db().collection('settings').doc('schedule').get();
  return doc.exists ? doc.data() : defaultScheduleRules;
};

export const listClosures = async (from, to) => {
  const snapshot = await db()
    .collection('closures')
    .where(FieldPath.documentId(), '>=', from)
    .where(FieldPath.documentId(), '<=', to)
    .get();
  return snapshot.docs.map((doc) => ({ date: doc.id, ...doc.data() }));
};
