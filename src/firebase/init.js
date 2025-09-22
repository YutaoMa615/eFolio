// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore' 
import { getAuth, connectAuthEmulator } from 'firebase/auth'

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDUK_re7g5xLmM5m2SODpD43j9zXaE9k3c",
  authDomain: "efolio-yutao.firebaseapp.com",
  projectId: "efolio-yutao",
  storageBucket: "efolio-yutao.firebasestorage.app",
  messagingSenderId: "891402626931",
  appId: "1:891402626931:web:3a175c20eed93fe7990706"
};



const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const db = getFirestore()

if (import.meta.env.DEV) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099")
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
}

export { firebaseApp, auth }

export default db