// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8P1aGWV8UBWMGB3-L0ylHkuTweJ5qQn4",
  authDomain: "lowlanders-e6681.firebaseapp.com",
  projectId: "lowlanders-e6681",
  storageBucket: "lowlanders-e6681.appspot.com",
  messagingSenderId: "835602466785",
  appId: "1:835602466785:web:caf9e7414c7ed0b2ab34a0",
  measurementId: "G-SNP165PFH4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);