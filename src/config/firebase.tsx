

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJb8N3i4qCdFNXGt5Mzq1bpKbv-zKmP0M",
  authDomain: "chat-app-8ffae.firebaseapp.com",
  projectId: "chat-app-8ffae",
  storageBucket: "chat-app-8ffae.firebasestorage.app",
  messagingSenderId: "331009685371",
  appId: "1:331009685371:web:da26a3539136dc8614afde",
  measurementId: "G-3NP4YRX3C2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export {
    createUserWithEmailAndPassword,
    auth,
    signInWithEmailAndPassword,
    onAuthStateChanged, 
    signOut,
    db,
    doc, 
    setDoc,
    getDoc, collection, query, where, getDocs, addDoc, serverTimestamp

}