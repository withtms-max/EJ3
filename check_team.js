
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyBTX7XZ3WRxvf1MnpotRvUQC8x9o6N44yc", authDomain: "the3-fc45a.firebaseapp.com",
    projectId: "the3-fc45a", storageBucket: "the3-fc45a.firebasestorage.app",
    messagingSenderId: "431210870560", appId: "1:431210870560:web:89283eeb92998db6358945"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
    try {
        const snap = await getDocs(collection(db, "team"));
        snap.forEach(doc => console.log(doc.id, JSON.stringify(doc.data())));
    } catch(e) { console.error(e); }
    process.exit(0);
}
check();

