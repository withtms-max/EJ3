import os

target_file = r'c:\THE3studio\work-detail.html'

isolated_style = """<style>
/* ==========================================================================
   DETAIL PAGE THEME ARCHITECTURE (Strict Isolation)
   ========================================================================== */

:root {
    --primary: #E63946; /* Navy/Red Theme Red */
    --transition: .3s cubic-bezier(0.2, 0.8, 0.2, 1);
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
body:not(.light-mode) .case-hero { background: #0B1939; }
body:not(.light-mode) .hero-overlay { background: linear-gradient(to top, #0B1939 0%, transparent 100%); }

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
body.light-mode .case-hero { background: #FFFFFF; }
body.light-mode .hero-overlay { background: linear-gradient(to top, #FFFFFF 0%, transparent 100%); }
body.light-mode .nav-logo, body.light-mode .nav-links li a, body.light-mode .nav-toggle { color: #111; }
body.light-mode .section-h2, body.light-mode .side-val, body.light-mode .back-btn { color: #111; }
body.light-mode .hero-bg { opacity: 0.1; filter: blur(30px); }

/* --------------------------------------------------------------------------
   [PART 0] COMMON SKELETON (Always Applied)
   -------------------------------------------------------------------------- */
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--text);font-family:'Pretendard', sans-serif;overflow-x:hidden;word-break:keep-all; transition: background 0.5s ease;}

/* NAV */
nav{position:fixed;top:0;width:100%;display:flex;justify-content:space-between;align-items:center;padding:1.5rem 3rem;z-index:1000;transition: var(--transition);}
nav.scrolled{background:rgba(5,5,5,.9);backdrop-filter:blur(12px);padding:1rem 3rem;box-shadow:0 4px 20px rgba(0,0,0,.3);border-bottom:1px solid var(--border);}
body.light-mode nav.scrolled{background:rgba(255, 255, 255, 0.85); box-shadow:0 10px 30px rgba(0,0,0,0.03);}

.nav-logo{font-family:'Outfit',sans-serif;font-size:1.4rem;font-weight:900;letter-spacing:-.05em;text-transform:uppercase;color:var(--text);text-decoration:none;}
.nav-logo span{color:var(--primary);}
.nav-links{display:flex;gap:2rem;list-style:none;}
.nav-links li a{color:var(--text-dim);font-size:.85rem;font-weight:700;text-decoration:none;transition:.2s;}
.nav-links li a:hover, .nav-links li a.active{color:var(--primary);}

/* HERO */
.case-hero { min-height: 70vh; display: flex; align-items: flex-end; padding: 12rem 3rem 5rem; position: relative; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0.6; filter: blur(15px); transform: scale(1.05); }
.hero-overlay { position: absolute; inset: 0; z-index: 1; }
.hero-container { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
.hero-slider-wrap { width: 100%; aspect-ratio: 16/10; background: rgba(255,255,255,0.05); border-radius: 2rem; border: 1px solid var(--border); overflow: hidden; box-shadow: var(--card-shadow); position: relative; }
body.light-mode .hero-slider-wrap { background: #fff; }

.swiper { width: 100%; height: 100%; }
.swiper-slide { display: flex; align-items: center; justify-content: center; background: #000; }
body.light-mode .swiper-slide { background: #f0f3f8; }

.hero-cat { color: var(--primary); font-size: 0.8rem; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.5rem; }
.hero-title { font-family: 'Outfit', sans-serif; font-size: clamp(2.5rem, 5vw, 4.5rem); font-weight: 900; line-height: 1.05; margin-bottom: 2rem; letter-spacing: -0.04em; color: var(--text); }
.hero-meta { display: flex; gap: 2rem; color: var(--text-dim); font-size: 0.9rem; font-weight: 600; }
.hero-meta span i { color: var(--primary); margin-right: 0.6rem; }

/* CONTENT */
.case-body { padding: 6rem 3rem 10rem; }
.case-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 320px; gap: 6rem; align-items: start; }
.section-h2 { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 900; margin-bottom: 1.5rem; color: var(--text); letter-spacing: -0.02em; }
.section-p { color: var(--text-dim); font-size: 1.05rem; line-height: 1.9; margin-bottom: 4rem; }

.case-sidebar { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 2.5rem; position: sticky; top: 120px; box-shadow: var(--card-shadow); }
.side-item { margin-bottom: 2rem; }
.side-label { font-size: 0.75rem; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
.side-val { font-size: 1rem; font-weight: 700; color: var(--text); }

.img-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 4rem; }
.img-grid img { width: 100%; border-radius: 1.5rem; border: 1px solid var(--border); transition: 0.3s; }
.img-grid img:hover { border-color: var(--primary); }

.back-btn {
    display: inline-flex; align-items: center; gap: 0.8rem; color: var(--text); text-decoration: none; font-weight: 800; font-size: 0.9rem; transition: 0.3s;
    margin-bottom: 2rem; padding: 0.8rem 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 999px;
}
.back-btn:hover { background: var(--primary); color: #fff; transform: translateX(-5px); }

/* INTEGRATED CONTACT FORM */
.contact-integrated-card { max-width: 1200px; margin: 6rem auto 4rem; background: var(--surface); border: 1px solid var(--border); border-radius: 3rem; display: grid; grid-template-columns: 1fr 1.5fr; overflow: hidden; box-shadow: var(--card-shadow); }
.contact-left-col { padding: 4rem; border-right: 1px solid var(--border); }
.contact-right-col { padding: 4rem; }
.contact-item { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2.5rem; }
.contact-icon { width: 55px; height: 55px; background: rgba(230, 57, 70, 0.1); border: 1px solid rgba(230, 57, 70, 0.2); border-radius: 15px; display: flex; align-items: center; justify-content: center; color: var(--primary); font-size: 1.4rem; }
.contact-item a, .contact-item .val { color: var(--text); text-decoration: none; font-weight: 700; font-size: 1.1rem; }
.form-label { display: block; font-size: 0.85rem; font-weight: 800; color: var(--primary); text-transform: uppercase; margin-bottom: 1.2rem; }
.c-input { width: 100%; background: rgba(0,0,0,0.1); border: 1px solid var(--border); border-radius: 12px; padding: 1.2rem; color: var(--text); outline: none; font-size: 1rem; transition: .2s; }
body.light-mode .c-input { background: #fff; }
.c-input:focus { border-color: var(--primary); }
.btn-submit { width: 100%; background: var(--primary); color: #fff; border: none; padding: 1.4rem; border-radius: 999px; font-weight: 900; text-transform: uppercase; cursor: pointer; transition: 0.3s; margin-top: 1rem; }
.btn-submit:hover { opacity: 0.9; transform: translateY(-3px); }

/* MOBILE */
@media(max-width: 992px) {
    .hero-container { grid-template-columns: 1fr; text-align: center; }
    .contact-integrated-card { grid-template-columns: 1fr; margin: 4rem 1rem; }
    .contact-left-col { border-right: none; border-bottom: 1px solid var(--border); }
}
</style>"""

try:
    with open(target_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    import re
    # Replace the entire <style>...</style> block
    new_html = re.sub(r'<style>.*?</style>', isolated_style, content, flags=re.DOTALL)
    
    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Success: Portfolio detail page isolated symmetrically.")
except Exception as e:
    print(f"Error: {e}")
