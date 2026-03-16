import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBAet4HtUYJwl5og96QvX966py4JfDaAhQ",
  authDomain: "neurascan-8ada2.firebaseapp.com",
  projectId: "neurascan-8ada2",
  storageBucket: "neurascan-8ada2.firebasestorage.app",
  messagingSenderId: "147645341441",
  appId: "1:147645341441:web:7b29f4f024c87f679f4500",
  measurementId: "G-83QCZVSXYJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, googleProvider, GoogleAuthProvider, signInWithPopup, analytics };
export default app;
