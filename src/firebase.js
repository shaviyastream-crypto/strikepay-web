import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBoyaOe_10UXiCnf_5YB-ecwEJ7eUybvEs",
  authDomain: "strikepay-lk.firebaseapp.com",
  projectId: "strikepay-lk",
  storageBucket: "strikepay-lk.firebasestorage.app",
  messagingSenderId: "440400058741",
  appId: "1:440400058741:web:134cfa3b21ed7e0c4bdb3c",
  measurementId: "G-XS7XLJ835J"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };