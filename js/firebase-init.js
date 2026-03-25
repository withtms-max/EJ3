// firebase-init.js — 파이어베이스 초기화 및 데이터베이스 연결
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, updateDoc, addDoc, deleteDoc, query, orderBy, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBTX7XZ3WRxvf1MnpotRvUQC8x9o6N44yc",
  authDomain: "the3-fc45a.firebaseapp.com",
  projectId: "the3-fc45a",
  storageBucket: "the3-fc45a.appspot.com", // storageBucket was slightly wrong in previous artifacts, usually .appspot.com
  messagingSenderId: "431210870560",
  appId: "1:431210870560:web:89283eeb92998db6358945",
  measurementId: "G-7CV2EYEP2V"
};

// 앱 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage, doc, setDoc, getDoc, collection, getDocs, updateDoc, addDoc, deleteDoc, query, orderBy, where, ref, uploadBytes, getDownloadURL };
