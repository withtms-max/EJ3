import os
import re

root_pages = [
    r'c:\THE3studio\about.html',
    r'c:\THE3studio\contact.html',
    r'c:\THE3studio\services.html',
    r'c:\THE3studio\portfolio.html'
]

# Standard Isolation Style for secondary pages
isolated_style = """<style>
/* ==========================================================================
   SECONDARY PAGE THEME ARCHITECTURE (Strict Isolation)
   ========================================================================== */

:root {
    --primary: #E63946;
    --transition: .3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* --------------------------------------------------------------------------
   [PART 1] DARK THEME - THE3 NAVY/RED (Default Isle)
   -------------------------------------------------------------------------- */
body:not(.light-mode) {
    --bg-main: #0B1939;
    --bg-card: #12224A;
    --text-main: #FFFFFF;
    --text-dim: rgba(255, 255, 255, 0.5);
    --border: rgba(255, 255, 255, 0.08);
}
body:not(.light-mode) .nav-logo { color: #fff; }
body:not(.light-mode) .sidebar { background: #081126; }

/* --------------------------------------------------------------------------
   [PART 2] LIGHT THEME - THE3 WHITE/RED (Isolated Island)
   -------------------------------------------------------------------------- */
body.light-mode {
    --bg-main: #F4F6F8;
    --bg-card: #FFFFFF;
    --text-main: #111111;
    --text-dim: #6C757D;
    --border: rgba(0, 0, 0, 0.1);
}
body.light-mode .nav-logo, body.light-mode .nav-links li a { color: #333 !important; }
body.light-mode h1, body.light-mode h2, body.light-mode h3 { color: #111 !important; }
body.light-mode p { color: #555 !important; }
body.light-mode .form-input { background: #fff !important; color: #111 !important; border-color: rgba(0,0,0,0.1) !important; }

/* --------------------------------------------------------------------------
   [PART 0] COMMON SKELETON (Always Applied)
   -------------------------------------------------------------------------- */
* { margin:0; padding:0; box-sizing:border-box; }
body { background: var(--bg-main); color: var(--text-main); font-family: 'Pretendard', sans-serif; transition: background 0.5s ease; }

/* NAV */
nav{position:fixed;top:0;width:100%;display:flex;justify-content:space-between;align-items:center;padding:1.5rem 3rem;z-index:1000;transition:.3s;}
nav.scrolled{background:var(--bg-card);backdrop-filter:blur(12px);padding:1rem 3rem;box-shadow:0 10px 30px rgba(0,0,0,0.2);border-bottom:1px solid var(--border);}
.nav-logo{font-family:'Outfit',sans-serif;font-size:1.4rem;font-weight:900;letter-spacing:-.05em;text-transform:uppercase;color:inherit;text-decoration:none;}
.nav-logo span{color:var(--primary);}
.nav-links{display:flex;gap:2rem;list-style:none;}
.nav-links li a{color:inherit;font-size:0.85rem;font-weight:800;text-decoration:none;transition:.2s; opacity:0.8;}
.nav-links li a:hover, .nav-links li a.active{color:var(--primary); opacity:1;}

.content-sect { padding: 10rem 6rem; max-width: 1200px; margin: 0 auto; }
.sect-h1 { font-family: 'Outfit'; font-size: 3.5rem; font-weight: 900; margin-bottom: 2rem; }
.hero-p { font-size: 1.2rem; color: var(--text-dim); line-height: 1.8; margin-bottom: 4rem; word-break: keep-all; }

/* Form Elements */
.form-group { margin-bottom: 1.5rem; }
.form-label { display: block; font-size: 0.7rem; font-weight: 900; color: var(--primary); text-transform: uppercase; margin-bottom: 8px; }
.form-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 12px; padding: 1.2rem; color: #fff; font-size: 1rem; outline: none; transition: 0.3s; }
.form-input:focus { border-color: var(--primary); }

/* Footer */
footer { padding: 4rem 6rem; border-top: 1px solid var(--border); text-align: center; }
.footer-logo { font-family: 'Outfit'; font-size: 1.2rem; font-weight: 900; color: inherit; text-decoration: none; }
.footer-logo span { color: var(--primary); }
</style>"""

for page in root_pages:
    if os.path.exists(page):
        try:
            with open(page, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Replace the entire <style>...</style> block
            new_html = re.sub(r'<style>.*?</style>', isolated_style, content, flags=re.DOTALL)
            
            with open(page, 'w', encoding='utf-8') as f:
                f.write(new_html)
            print(f"Success: Isolated styling for {os.path.basename(page)}")
        except Exception as e:
            print(f"Error processing {page}: {e}")
    else:
        print(f"File not found: {page}")
