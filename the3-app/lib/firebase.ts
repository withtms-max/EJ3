
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBTX7XZ3WRxvf1MnpotRvUQC8x9o6N44yc", 
    authDomain: "the3-fc45a.firebaseapp.com",
    projectId: "the3-fc45a", 
    storageBucket: "the3-fc45a.firebasestorage.app",
    messagingSenderId: "431210870560", 
    appId: "1:431210870560:web:89283eeb92998db6358945"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
