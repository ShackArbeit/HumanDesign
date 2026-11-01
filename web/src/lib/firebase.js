import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let auth;

export const getFirebaseAuth = () => {
  if (auth) return auth;
  auth = getAuth(initializeApp(firebaseConfig));
  const emulatorUrl = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL;
  if (emulatorUrl) connectAuthEmulator(auth, emulatorUrl, { disableWarnings: true });
  return auth;
};
