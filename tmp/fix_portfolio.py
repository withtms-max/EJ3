import os
import re

filename = 'portfolio.html'
if os.path.exists(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Make categories dynamic
    # Replace the hardcoded tabs
    tabs_html = """<div class="tabs-container" id="filter-tabs">
            <div style="padding:10px; opacity:0.5;">Loading categories...</div>
        </div>"""
    content = re.sub(r'<div class="tabs-container">.*?</div>', tabs_html, content, flags=re.DOTALL)

    # Inject dynamic script
    dynamic_script = """async function renderDynamicCategories() {
            const tabsContainer = document.getElementById('filter-tabs');
            if (!tabsContainer) return;
            
            let cats = [];
            try {
                const { getDoc, doc } = await import('./js/firebase-init.js');
                const snap = await getDoc(doc(window.db || db, 'settings', 'categories'));
                if(snap.exists() && snap.data().list) cats = snap.data().list;
            } catch(e) {}
            
            window.categoryLabel = {};
            let html = '';
            cats.forEach((c, index) => {
                window.categoryLabel[c.id] = c.label.replace(/^\\d+>\\s*/, '');
                html += `<button class="tab-btn ${index === 0 ? 'active' : ''}" data-cat="${c.id}">${c.label.replace(/^\\d+>\\s*/, '')}</button>`;
            });
            tabsContainer.innerHTML = html;
            
            if (cats.length > 0 && window.currentCat === 'all') {
                window.currentCat = cats[0].id;
            }

            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    window.currentCat = btn.dataset.cat;
                    loadWorks(window.currentCat);
                });
            });
            
            if(cats.length > 0) {
                window.currentCat = cats[0].id;
                loadWorks(window.currentCat);
            }
        }"""
    
    if "async function renderDynamicCategories()" not in content:
        content = content.replace("async function loadWorks", "window.currentCat = 'all';\n        " + dynamic_script + "\n\n        async function loadWorks")

        # In loadWorks, remove the initial `loadWorks();` at the bottom
        content = content.replace("loadWorks();", "renderDynamicCategories();")
        
        # Remove the old click listeners
        old_listeners = """tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                loadWorks(btn.dataset.cat);
            });
        });"""
        content = content.replace(old_listeners, "")

        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)

# And now fix admin/index.html to remove 'All' from the portfolio view?
# The user said: "And remove 'all'", "포트폴리오 먹통~ 그리고 all은 없애줘~"
# If they meant `portfolio.html`, `work.html`, I already removed "all" from `work.html` tabs in the previous step.
# Let's ensure 'All' is removed from `admin/index.html` filter bar as well?
# Usually admin 'All' is useful. But if they specifically requested it... let's check `admin/index.html`.
with open('admin/index.html', 'r', encoding='utf-8') as f:
    admin_content = f.read()

# In admin/index.html `cats` includes `{ id: 'all', label: '전체 (Default)' }`
admin_all_replace = """const cats = [
            { id: 'all', label: '전체 (Default)' },
            ...dynamicCats
        ];"""
admin_no_all = """const cats = dynamicCats;"""

if admin_all_replace in admin_content:
    admin_content = admin_content.replace(admin_all_replace, admin_no_all)
    admin_content = admin_content.replace("""renderPortfolio('all')""", """renderPortfolio(dynamicCats.length > 0 ? dynamicCats[0].id : 'all')""") # Wait, dynamicCats is local to switchView? No, in switchView 'portfolio', we renderPortfolio('all').

# Actually, replacing all instances in admin might break things if `all` is hardcoded. 
# Inside `admin/index.html`, around line 565:
# `else if(view === 'portfolio') renderPortfolio('all');`
# I'll just change renderPortfolio to fallback to GLOBAL_CATS[0].id if filter is 'all'.
