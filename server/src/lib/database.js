// 所有 Firestore 的讀寫都放在這裡。
// 目前只存兩種預約資料：bookings（預約內容）和 slotLocks（時段鎖）。
import { FieldPath, Timestamp } from 'firebase-admin/firestore';
import { notFound, slotTaken } from './errors.js';
import { db } from './firebase.js';

function bookingsCollection() {
  return db().collection('bookings');
}

function slotLocksCollection() {
  return db().collection('slotLocks');
}

// Firestore 讀出來的時間是 Timestamp，這裡轉成一般的 Date 比較好用
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

// 查詢休息日。文件 id 就是日期，例如 2026-11-05。
// 想臨時休息時，到 Firestore 的 closures 新增一筆文件即可。
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

// 建立預約，並鎖住它占用的所有時段。
// transaction 讓「檢查有沒有被鎖」和「寫入」變成一個不可分割的動作。
// 兩個人同時預約時，Firestore 會讓其中一人重試，重試時就會看到鎖而失敗。
export async function createBookingWithLocks(booking, locks, now) {
  return db().runTransaction(async (transaction) => {
    const lockRefs = [];
    const lockIds = [];
    for (const lock of locks) {
      lockRefs.push(slotLocksCollection().doc(lock.id));
      lockIds.push(lock.id);
    }

    // 任何一格已經被鎖，就代表時段被預約了
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

// 取消預約：預約紀錄保留、狀態改成 cancelled，並刪除時段鎖讓別人能預約。
// checkCanCancel 放在 transaction 內執行，確保檢查時看到的是最新資料。
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

// 查詢某段時間內開始的預約，用來計算週曆
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

// 查詢某位會員自己的預約，新的排在前面
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
