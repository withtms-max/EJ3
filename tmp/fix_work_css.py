import os
import re

target_file = r'c:\THE3studio\work.html'

isolated_style = """<style>
/* ==========================================================================
   WORK PAGE THEME ARCHITECTURE (Strict Isolation)
   ========================================================================== */

:root {
    --primary: #E63946; /* Navy/Red Theme Red */
    --transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* --------------------------------------------------------------------------
   [PART 1] DARK THEME - THE3 NAVY/RED (Default Isle)
   -------------------------------------------------------------------------- */
body:not(.light-mode) {
    --bg: #0B1939;
    --surface: #12224A;
    --border: rgba(255,255,255,0.08);
    --text: #fff;
    --text-dim: rgba(255,255,255,0.5);
    --card-shadow: 0 40px 100px rgba(0,0,0,0.5);
}
body:not(.light-mode) .filter-sect { background: #050505; }
body:not(.light-mode) .work-hero { background: #0B1939; }

/* --------------------------------------------------------------------------
   [PART 2] LIGHT THEME - THE3 WHITE/RED (Isolated Island)
   -------------------------------------------------------------------------- */
body.light-mode {
    --bg: #F8F9FA;
    --surface: #FFFFFF;
    --border: rgba(0,0,0,0.08);
    --text: #111111;
    --text-dim: #555555;
    --card-shadow: 0 40px 100px rgba(0,0,0,0.05);
}
body.light-mode .filter-sect { background: #FFFFFF; border-bottom: 1px solid rgba(0,0,0,0.05); }
body.light-mode .work-hero { background: #F8F9FA; }
body.light-mode .hero-overlay { background: radial-gradient(circle at center, transparent 0%, #F8F9FA 90%), linear-gradient(to bottom, #F8F9FA 0%, transparent 40%, #F8F9FA 100%); }
body.light-mode .work-card { background: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.02); }
body.light-mode .nav-logo, body.light-mode .nav-links li a, body.light-mode .nav-toggle { color: #111; }
body.light-mode .hero-title, body.light-mode .work-title { color: #111; }
body.light-mode .filter-tab { background: #fff; color: #666; border-color: rgba(0,0,0,0.1); }
body.light-mode .filter-tab.active { background: var(--primary); color: #fff; border-color: var(--primary); }
body.light-mode .hero-bg-media { opacity: 0.1 !important; filter: blur(30px) brightness(1.2); }

/* --------------------------------------------------------------------------
   [PART 0] COMMON SKELETON (Always Applied)
   -------------------------------------------------------------------------- */
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--text);font-family:'Pretendard', sans-serif;overflow-x:hidden;word-break:keep-all; transition: background 0.5s ease;}

/* NAV */
nav{position:fixed;top:0;width:100%;display:flex;justify-content:space-between;align-items:center;padding:1.5rem 3rem;z-index:1000;transition:.3s;}
nav.scrolled{background:rgba(5,5,5,.9);backdrop-filter:blur(12px);padding:1rem 3rem;box-shadow:0 4px 20px rgba(0,0,0,.3);border-bottom:1px solid var(--border);}
body.light-mode nav.scrolled{background:rgba(255, 255, 255, 0.85); box-shadow:0 10px 30px rgba(0,0,0,0.03);}

.nav-logo{font-family:'Outfit',sans-serif;font-size:1.4rem;font-weight:900;letter-spacing:-.05em;text-transform:uppercase;color:var(--text);text-decoration:none;}
.nav-logo span{color:var(--primary);}
.nav-links{display:flex;gap:2rem;list-style:none;}
.nav-links li a{color:var(--text-dim);font-size:.85rem;font-weight:700;text-decoration:none;transition:.2s;}
.nav-links li a:hover, .nav-links li a.active{color:var(--primary);}
.nav-cta{display:inline-block;background:var(--primary);color:#fff;padding:.7rem 1.8rem;border-radius:999px;font-size:.85rem;font-weight:800;text-decoration:none;transition:.3s;}

/* HERO */
.work-hero { position: relative; padding: 10rem 2rem 6rem; text-align: center; overflow: hidden; min-height: 480px; display: flex; align-items: center; justify-content: center; }
.hero-bg-media { position: absolute; inset: 0; z-index: 0; opacity: 0; transition: 1s var(--transition); transform: scale(1.1); filter: blur(20px) brightness(0.4); background-size: cover; background-position: center; }
.hero-bg-media.active { opacity: 0.6; transform: scale(1); filter: blur(0px) brightness(0.5); }
.hero-overlay { position: absolute; inset: 0; z-index: 1; }
.hero-content { position: relative; z-index: 2; }
.hero-label { color: var(--primary); font-size: 0.85rem; font-weight: 900; letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 2rem; display: block; }
.hero-title { font-family: 'Outfit', sans-serif; font-size: clamp(2.5rem, 7vw, 5.5rem); font-weight: 950; line-height: 1.1; margin-bottom: 2rem; letter-spacing: -0.05em; color: var(--text); }
.hero-desc { font-size: 1.2rem; color: var(--text-dim); line-height: 1.8; max-width: 800px; margin: 0 auto; font-weight: 500; }

/* FILTERS */
.filter-sect { padding: 2rem; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); position: sticky; top: 80px; z-index: 100; transition: var(--transition); }
.filter-tabs { display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap; max-width: 1200px; margin: 0 auto; }
.filter-tab { background: transparent; border: 1px solid var(--border); color: var(--text-dim); padding: 0.6rem 1.5rem; border-radius: 999px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: 0.2s; }
.filter-tab:hover { border-color: var(--primary); color: var(--text); }
.filter-tab.active { background: var(--primary); border-color: var(--primary); color: #fff; box-shadow: 0 0 15px rgba(230, 57, 70, 0.3); }

/* GRID */
.work-grid { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; padding: 4rem 2rem 8rem; }
.work-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; overflow: hidden; text-decoration: none; transition: 0.4s var(--transition); }
.work-card:hover { transform: translateY(-10px); border-color: var(--primary); box-shadow: var(--card-shadow); }
.work-thumb-wrap { width: 100%; aspect-ratio: 4/3; background: #111; overflow: hidden; position: relative; }
.work-thumb-wrap img { width: 100%; height: 100%; object-fit: cover; transition: 0.8s; }
.work-info { padding: 1.8rem; }
.work-cat { color: var(--primary); font-size: 0.7rem; font-weight: 800; text-transform: uppercase; margin-bottom: 0.6rem; }
.work-title { font-size: 1.3rem; font-weight: 800; color: var(--text); margin-bottom: 0.5rem; }
.work-meta { font-size: 0.85rem; color: var(--text-dim); }

/* MOBILE */
@media(max-width: 992px) { .work-grid { grid-template-columns: 1fr 1fr; } }
@media(max-width: 640px) { 
    .work-grid { grid-template-columns: 1fr; } 
    nav { padding: 1rem 1.5rem; }
    .hero-title { font-size: 3rem; }
}
</style>"""

try:
    with open(target_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Replace the entire <style>...</style> block
    new_html = re.sub(r'<style>.*?</style>', isolated_style, content, flags=re.DOTALL)
    
    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Success: Work portfolio list page isolated symmetrically.")
except Exception as e:
    print(f"Error: {e}")
