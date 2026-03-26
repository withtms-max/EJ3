import { db, doc, getDoc } from "./firebase-init.js";

async function applyTheme() {
    // 1. 즉시 적용을 위해 로컬 스토리지 우선 확인
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    try {
        // 2. 서버 설정(Firestore) 확인
        const snap = await getDoc(doc(db, 'settings', 'global'));
        if (snap.exists()) {
            const data = snap.data();
            const theme = data.theme || 'dark';
            
            // 3. 서버 설정에 따라 최종 동기화
            if (theme === 'light') {
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
            }
        }
    } catch (e) {
        console.error('Theme Load Error:', e);
    }
}

// 명시적으로 실행
applyTheme();

export { applyTheme };
