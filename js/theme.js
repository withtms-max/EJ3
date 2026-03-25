import { db, doc, getDoc } from "./firebase-init.js";

async function applyTheme() {
    try {
        const snap = await getDoc(doc(db, 'settings', 'global'));
        if (snap.exists()) {
            const data = snap.data();
            const theme = data.theme || 'dark';
            if (theme === 'light') {
                document.body.classList.add('light-mode');
            } else {
                document.body.classList.remove('light-mode');
            }
        }
    } catch (e) {
        console.error('Theme Load Error:', e);
    }
}

// 명시적으로 실행
applyTheme();

export { applyTheme };
