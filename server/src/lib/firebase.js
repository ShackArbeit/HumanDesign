import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// On Cloud Run this resolves the service account through Application Default
// Credentials, so no JSON key is ever deployed.
const app = () => {
  if (getApps().length > 0) return getApps()[0];
  const projectId = process.env.GOOGLE_CLOUD_PROJECT ?? process.env.GCLOUD_PROJECT;
  return initializeApp(projectId ? { projectId } : undefined);
};

export const db = () => getFirestore(app());
export const auth = () => getAuth(app());
