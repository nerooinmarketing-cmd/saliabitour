import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC6OCQCstDOI2KtL35kzSEMqOtgZ7xMxTQ",
  authDomain: "bytour-6b314.firebaseapp.com",
  projectId: "bytour-6b314",
  storageBucket: "bytour-6b314.firebasestorage.app",
  messagingSenderId: "1026453791267",
  appId: "1:1026453791267:web:d181862cfdfe5c0ae70796",
  measurementId: "G-GG1GXS1K6V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
