// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics"; // optional

const firebaseConfig = {
  apiKey: "AIzaSyBKLSFurBMdUF7JEeW0bkm9l5Fi6dBi9Y4",
  authDomain: "pawhelp-fd40c.firebaseapp.com",
  projectId: "pawhelp-fd40c",
  storageBucket: "pawhelp-fd40c.firebasestorage.app",
  messagingSenderId: "988771978496",
  appId: "1:988771978496:web:c34ad51e586b5d3bfcb7e5",
  measurementId: "G-YVYQZ1P0CQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ REQUIRED EXPORTS
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
