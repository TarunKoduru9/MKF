// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDI-m-bq1PWrN47xY0QS5q7dqk9dJbm7nc",
  authDomain: "mkftrust-fe580.firebaseapp.com",
  projectId: "mkftrust-fe580",
  storageBucket: "mkftrust-fe580.firebasestorage.app",
  messagingSenderId: "815729834051",
  appId: "1:815729834051:web:46a0cf1be137a7a6eabcf6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);