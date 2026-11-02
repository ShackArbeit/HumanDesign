import { FieldPath } from 'firebase-admin/firestore';
import { defaultScheduleRules } from '../config/scheduleRules.js';
import { db } from '../lib/firebase.js';

export async function getScheduleRules() {
  const doc = await db().collection('settings').doc('schedule').get();
  if (!doc.exists) {
    return defaultScheduleRules;
  }
  return doc.data();
}

// Closure documents use the date as their id, for example 2026-11-05.
export async function listClosures(from, to) {
  const snapshot = await db()
    .collection('closures')
    .where(FieldPath.documentId(), '>=', from)
    .where(FieldPath.documentId(), '<=', to)
    .get();

  const closures = [];
  for (const doc of snapshot.docs) {
    closures.push({ date: doc.id, ...doc.data() });
  }
  return closures;
}
