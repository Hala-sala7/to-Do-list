// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDnM7v5oJFTEQ4Ty_qI1IUBxXqZk8onqP8",
  authDomain: "todoapp-2a693.firebaseapp.com",
  projectId: "todoapp-2a693",
  storageBucket: "todop-app-488c3.appspot.com",
  messagingSenderId: "123466471875",
  appId: "1:123466471875:web:c77df3b5b67c9fe7808576",
  measurementId: "G-JXEJ5DQ0F6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

 