import re
import os

ADMIN_FILE = 'admin/index.html'
WORK_FILE = 'work.html'
PORTFOLIO_FILE = 'portfolio.html'
ABOUT_FILE = 'about.html'

def fix_admin():
    with open(ADMIN_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add nav item
    nav_item = """<div class="nav-item" onclick="switchView('manage_categories')" style="background: rgba(100,50,200,0.1); border: 1px solid rgba(100,50,200,0.3);"><i class="fa fa-tags" style="color:#b57bff;"></i> <b>카테고리명/순서 관리</b></div>"""
    content = content.replace("""<div class="nav-item" onclick="switchView('portfolio')"><i class="fa fa-folder"></i> 포트폴리오(3D 카드) 관리</div>""", 
                              nav_item + "\n            <div class=\"nav-item\" onclick=\"switchView('portfolio')\"><i class=\"fa fa-folder\"></i> 포트폴리오(3D 카드) 관리</div>")

    # 2. switchView wiring
    content = content.replace("""else if(view === 'contact_settings') renderContactSettings();""",
"""else if(view === 'contact_settings') renderContactSettings();
        else if(view === 'manage_categories') renderManageCategories();""")

    # 3. renderManageCategories implementation
    func = """
    // ───── 카테고리 관리 (NEW) ─────
    async function renderManageCategories() {
        appView.innerHTML = '<div style="text-align:center; padding:10rem;"><i class="fa fa-spinner fa-spin"></i></div>';
        const s = await getDoc(doc(db, 'settings', 'categories'));
        let cats = [];
        if(s.exists()) {
            cats = s.data().list || [];
        } else {
            cats = [
                { id: 'calligraphy', label: '1> 캘리그라피 상호디자인' },
                { id: 'video', label: '2> 돈되는 영상만들기' },
                { id: 'storyboard', label: '3> 우리매장 스토리보드' },
                { id: 'photo', label: '4> 내 가게 사진촬영' },
                { id: 'character', label: '5> 가게 캐릭터만들기' }
            ];
        }
        
        appView.innerHTML = `
            <div class="header-content"><div class="view-title"><h1>카테고리 마스터</h1><p>웹사이트 전체에 표시될 카테고리 노출 순서와 이름, ID를 통제합니다.</p></div></div>
            <div class="table-container" style="padding:3rem;">
                <p style="font-size:0.8rem; color:var(--text-dim); margin-bottom:1rem;">* 순서 번호가 작은 카테고리가 <b>먼저 노출</b>됩니다. <b>ID</b>는 영문/숫자만 사용하세요.</p>
                <div id="cat-wrap" style="display:flex; flex-direction:column; gap:10px;"></div>
                <button class="btn-s" style="margin-top:20px; background:rgba(255,255,255,0.05); color:var(--text-dim);" onclick="addCatRow()"><i class="fa fa-plus"></i> 새 카테고리 추가</button>
                <button class="btn" style="margin-top:20px; width:100%; box-shadow:var(--glow);" onclick="saveCats()"><i class="fa fa-save"></i> 카테고리 구성 적용 및 저장</button>
            </div>
        `;
        
        window.catListMem = cats;
        window.renderCatRows = function() {
            document.getElementById('cat-wrap').innerHTML = window.catListMem.map((c, i) => `
                <div style="display:flex; gap:10px; align-items:center; background:rgba(255,255,255,0.02); padding:10px 15px; border-radius:10px; border:1px solid var(--border);">
                    <i class="fa fa-bars" style="color:var(--text-dim); opacity:0.5;"></i>
                    <input type="number" class="form-input" style="width:70px; padding:10px; font-size:0.9rem;" value="${i+1}" id="c-order-${i}" title="순서">
                    <input type="text" class="form-input" style="width:140px; padding:10px; font-size:0.9rem; opacity:${i<5?0.6:1}" value="${c.id}" id="c-id-${i}" placeholder="고유 ID (영문)" ${i<5?'readonly':''}>
                    <input type="text" class="form-input" style="flex:1; padding:10px; font-size:0.9rem;" value="${c.label}" id="c-label-${i}" placeholder="표시명 (예: 브랜드 디자인)">
                    <button class="btn-s" style="background:#dc2626; color:#fff; padding:6px 12px;" onclick="window.catListMem.splice(${i}, 1); renderCatRows();"><i class="fa fa-trash"></i></button>
                </div>
            `).join('');
        };
        window.addCatRow = function() { window.catListMem.push({id:'', label:''}); renderCatRows(); };
        window.saveCats = async function() {
            let newList = [];
            for(let i=0; i<window.catListMem.length; i++) {
                newList.push({
                    order: parseInt(document.getElementById('c-order-'+i).value)||99,
                    id: document.getElementById('c-id-'+i).value.trim(),
                    label: document.getElementById('c-label-'+i).value.trim()
                });
            }
            newList.sort((a,b) => a.order - b.order);
            const fin = newList.map(c => ({ id: c.id, label: c.label }));
            await setDoc(doc(db, 'settings', 'categories'), { list: fin });
            alert('카테고리가 저장되었습니다. 이제 홈페이지에 자동으로 반영됩니다!');
            renderManageCategories();
        };
        window.renderCatRows();
    }
"""
    if "async function renderManageCategories" not in content:
        content = content.replace("async function renderDashboard()", func + "\n    async function renderDashboard()")

    # 4. Update renderPortfolioHeroSettings
    replace_portfolio_hero = """
        const catSnap = await getDoc(doc(db, 'settings', 'categories'));
        let dynamicCats = [];
        if(catSnap.exists() && catSnap.data().list) {
            dynamicCats = catSnap.data().list;
        } else {
            dynamicCats = [
                { id: 'calligraphy', label: '1> 캘리그라피 상호디자인' },
                { id: 'video', label: '2> 돈되는 영상만들기' },
                { id: 'storyboard', label: '3> 우리매장 스토리보드' },
                { id: 'photo', label: '4> 내 가게 사진촬영' },
                { id: 'character', label: '5> 가게 캐릭터만들기' }
            ];
        }
        const cats = [
            { id: 'all', label: '전체 (Default)' },
            ...dynamicCats
        ];
"""
    content = re.sub(r"const cats\s*=\s*\[.*?(?=];)\];", replace_portfolio_hero.strip(), content, flags=re.DOTALL)

    # 5. We also need to fetch categories for `createModalHtml` which generates the `<select>` options.
    # Currently `createModalHtml` is synchronous. We must fetch it dynamically.
    # Actually, modifying `createModalHtml` might be hard since it's synchronous. Let's make it fetch from `window.GLOBAL_CATS`.
    # Let's inject `window.GLOBAL_CATS` at initialization.
    global_cats_fetch = """
    // FETCH CATEGORIES FOR GLOBALS
    window.GLOBAL_CATS = [];
    getDoc(doc(db, 'settings', 'categories')).then(catSnap => {
        if(catSnap.exists() && catSnap.data().list) {
            window.GLOBAL_CATS = catSnap.data().list;
        } else {
            window.GLOBAL_CATS = [
                { id: 'calligraphy', label: '1> 캘리그라피 상호디자인' },
                { id: 'video', label: '2> 돈되는 영상만들기' },
                { id: 'storyboard', label: '3> 우리매장 스토리보드' },
                { id: 'photo', label: '4> 내 가게 사진촬영' },
                { id: 'character', label: '5> 가게 캐릭터만들기' }
            ];
        }
    });

    const appView = document.getElementById('app-view');
"""
    if "window.GLOBAL_CATS" not in content:
        content = content.replace("const appView = document.getElementById('app-view');", global_cats_fetch)

    # Replace hardcoded options in `createModalHtml` for 'portfolio'
    # It contains:
    # <select name="category" class="form-input" required>
    #     <option value="calligraphy" ${data?.category==='calligraphy'?'selected':''}>1> 캘리그라피 상호디자인</option>
    #     ...
    # </select>
    options_generator = """
                                <select name="category" class="form-input" required>
                                    ${window.GLOBAL_CATS.map(c => `<option value="${c.id}" ${data?.category===c.id?'selected':''}>${c.label}</option>`).join('')}
                                </select>
"""
    content = re.sub(r'<select name="category" class="form-input" required>.*?</select>', options_generator.strip(), content, flags=re.DOTALL)

    with open(ADMIN_FILE, 'w', encoding='utf-8') as f:
        f.write(content)


def fix_frontend(filename):
    if not os.path.exists(filename): return
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # DYNAMIC FILTER RENDERER SCRIPT INJECTION (Replaces hardcoded <div class="filter-tabs"> initialization)
    if "async function renderDynamicCategories()" not in content:
        script_injection = """
    // FETCH AND RENDER DYNAMIC CATEGORIES
    async function renderDynamicCategories() {
        const tabsContainer = document.getElementById('filter-tabs');
        if (!tabsContainer) return;
        
        let cats = [];
        try {
            const { getDoc, doc } = await import('./js/firebase-init.js');
            const snap = await getDoc(doc(window.db || db, 'settings', 'categories'));
            if(snap.exists() && snap.data().list) {
                cats = snap.data().list;
            }
        } catch(e) {}
        
        if(!cats.length) {
            cats = [
                { id: 'calligraphy', label: '캘리그라피 상호디자인' },
                { id: 'video', label: '내가게 돈되는 영상만들기' },
                { id: 'storyboard', label: '우리매장 스토리보드' },
                { id: 'photo', label: '내가게의 사진촬영' },
                { id: 'character', label: '내가게의 캐릭터만들기' }
            ];
        }

        // Override categoryLabel mapping dynamically!
        window.categoryLabel = {};
        let html = '<button class="filter-tab active" data-cat="all">All</button>';
        cats.forEach(c => {
            window.categoryLabel[c.id] = c.label.replace(/^\\d+>\\s*/, ''); // Store without prefix
            html += `<button class="filter-tab" data-cat="${c.id}">${c.label.replace(/^\\d+>\\s*/, '')}</button>`;
        });
        
        tabsContainer.innerHTML = html;
        
        // Reattach event listeners
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', function () {
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                if(typeof window.currentCat !== 'undefined') {
                    window.currentCat = this.dataset.cat;
                    if(typeof applyFilterAndSort === 'function') applyFilterAndSort();
                    if(typeof updateCinematicHero === 'function') updateCinematicHero(window.currentCat);
                }
            });
        });
    }
    
    // override loadWork or DOM load
"""
        # Inject script near the end of the <script type="module">
        content = content.replace("async function loadWork() {", script_injection + "\n    async function loadWork() {")
        
        # append dynamic fetching inside loadWork
        content = content.replace("applyFilterAndSort();", "await renderDynamicCategories();\n            applyFilterAndSort();")

        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)

fix_admin()
fix_frontend(WORK_FILE)
# fix_frontend(PORTFOLIO_FILE) # Portfolio is simpler, mostly same
