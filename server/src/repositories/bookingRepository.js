import { Timestamp } from 'firebase-admin/firestore';
import { notFound, slotTaken } from '../lib/errors.js';
import { db } from '../lib/firebase.js';

const bookings = () => db().collection('bookings');
const slotLocks = () => db().collection('slotLocks');

const fromDoc = (doc) => {
  const data = doc.data();
  return {
    ...data,
    id: doc.id,
    startAt: data.startAt.toDate(),
    endAt: data.endAt.toDate(),
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };
};

export const createWithLocks = (booking, locks, now) =>
  db().runTransaction(async (transaction) => {
    const lockRefs = locks.map((lock) => slotLocks().doc(lock.id));
    const lockDocs = await transaction.getAll(...lockRefs);
    if (lockDocs.some((doc) => doc.exists)) throw slotTaken();

    const bookingRef = bookings().doc();
    const timestamp = Timestamp.fromDate(now);
    transaction.create(bookingRef, {
      ...booking,
      startAt: Timestamp.fromDate(booking.startAt),
      endAt: Timestamp.fromDate(booking.endAt),
      slotLockIds: locks.map((lock) => lock.id),
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    locks.forEach((lock, index) => {
      transaction.create(lockRefs[index], {
        bookingId: bookingRef.id,
        startAt: Timestamp.fromDate(lock.startAt),
      });
    });
    return bookingRef.id;
  });

// authorize runs inside the transaction so its checks see the committed state.
export const cancelWithLocks = (id, authorize, now) =>
  db().runTransaction(async (transaction) => {
    const ref = bookings().doc(id);
    const doc = await transaction.get(ref);
    if (!doc.exists) throw notFound('找不到此預約');

    const booking = fromDoc(doc);
    if (booking.status === 'cancelled') return booking;
    authorize(booking);

    const updatedAt = Timestamp.fromDate(now);
    transaction.update(ref, { status: 'cancelled', updatedAt });
    booking.slotLockIds.forEach((lockId) => transaction.delete(slotLocks().doc(lockId)));
    return { ...booking, status: 'cancelled', updatedAt: now };
  });

export const listStartingBetween = async (startMs, endMs) => {
  const snapshot = await bookings()
    .where('startAt', '>=', Timestamp.fromMillis(startMs))
    .where('startAt', '<', Timestamp.fromMillis(endMs))
    .get();
  return snapshot.docs.map(fromDoc);
};

export const listByUser = async (userId) => {
  const snapshot = await bookings()
    .where('userId', '==', userId)
    .orderBy('startAt', 'desc')
    .get();
  return snapshot.docs.map(fromDoc);
};
