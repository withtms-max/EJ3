import os
import re

file_path = "c:\\THE3studio\\admin\\index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. CSS changes in <style>
replacements = {
    "--bg-dark: #000000; --bg-card: #0a0a0a; --accent: #E63946; /* 브랜드 컬러 일치 (#E63946) */": 
    "--bg-dark: #000000; --bg-card: #0a0a0a; --accent: #0066ff; /* 브랜드 컬러 일치 (#0066ff) */",
    
    "--glow: 0 0 20px rgba(230, 57, 70, 0.4);": 
    "--glow: 0 0 20px rgba(0, 102, 255, 0.4);",
    
    ".nav-item.active { background: var(--accent); box-shadow: 0 10px 20px rgba(230,57,70, 0.2); }": 
    ".nav-item.active { background: var(--accent); box-shadow: 0 10px 20px rgba(0, 136, 255, 0.2); }",
    
    "background: #f8f9fa;": "background: #050505;",
    
    "class=\"modal-box\"": "class=\"modal-box\"", # Will use regex for modal box
    
    ".upload-box:hover { border-color: var(--accent); background: rgba(230,57,70,0.05); }": 
    ".upload-box:hover { border-color: var(--accent); background: rgba(0,136,255,0.05); }",
    
    ".add-gallery-btn:hover { border-color: var(--accent); color: var(--accent); background: rgba(230,57,70,0.05); }": 
    ".add-gallery-btn:hover { border-color: var(--accent); color: var(--accent); background: rgba(0,136,255,0.05); }",
    
    ".gallery-list.drag-over { border-color: var(--accent) !important; background: rgba(230,57,70,0.1) !important; border-style: solid !important; }": 
    ".gallery-list.drag-over { border-color: var(--accent) !important; background: rgba(0,136,255,0.1) !important; border-style: solid !important; }",
    
    "(Brand Blue: var(--accent))": "(Brand Blue: #0066ff)",
    
    "background:rgba(230,57,70,0.05); padding:20px; border-radius:15px; margin-bottom:2rem; border:1px solid rgba(230,57,70,0.1);": 
    "background:rgba(0,102,255,0.05); padding:20px; border-radius:15px; margin-bottom:2rem; border:1px solid rgba(0,102,255,0.1);",
    
    "중심 시그니처 컬러인 <b>var(--accent)</b>": "중심 시그니처 컬러인 <b>#0066ff</b>",
    
    "background:linear-gradient(135deg, var(--accent) 0%, #0044aa 100%)": 
    "background:linear-gradient(135deg, #0066ff 0%, #0044aa 100%)",
}

for old, new in replacements.items():
    if old in content:
        content = content.replace(old, new)


# 2. Fix the Modal and Form Input CSS
modal_old = """.modal-box { background: #ffffff; border: 1px solid var(--border); border-radius: 30px; width: 100%; max-width: 750px; padding: 3rem; max-height: 90vh; overflow-y: auto; box-shadow: 0 30px 60px rgba(0,0,0,0.1); }
.form-group { margin-bottom: 1.5rem; }
.form-label { display: block; color: var(--text-dim); font-size: 0.65rem; font-weight: 900; text-transform: uppercase; margin-bottom: 8px; }
.form-input { width: 100%; background: #f8f9fa; border: 1px solid var(--border); border-radius: 12px; padding: 14px; color: #111; font-size: 0.9rem; }"""

modal_new = """.modal-box { background: #0a0a0a; border: 1px solid var(--border); border-radius: 30px; width: 100%; max-width: 750px; padding: 3rem; max-height: 90vh; overflow-y: auto; }
        .form-group { margin-bottom: 1.5rem; }
        .form-label { display: block; color: var(--text-dim); font-size: 0.65rem; font-weight: 900; text-transform: uppercase; margin-bottom: 8px; }
        .form-input { width: 100%; background: #111; border: 1px solid var(--border); border-radius: 12px; padding: 14px; color: #fff; font-size: 0.9rem; }"""

content = content.replace(modal_old, modal_new)

# 3. Fix stats grid
stat_old = """.stat-card { background: var(--bg-card); padding: 25px; border-radius: 20px; border: 1px solid var(--border); box-shadow: var(--glow); }
.stat-card label { display: block; font-size: 0.65rem; font-weight: 900; color: var(--text-dim); margin-bottom: 10px; }
.stat-card input { width: 100%; background: transparent; border: none; font-size: 2rem; font-weight: 900; color: #111; margin-top: 5px; }"""

stat_new = """.stat-card { background: var(--bg-card); padding: 25px; border-radius: 20px; border: 1px solid var(--border); }
        .stat-card label { display: block; font-size: 0.65rem; font-weight: 900; color: var(--text-dim); margin-bottom: 10px; }
        .stat-card input { width: 100%; background: transparent; border: none; font-size: 2rem; font-weight: 900; color: #fff; margin-top: 5px; }"""

content = content.replace(stat_old, stat_new)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Replacement Complete")
