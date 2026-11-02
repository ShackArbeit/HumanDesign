import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// 在 Cloud Run 上會自動使用服務帳戶的權限，所以不需要放 JSON 金鑰
const app = () => {
  if (getApps().length > 0) return getApps()[0];
  const projectId = process.env.GOOGLE_CLOUD_PROJECT ?? process.env.GCLOUD_PROJECT;
  return initializeApp(projectId ? { projectId } : undefined);
};

export const db = () => getFirestore(app());
export const auth = () => getAuth(app());
