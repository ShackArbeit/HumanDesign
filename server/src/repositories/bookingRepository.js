import { Timestamp } from 'firebase-admin/firestore';
import { notFound, slotTaken } from '../lib/errors.js';
import { db } from '../lib/firebase.js';

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
export async function createWithLocks(booking, locks, now) {
  return db().runTransaction(async (transaction) => {
    const lockRefs = [];
    for (const lock of locks) {
      lockRefs.push(slotLocksCollection().doc(lock.id));
    }

    const lockDocs = await transaction.getAll(...lockRefs);
    for (const lockDoc of lockDocs) {
      if (lockDoc.exists) {
        throw slotTaken();
      }
    }

    const bookingRef = bookingsCollection().doc();
    const timestamp = Timestamp.fromDate(now);
    const lockIds = [];
    for (const lock of locks) {
      lockIds.push(lock.id);
    }

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

export async function cancelWithLocks(id, checkCanCancel, now) {
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

export async function listStartingBetween(startMs, endMs) {
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

export async function listByUser(userId) {
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
