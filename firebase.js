// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, doc, setDoc, updateDoc, arrayUnion, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAw3mm5UU6459zhZD6a9jmOFjw39JvyZoc",
    authDomain: "movie-app-5584e.firebaseapp.com",
    projectId: "movie-app-5584e",
    storageBucket: "movie-app-5584e.appspot.com",
    messagingSenderId: "292266592631",
    appId: "1:292266592631:web:01352bd3c084e9bb61b972"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export Firebase services
export { 
    app, 
    auth, 
    db, 
    doc, 
    setDoc, 
    updateDoc, 
    arrayUnion, 
    getDoc, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail, 
    onAuthStateChanged, 
    signOut 
};
