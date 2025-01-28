import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: "intellisense-a5f77.firebaseapp.com",
  projectId: "intellisense-a5f77",
  storageBucket: "intellisense-a5f77.appspot.com",
  messagingSenderId: "903450563980",
  appId: "1:903450563980:web:2f8f9a56e20d2a58f472a9"
};

export const app = initializeApp(firebaseConfig);