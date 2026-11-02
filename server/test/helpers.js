import { createApp } from '../src/app.js';
import { db } from '../src/lib/firebase.js';

export const NOW = new Date('2026-11-01T02:00:00Z');

export const buildApp = (overrides = {}) => {
  const sent = [];
  const app = createApp({
    mail: {
      sendBookingConfirmation: async (message) => {
        sent.push(message);
      },
    },
    webBaseUrl: 'https://example.test',
    now: () => NOW,
    rateLimitMax: 1000,
    logRequests: false,
    ...overrides,
  });
  return { app, sent };
};

const projectId = () => process.env.GCLOUD_PROJECT ?? process.env.GOOGLE_CLOUD_PROJECT;

// 每個測試開始前清空 Emulator 的資料
export const resetDatabase = async () => {
  const url = `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${projectId()}/databases/(default)/documents`;
  await fetch(url, { method: 'DELETE' });
};

export const signUp = async (email) => {
  const url = `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'test-password', returnSecureToken: true }),
  });
  const { idToken } = await response.json();
  return idToken;
};

export const countLocks = async () => (await db().collection('slotLocks').get()).size;
