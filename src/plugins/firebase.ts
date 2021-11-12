// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhe0LEUIfV5qtUo6l2j6M_PqD1K1jjYEE",
  authDomain: "othello-d594c.firebaseapp.com",
  projectId: "othello-d594c",
  storageBucket: "othello-d594c.appspot.com",
  messagingSenderId: "487586803817",
  appId: "1:487586803817:web:de4f4a9717776d5ec8f2f8",
  measurementId: "G-SV7LEC82RF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);