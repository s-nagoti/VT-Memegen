// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIjYzzT4B5F3izdlUlQgH-ZqM28cKQvyM",
  authDomain: "vthacks12-6ce70.firebaseapp.com",
  projectId: "vthacks12-6ce70",
  storageBucket: "vthacks12-6ce70.appspot.com",
  messagingSenderId: "398132871613",
  appId: "1:398132871613:web:690918c6d624ce420a52d4",
  measurementId: "G-5RBQS19M1C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { db };
export { storage };
export const auth = getAuth(app)