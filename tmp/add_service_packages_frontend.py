import re
import os

html_path = 'c:\\THE3studio\\index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. We replace the contents of `<div class="pkg-list"` ... `</div>`
# Let's save the original as default to Firebase later or just replace.
# The user wants to manage them. So I'll empty `<div class="pkg-list">` OR let JS do it instead of deleting it.
# Wait, replacing DOM using python is easiest.

# 2. Inject JS into `index.html`
script_to_inject = """
  // --- Service Packages Render ---
  (async function renderServicePackages() {
      try {
          const listSnap = await getDocs(query(collection(db, 'service_packages'), orderBy('sort_order')));
          let packages = [];
          if(!listSnap.empty) {
              listSnap.forEach(doc => packages.push(doc.data()));
          }
          if(packages.length > 0) {
              const pkgList = document.querySelector('.pkg-list');
              if(pkgList) {
                  pkgList.innerHTML = packages.map(p => `
                    <div class="pkg-item" style="padding:2rem 0; border-bottom:1px solid rgba(255,255,255,0.1); cursor:pointer;">
                      <div style="display:flex; justify-content:space-between; align-items:center;">
                         <span style="font-size:1.2rem; font-weight:900; color:inherit; letter-spacing:0.02em;">${p.title}</span>
                         <i class="fa fa-plus pkg-toggle" style="color:inherit; font-size:1.1rem; transition:0.3s;"></i>
                      </div>
                      <div class="pkg-desc" style="max-height:0; overflow:hidden; transition:0.4s ease; color:rgba(255,255,255,0.5); font-size:1rem; line-height:1.7;">
                        <p style="padding-top:1.5rem;">${p.desc}</p>
                      </div>
                    </div>
                  `).join('');
              }
          }
      } catch(e) {
          console.error("Service Packages Load Error:", e);
      }
  })();
"""

if 'Service Packages Render' not in html:
    new_html = re.sub(
        r'(// ── SERVICE PACKAGE TOGGLE ──)', 
        lambda m: script_to_inject + '\n  ' + m.group(1), 
        html
    )
    
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Injected renderServicePackages to index.html successfully.")
else:
    print("renderServicePackages already exists in index.html.")

