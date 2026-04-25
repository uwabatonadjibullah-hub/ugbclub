import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC2gxY_XYclfWRroSiXPd3XZJ6NNgR6gE8",
  authDomain: "ugbclubrwanda.firebaseapp.com",
  databaseURL: "https://ugbclubrwanda-default-rtdb.firebaseio.com",
  projectId: "ugbclubrwanda",
  storageBucket: "ugbclubrwanda.firebasestorage.app",
  messagingSenderId: "160854439237",
  appId: "1:160854439237:web:05d9861c927adadb123a2c",
  measurementId: "G-ES1N3ZBX7X"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export default app;
