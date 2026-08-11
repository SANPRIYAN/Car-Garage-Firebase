import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// All values come from your .env file (see notes below)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Simple check so you get a clear error instead of a confusing crash later
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'appId'];
const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);
if (missingKeys.length > 0) {
  throw new Error(`Missing Firebase config values: ${missingKeys.join(', ')}. Check your .env file.`);
}

const app = initializeApp(firebaseConfig);

// Auth is now handled by Auth0 — Firebase is only used for Firestore (database) and Functions
export const db = getFirestore(app);
export const functions = getFunctions(app);

