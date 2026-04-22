/**
 * THE3 Cut Modal Integration
 * Provides a unified AI Editor modal experience across the entire site.
 */

(function() {
    // 1. Create Modal HTML
    const modalHtml = `
    <div id="the3cut-modal" style="display:none; position:fixed; inset:0; z-index:99999; background:#F4F6F8; animation: the3cutFadeIn 0.4s ease;">
        <div style="position:absolute; top:20px; right:30px; z-index:100000; display:flex; gap:15px; align-items:center;">
            <span style="color:#666; font-weight:900; font-size:0.8rem; letter-spacing:0.2em; text-transform:uppercase; opacity:0.5;">THE3 CUT AI EDITOR</span>
            <button onclick="closeThe3Cut()" style="background:#C8102E; color:#fff; border:none; width:44px; height:44px; border-radius:50%; font-size:1.5rem; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 20px rgba(200,16,46,0.3); transition:0.3s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                &times;
            </button>
        </div>
        <iframe id="the3cut-iframe" src="" style="width:100%; height:100%; border:none;"></iframe>
    </div>
    <style>
    @keyframes the3cutFadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
    </style>
    `;

    // 2. Append to Body
    document.addEventListener('DOMContentLoaded', () => {
        const div = document.createElement('div');
        div.innerHTML = modalHtml;
        document.body.appendChild(div);
    });

    // 3. Define Functions
    window.openThe3Cut = function() {
        const modal = document.getElementById('the3cut-modal');
        const iframe = document.getElementById('the3cut-iframe');
        // 'view=editor' parameter allows skipping the landing page (requires rebuilt React app)
        iframe.src = 'the3cut/index.html?view=editor'; 
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; 
        sessionStorage.setItem('the3cut_open', 'true');
    };

    window.closeThe3Cut = function() {
        if (confirm("정말 편집기를 닫으시겠습니까?\n진행 중인 모든 작업 내용이 사라질 수 있습니다.")) {
            const modal = document.getElementById('the3cut-modal');
            const iframe = document.getElementById('the3cut-iframe');
            modal.style.display = 'none';
            if (iframe) iframe.src = 'about:blank'; 
            document.body.style.overflow = 'auto'; 
            sessionStorage.setItem('the3cut_open', 'false');
        }
    };

    // 4. Persistence & Safety
    window.addEventListener('beforeunload', function (e) {
        if (sessionStorage.getItem('the3cut_open') === 'true') {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    window.addEventListener('load', function() {
        if (sessionStorage.getItem('the3cut_open') === 'true') {
            openThe3Cut();
        }
    });
})();
