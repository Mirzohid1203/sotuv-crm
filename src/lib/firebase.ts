import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// The buyer should replace these with their own config from Firebase Console

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlqAnjUALH_PeLV4yrfMIAqtrdv5QJqvQ",
  authDomain: "sotuv-crm.firebaseapp.com",
  projectId: "sotuv-crm",
  storageBucket: "sotuv-crm.firebasestorage.app",
  messagingSenderId: "503309507688",
  appId: "1:503309507688:web:62b647ef0808e54852afdd"
};


// Initialize Firebase only if it hasn't been initialized already (fixes next.js hot reload issues)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
