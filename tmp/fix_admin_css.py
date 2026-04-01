import os
import re

target_file = r'c:\THE3studio\admin\index.html'

isolated_style = """<style>
/* ==========================================================================
   ADMIN DASHBOARD THEME ARCHITECTURE (Strict Isolation)
   ========================================================================== */

:root {
    --sidebar-w: 260px;
    --danger: #ff3b30;
    --success: #28cd41;
}

/* --------------------------------------------------------------------------
   [PART 1] DARK THEME - THE3 NAVY/RED (Default Isle)
   -------------------------------------------------------------------------- */
body:not(.light-mode) {
    --bg-main: #0B1939;
    --bg-card: #12224A;
    --bg-darker: #081126;
    --text-main: #ffffff;
    --text-dim: rgba(255, 255, 255, 0.6);
    --border: rgba(255, 255, 255, 0.08);
    --accent: #E63946;
    --accent-soft: rgba(230, 57, 70, 0.1);
    --glow: 0 0 20px rgba(230, 57, 70, 0.4);
}
body:not(.light-mode) .logo { color: #fff; }
body:not(.light-mode) .sidebar { background: #081126; }
body:not(.light-mode) .nav-item:hover, body:not(.light-mode) .nav-item.active { background: rgba(255,255,255,0.05); color: #fff; }
body:not(.light-mode) .form-input { background: #081126; border-color: var(--border); color: #fff; }
body:not(.light-mode) .modal { background: rgba(11,25,57,0.85); }
body:not(.light-mode) table th { background: rgba(255,255,255,0.02); color: var(--text-dim); }

/* --------------------------------------------------------------------------
   [PART 2] LIGHT THEME - THE3 WHITE/RED (Isolated Island)
   -------------------------------------------------------------------------- */
body.light-mode {
    --bg-main: #F4F6F8;
    --bg-card: #FFFFFF;
    --bg-darker: #FFFFFF;
    --text-main: #111111;
    --text-dim: #6C757D;
    --border: rgba(0, 0, 0, 0.1);
    --accent: #E63946;
    --accent-soft: rgba(230, 57, 70, 0.05);
    --glow: 0 0 20px rgba(230, 57, 70, 0.1);
}
body.light-mode .logo { color: #111; }
body.light-mode .sidebar { background: #FFFFFF; border-right: 1px solid var(--border); }
body.light-mode .nav-item { color: #444; }
body.light-mode .nav-item:hover { background: rgba(0,0,0,0.05); color: #111; }
body.light-mode .nav-item.active { background: var(--accent); color: #fff; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
body.light-mode .main-content { background: #F4F6F8; }
body.light-mode .top-bar { border-bottom-color: rgba(0,0,0,0.05); }
body.light-mode table th { background: #F8F9FA; color: #495057; border-bottom: 2px solid #E9ECEF; }
body.light-mode table td { color: #111; border-top-color: #F1F3F5; }
body.light-mode .modal { background: rgba(255,255,255,0.85); backdrop-filter: blur(15px); }
body.light-mode .modal-box { background: #FFFFFF; box-shadow: 0 30px 60px rgba(0,0,0,0.1); }
body.light-mode #modal-title { color: #111; }
body.light-mode .form-label { color: #555; }
body.light-mode .form-input { background: #FFFFFF; border-color: rgba(0,0,0,0.1); color: #111; }
body.light-mode .form-input:focus { border-color: var(--accent); }
body.light-mode .btn-outline { background: #fff; color: #444; border-color: rgba(0,0,0,0.15); }
body.light-mode .stat-card { background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
body.light-mode .stat-card label { color: #666; }
body.light-mode .stat-card input { color: #111; }

/* --------------------------------------------------------------------------
   [PART 0] COMMON SKELETON (Always Applied)
   -------------------------------------------------------------------------- */
* { margin:0; padding:0; box-sizing:border-box; }
body { background: var(--bg-main); color: var(--text-main); font-family: 'Inter', sans-serif; transition: background 0.5s ease; }
.dashboard-layout { display: flex; height: 100vh; }

.sidebar { width: var(--sidebar-w); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 2rem 1rem; flex-shrink: 0; z-index: 1000; transition: background 0.5s; }
.logo { font-family: 'Outfit'; font-weight: 900; font-size: 1.4rem; margin-bottom: 2.5rem; padding: 0 1rem; }
.logo span { color: var(--accent); }
.nav-menu { flex: 1; overflow-y: auto; }
.nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; transition: 0.3s; margin-bottom: 5px; cursor: pointer; font-size: 0.85rem; font-weight: 600; }
.nav-item.active { background: var(--accent); color: #fff; box-shadow: 0 10px 20px rgba(230, 57, 70, 0.2); }

.main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: var(--bg-main); }
.top-bar { height: 70px; display: flex; align-items: center; justify-content: flex-end; padding: 0 2rem; border-bottom: 1px solid var(--border); }
.app-view { padding: 2.5rem; max-width: 1400px; margin: 0 auto; width: 100%; height: calc(100% - 70px); overflow-y: auto; }

.view-title h1 { font-family: 'Outfit'; font-size: 2rem; font-weight: 900; color: inherit; }
.btn { background: var(--accent); color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-size: 0.8rem; transition: 0.3s; }
.btn:hover { transform: translateY(-1px); filter: brightness(1.1); }

.table-container { background: var(--bg-card); border-radius: 20px; border: 1px solid var(--border); overflow: hidden; margin-top: 2rem; }
table { width: 100%; border-collapse: collapse; }
th { text-align: left; padding: 1.2rem; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
td { padding: 1.2rem; border-top: 1px solid var(--border); font-size: 0.85rem; vertical-align: middle; }

.modal { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; z-index: 10000; }
.modal-box { background: var(--bg-card); border: 1px solid var(--border); border-radius: 30px; width: 100%; max-width: 750px; padding: 3rem; max-height: 90vh; overflow-y: auto; }

.form-group { margin-bottom: 1.5rem; }
.form-label { display: block; font-size: 0.65rem; font-weight: 900; text-transform: uppercase; margin-bottom: 8px; }
.form-input { width: 100%; border: 1px solid var(--border); border-radius: 12px; padding: 14px; font-size: 0.9rem; outline: none; }

.stat-card { background: var(--bg-card); padding: 25px; border-radius: 20px; border: 1px solid var(--border); }
.stat-card label { display: block; font-size: 0.65rem; font-weight: 900; margin-bottom: 10px; }
.stat-card input { width: 100%; background: transparent; border: none; font-size: 2rem; font-weight: 900; outline: none; }

.thumb-cell { width: 60px; height: 45px; border-radius: 8px; overflow: hidden; background: #000; border: 1px solid var(--border); }
.thumb-cell img, .thumb-cell video { width: 100%; height: 100%; object-fit: cover; }
</style>"""

try:
    with open(target_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Replace the entire <style>...</style> block
    new_html = re.sub(r'<style>.*?</style>', isolated_style, content, flags=re.DOTALL)
    
    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Success: Admin Dashboard isolated symmetrically with high-contrast White Mode.")
except Exception as e:
    print(f"Error: {e}")
