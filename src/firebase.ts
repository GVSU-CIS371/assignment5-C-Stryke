// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD99666drVz_ZYI3wx75IAkSDb4Pn8-IwM",
  authDomain: "https://gvsu-cis371.github.io/assignment5-C-Stryke/.firebaseapp.com",
  projectId: "https://gvsu-cis371.github.io/assignment5-C-Stryke/",
  storageBucket: "https://gvsu-cis371.github.io/assignment5-C-Stryke/.firebasestorage.app",
  messagingSenderId: "772947264565",
  appId: "1:772947264565:web:214eb352e7f99894da1d7c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Auth
export const auth = getAuth(app);

// Google Provider
export const googleProvider = new GoogleAuthProvider();
