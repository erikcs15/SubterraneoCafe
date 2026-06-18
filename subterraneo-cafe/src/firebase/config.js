import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDB94OUQwdjHP80zx8pm23Ozc9Ek8c0m_Q",
  authDomain: "subterraneocafe-e2354.firebaseapp.com",
  projectId: "subterraneocafe-e2354",
  storageBucket: "subterraneocafe-e2354.firebasestorage.app",
  messagingSenderId: "402423612441",
  appId: "1:402423612441:web:58d61a9acb2ff992d71688"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);