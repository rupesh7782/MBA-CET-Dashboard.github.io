import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously, 
  signOut, 
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  collection,
  Firestore
} from 'firebase/firestore';
import configJson from '../../firebase-applet-config.json';

const fallbackConfig = {
  projectId: "gen-lang-client-0335069012",
  appId: "1:988546867051:web:9915dc5abfdee351ad762e",
  apiKey: "AIzaSyBYJa6wgBlCGPbrOzsBIN8UTs9UcHHDLj0",
  authDomain: "gen-lang-client-0335069012.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-missionjbims2027-a7eaec7c-e9f2-4923-a3b3-897db03193b0",
  storageBucket: "gen-lang-client-0335069012.firebasestorage.app",
  messagingSenderId: "988546867051"
};

const mergedConfig = {
  apiKey: configJson?.apiKey || fallbackConfig.apiKey,
  authDomain: configJson?.authDomain || fallbackConfig.authDomain,
  projectId: configJson?.projectId || fallbackConfig.projectId,
  storageBucket: configJson?.storageBucket || fallbackConfig.storageBucket,
  messagingSenderId: configJson?.messagingSenderId || fallbackConfig.messagingSenderId,
  appId: configJson?.appId || fallbackConfig.appId,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = !getApps().length ? initializeApp(mergedConfig) : getApps()[0];
  auth = getAuth(app);
  const dbId = configJson?.firestoreDatabaseId || fallbackConfig.firestoreDatabaseId;
  db = getFirestore(app, dbId || undefined);
} catch (error) {
  console.warn('Firebase initialization warning:', error);
  // Fallback if needed
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
}

export const googleProvider = new GoogleAuthProvider();

export {
  auth,
  db,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
};
export type { User };
