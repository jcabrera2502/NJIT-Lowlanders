// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
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

// All required options are specified by the service account,
// add service-specific configuration like databaseURL as needed.
const secondaryAppConfig = {
  apiKey: "AIzaSyBrW452Npy5kZmsSwoGPORYyETzYc9AJJg",
  authDomain: "lowlanders-dee02.firebaseapp.com",
  projectId: "lowlanders-dee02",
  storageBucket: "lowlanders-dee02.appspot.com",
  messagingSenderId: "840894058980",
  appId: "1:840894058980:web:37ed182a6849bfe26bf7f1",
  measurementId: "G-FR6LJ9JPGC"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const secondary = initializeApp(secondaryAppConfig, 'secondary');

const analytics = getAnalytics(app);
const secondAnalytics = getAnalytics(secondary);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const secondAuth = getAuth(secondary);

//Storage 
export const storage = getStorage(secondary);

export async function upload(file, currentUser, setLoading) {
  const fileRef = ref(storage, currentUser.uid + 'jpg');
  
  setLoading = true;
  const snapshot = await uploadBytes(fileRef, file);

  const url = await getDownloadURL(fileRef)

  updateProfile(currentUser, {url})
  setLoading = false;
  alert("Uploaded file!");
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
    return unsub;
  },[])
  
  return currentUser;
}