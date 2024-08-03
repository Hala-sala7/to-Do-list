import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBz0Mi7lJzc_flStbHqeyhS8hadnmF4big",
  authDomain: "todoapp-2a693.firebaseapp.com",
  projectId: "todoapp-2a693",
  storageBucket: "todoapp-2a693.appspot.com",
  messagingSenderId: "123466471875",
  appId: "1:123466471875:web:c77df3b5b67c9fe7808576",
  measurementId: "G-JXEJ5DQ0F6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

 