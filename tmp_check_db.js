
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBTX7XZ3WRxvf1MnpotRvUQC8x9o6N44yc",
    authDomain: "the3-fc45a.firebaseapp.com",
    projectId: "the3-fc45a",
    storageBucket: "the3-fc45a.appspot.com",
    messagingSenderId: "431210870560",
    appId: "1:431210870560:web:89283eeb92998db6358945"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function listCollections() {
    const cols = ['portfolio', 'team', 'hero_slides', 'contacts'];
    for(const colName of cols) {
        console.log(`Checking collection: ${colName}`);
        const snap = await getDocs(collection(db, colName));
        snap.forEach(doc => {
            console.log(JSON.stringify({ col: colName, id: doc.id, data: doc.data() }));
        });
    }
}

listCollections();
