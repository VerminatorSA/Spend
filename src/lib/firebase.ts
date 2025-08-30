
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "spend-5vu0f.firebaseapp.com",
  projectId: "spend-5vu0f",
  storageBucket: "spend-5vu0f.firebasestorage.app",
  messagingSenderId: "1068565293615",
  appId: "1:1068565293615:web:a2f86e579ccad72c1334da",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const functions = getFunctions(app);

export { app, functions, httpsCallable };
