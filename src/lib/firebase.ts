
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

const firebaseConfig: FirebaseOptions = {
  projectId: "spend-5vu0f",
  appId: "1:1068565293615:web:a2f86e579ccad72c1334da",
  storageBucket: "spend-5vu0f.firebasestorage.app",
  apiKey: "AIzaSyD88tMZfM9lG5K2gAgvEOBoMS4gTjS4VF0",
  authDomain: "spend-5vu0f.firebaseapp.com",
  messagingSenderId: "1068565293615",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const functions = getFunctions(app, 'us-central1');

export { app, auth, functions, httpsCallable };
