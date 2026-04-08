
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const firebaseConfig = { projectId: 'the3-fc45a' };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
async function run() {
  const d = await getDoc(doc(db, 'settings', 'hero'));
  console.log(d.data());
}
run();

