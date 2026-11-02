import { FieldPath, Timestamp } from 'firebase-admin/firestore';
import { defaultScheduleRules } from '../config/scheduleRules.js';
import { notFound, slotTaken } from './errors.js';
import { db } from './firebase.js';

// ---------- Services and page content ----------

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

// ---------- Business hours ----------

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

// ---------- Bookings ----------

function bookingsCollection() {
  return db().collection('bookings');
}

function slotLocksCollection() {
  return db().collection('slotLocks');
}

// Firestore returns Timestamp objects, so convert them to normal Dates.
function docToBooking(doc) {
  const data = doc.data();
  return {
    ...data,
    id: doc.id,
    startAt: data.startAt.toDate(),
    endAt: data.endAt.toDate(),
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };
}

// The transaction makes "check the locks, then save" one atomic step.
// If two people book at once, Firestore reruns one of them and it sees the lock.
export async function createBookingWithLocks(booking, locks, now) {
  return db().runTransaction(async (transaction) => {
    const lockRefs = [];
    const lockIds = [];
    for (const lock of locks) {
      lockRefs.push(slotLocksCollection().doc(lock.id));
      lockIds.push(lock.id);
    }

    const lockDocs = await transaction.getAll(...lockRefs);
    for (const lockDoc of lockDocs) {
      if (lockDoc.exists) {
        throw slotTaken();
      }
    }

    const bookingRef = bookingsCollection().doc();
    const timestamp = Timestamp.fromDate(now);

    transaction.create(bookingRef, {
      ...booking,
      startAt: Timestamp.fromDate(booking.startAt),
      endAt: Timestamp.fromDate(booking.endAt),
      slotLockIds: lockIds,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    for (let i = 0; i < locks.length; i += 1) {
      transaction.create(lockRefs[i], {
        bookingId: bookingRef.id,
        startAt: Timestamp.fromDate(locks[i].startAt),
      });
    }

    return bookingRef.id;
  });
}

export async function cancelBookingWithLocks(id, checkCanCancel, now) {
  return db().runTransaction(async (transaction) => {
    const bookingRef = bookingsCollection().doc(id);
    const doc = await transaction.get(bookingRef);
    if (!doc.exists) {
      throw notFound('找不到此預約');
    }

    const booking = docToBooking(doc);
    if (booking.status === 'cancelled') {
      return booking;
    }
    checkCanCancel(booking);

    transaction.update(bookingRef, {
      status: 'cancelled',
      updatedAt: Timestamp.fromDate(now),
    });
    for (const lockId of booking.slotLockIds) {
      transaction.delete(slotLocksCollection().doc(lockId));
    }

    booking.status = 'cancelled';
    booking.updatedAt = now;
    return booking;
  });
}

export async function listBookingsStartingBetween(startMs, endMs) {
  const snapshot = await bookingsCollection()
    .where('startAt', '>=', Timestamp.fromMillis(startMs))
    .where('startAt', '<', Timestamp.fromMillis(endMs))
    .get();

  const bookings = [];
  for (const doc of snapshot.docs) {
    bookings.push(docToBooking(doc));
  }
  return bookings;
}

export async function listBookingsByUser(userId) {
  const snapshot = await bookingsCollection()
    .where('userId', '==', userId)
    .orderBy('startAt', 'desc')
    .get();

  const bookings = [];
  for (const doc of snapshot.docs) {
    bookings.push(docToBooking(doc));
  }
  return bookings;
}
