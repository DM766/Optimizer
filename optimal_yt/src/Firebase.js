// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAE-4aN-B7a-2Mc--1zNl2BUMqXJEXv9M",
  authDomain: "optimizer-96d50.firebaseapp.com",
  databaseURL: "https://optimizer-96d50-default-rtdb.firebaseio.com",
  projectId: "optimizer-96d50",
  storageBucket: "optimizer-96d50.appspot.com",
  messagingSenderId: "887643686216",
  appId: "1:887643686216:web:daaad77d6e7ebb7e3f1f7d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;