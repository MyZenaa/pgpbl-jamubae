// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBGtxgHtTMqkSiokZjrQLPGvKBMqgCfgZQ",
  authDomain: "pgpbl-react.firebaseapp.com",
  databaseURL: "https://pgpbl-react-default-rtdb.firebaseio.com",
  projectId: "pgpbl-react",
  storageBucket: "pgpbl-react.appspot.com",
  messagingSenderId: "427947327183",
  appId: "1:427947327183:web:beb8c6b2313c1b6b4241ba",
  measurementId: "G-WWGFMZGXP1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const firestore = getFirestore(app);
export const realtimeDB = getDatabase(app);
