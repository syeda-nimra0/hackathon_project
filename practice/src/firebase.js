import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC8jZSiBMtwUQLP4h4YBqcOtP0ms9GHMKY",
  authDomain: "portal-598ba.firebaseapp.com",
  projectId: "portal-598ba",
  storageBucket: "portal-598ba.firebasestorage.app",
  messagingSenderId: "198492123660",
  appId: "1:198492123660:web:e4725b343565e69ec43429",
  measurementId: "G-XYW28HCKHR"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);