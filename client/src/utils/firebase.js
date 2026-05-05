
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "ai-interview-e1412.firebaseapp.com",
  projectId: "ai-interview-e1412",
  storageBucket: "ai-interview-e1412.firebasestorage.app",
  messagingSenderId: "277554323584",
  appId: "1:277554323584:web:c695dc406fa50ae8d08665"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider }