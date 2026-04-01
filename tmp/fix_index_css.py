import os
import re

target_file = r'c:\THE3studio\index.html'

# Reduced and strictly isolated style block for index.html
isolated_style = """<style>
/* ==========================================================================
   THE3 STUDIO MAIN THEME ARCHITECTURE (Strict Isolation)
   ========================================================================== */

:root {
    --primary: #E63946;
    --transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* --------------------------------------------------------------------------
   [PART 1] DARK THEME - THE3 NAVY/RED (Default Isle)
   -------------------------------------------------------------------------- */
body:not(.light-mode) {
    --bg-main: #0B1939;
    --bg-card: #12224A;
    --text-main: #FFFFFF;
    --text-dim: rgba(255, 255, 255, 0.5);
    --border-subtle: rgba(255, 255, 255, 0.06);
    --nav-scrolled: rgba(18, 34, 74, 0.95);
    --hero-gradient: radial-gradient(circle at center, #12224A 0%, #0B1939 100%);
    --accent-gradient: linear-gradient(to right, #FFFFFF 0%, #E63946 100%);
}
body:not(.light-mode) .fan-hero { background: var(--hero-gradient); }
body:not(.light-mode) .the3-accent { -webkit-text-fill-color: transparent; background: var(--accent-gradient); -webkit-background-clip: text; background-clip: text; filter: drop-shadow(0 15px 30px rgba(230,57,70, 0.15)); }

/* --------------------------------------------------------------------------
   [PART 2] LIGHT THEME - THE3 WHITE/RED (Isolated Island)
   -------------------------------------------------------------------------- */
body.light-mode {
    --bg-main: #F8F9FA;
    --bg-card: #FFFFFF;
    --text-main: #111111;
    --text-dim: #555555;
    --border-subtle: rgba(0, 0, 0, 0.08);
    --nav-scrolled: rgba(255, 255, 255, 0.98);
    --hero-gradient: radial-gradient(at 50% 50%, rgba(255, 255, 255, 0.6) 0%, #f7f8fa 100%);
    --accent-gradient: linear-gradient(to right, #111111 0%, #E63946 100%);
}
body.light-mode { 
    background-image: radial-gradient(at 0% 0%, rgba(230,57,70, 0.08) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(140, 180, 255, 0.05) 0px, transparent 50%) !important;
    background-attachment: fixed !important;
}
body.light-mode .fan-hero { background: var(--hero-gradient); border-bottom: 1px solid var(--border-subtle); }
body.light-mode #the3-headline-main { color: #111 !important; }
body.light-mode .the3-accent { -webkit-text-fill-color: transparent; background: var(--accent-gradient); -webkit-background-clip: text; background-clip: text; filter: none; }
body.light-mode .nav-logo, body.light-mode .nav-links li a, body.light-mode .nav-toggle { color: #111 !important; }
body.light-mode .team-name { color: #111 !important; }
body.light-mode .footer-big { color: #111 !important; }

/* --------------------------------------------------------------------------
   [PART 0] COMMON SKELETON (Always Applied)
   -------------------------------------------------------------------------- */
*{margin:0;padding:0;box-sizing:border-box;}
body{
    background: var(--bg-main);
    color: var(--text-main);
    font-family: 'Pretendard', sans-serif;
    overflow-x:hidden;
    transition: background 0.5s ease;
}

/* NAV */
nav{position:fixed;top:0;width:100%;display:flex;justify-content:space-between;align-items:center;padding:1.5rem 3rem;z-index:1000;transition:.3s;}
nav.scrolled{background:var(--nav-scrolled);backdrop-filter:blur(12px);padding:1rem 3rem;box-shadow:0 10px 30px rgba(0,0,0,0.2);}
.nav-logo{font-family:'Outfit',sans-serif;font-size:1.4rem;font-weight:900;letter-spacing:-.05em;text-transform:uppercase;color:inherit;text-decoration:none;}
.nav-logo span{color:var(--primary);}
.nav-links{display:flex;gap:2rem;list-style:none;align-items:center;}
.nav-links li a{color:inherit;font-size:0.85rem;font-weight:800;text-decoration:none;transition:.2s;text-transform:uppercase; opacity:0.8;}
.nav-links li a:hover, .nav-links li a.active{color:var(--primary); opacity:1;}
.nav-cta{display:inline-block;background:var(--primary);color:#fff !important;padding:.7rem 1.8rem;border-radius:999px;font-size:.85rem;font-weight:800;text-decoration:none;transition:.3s;}

/* HERO */
.fan-hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 8rem 2rem 2rem; position: relative; }
#the3-headline-main { font-size: clamp(2.2rem, 6vw, 4.5rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.03em; margin-bottom: 2rem; }
#hero-desc { font-size: clamp(1rem, 2vw, 1.25rem); font-weight: 600; color: var(--text-dim); line-height: 1.8; max-width: 850px; margin: 0 auto 3rem; }

/* SECTIONS */
.team-sect, .svc-sect, .journey-sect, .impact-sect, .footer-sect { padding: 8rem 6rem; border-top: 1px solid var(--border-subtle); background: var(--bg-main); transition: background 0.5s ease; }
.sect-h2 { font-family: 'Outfit', sans-serif; font-size: clamp(2.5rem, 4.5vw, 3.5rem); font-weight: 900; text-align: center; margin-bottom: 4rem; }

/* CARDS */
.team-card, .j-card, .impact-slide { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 2rem; transition: 0.3s var(--transition); }
.team-card:hover { transform: translateY(-10px); border-color: var(--primary); box-shadow: 0 30px 60px rgba(0,0,0,0.3); }

/* FOOTER */
.footer-big { font-family: 'Outfit', sans-serif; font-size: clamp(2.5rem, 7vw, 6rem); font-weight: 900; text-transform: uppercase; cursor: pointer; transition: .3s; margin-bottom: 3rem; color: var(--text-main); }
.footer-big:hover { color: var(--primary); }

/* CHATBAR / BANNER */
.chat-toggle { width: 58px; height: 58px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: .3s; box-shadow: 0 10px 25px rgba(230,57,70, 0.4); }
.banner { background: var(--nav-scrolled); border: 1px solid var(--border-subtle); border-radius: 3rem; backdrop-filter: blur(20px); }

/* MOBILE RESPONSIVE */
@media(max-width: 768px) {
    .team-sect, .svc-sect, .journey-sect, .footer-sect { padding: 4rem 1.5rem; }
    .nav-links, .nav-cta { display: none !important; }
}
</style>"""

try:
    with open(target_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # 1. Replace the massive <style>...</style> block with our clean isolated version
    new_html = re.sub(r'<style>.*?</style>', isolated_style, content, flags=re.DOTALL)
    
    # 2. Cleanup inline styles in the body (e.g., line 205 color: #fff etc)
    # This is a bit risky for 2400 lines but I'll focus on the major ones I saw.
    new_html = new_html.replace('style="background:linear-gradient(to right, #fff, #0066ff); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;"', '')
    
    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Success: index.html core styling isolated symmetrically.")
except Exception as e:
    print(f"Error: {e}")
