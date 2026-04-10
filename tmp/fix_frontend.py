import os

for filename in ['work.html', 'portfolio.html']:
    if not os.path.exists(filename): continue
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if broken injection is present and fix it
    if "await renderDynamicCategories();" in content:
        # First, remove ALL instances of `await renderDynamicCategories();\n            applyFilterAndSort();`
        content = content.replace("await renderDynamicCategories();\n            applyFilterAndSort();", "applyFilterAndSort();")
        
        # Then, only inject it inside loadWork!
        # loadWork block looks like:
        # async function loadWork() {
        # ...
        # }
        # Let's cleanly inject it before the FIRST call of `applyFilterAndSort();` inside loadWork.
        # Actually, let's just find the loadWork() function body.
        
        loadWork_str = "async function loadWork() {\n        try {\n            if (!allItems.length) {"
        if loadWork_str in content:
            # We already have it, let's make sure it's correct. Wait, we can just replace the specific applyFilterAndSort(); inside loadWork
            # To be safe, just replace `applyFilterAndSort();` with `await renderDynamicCategories(); applyFilterAndSort();` ONLY if it's right after `}` inside loadWork.
            pass
        
        # Best way is to just do a precise regex or string replacement.
        import re
        content = re.sub(r'(if \(!allItems\.length\) \{.*?\})\s*applyFilterAndSort\(\);', 
                         r'\1\n            await renderDynamicCategories();\n            applyFilterAndSort();', 
                         content, flags=re.DOTALL)
                         

    # User requested removing 'All' category and making it default to first item
    # In `renderDynamicCategories`, it does:
    # let html = '<button class="filter-tab active" data-cat="all">All</button>';
    replacement_render = """
        // Override categoryLabel mapping dynamically!
        window.categoryLabel = {};
        let html = '';
        cats.forEach((c, index) => {
            window.categoryLabel[c.id] = c.label.replace(/^\\d+>\\s*/, ''); // Store without prefix
            html += `<button class="filter-tab ${index === 0 ? 'active' : ''}" data-cat="${c.id}">${c.label.replace(/^\\d+>\\s*/, '')}</button>`;
        });
        
        tabsContainer.innerHTML = html;
        if(cats.length > 0 && window.currentCat === 'all') {
            window.currentCat = cats[0].id;
        }
    """
    
    # We must replace the old block inside renderDynamicCategories:
    old_render = """// Override categoryLabel mapping dynamically!
        window.categoryLabel = {};
        let html = '<button class="filter-tab active" data-cat="all">All</button>';
        cats.forEach(c => {
            window.categoryLabel[c.id] = c.label.replace(/^\\d+>\\s*/, ''); // Store without prefix
            html += `<button class="filter-tab" data-cat="${c.id}">${c.label.replace(/^\\d+>\\s*/, '')}</button>`;
        });
        
        tabsContainer.innerHTML = html;
        """
    if old_render in content:
        content = content.replace(old_render, replacement_render)
    
    # Also I need to fix the click listener inside renderDynamicCategories which had the corrupted await!
    broken_click = """                    if(typeof applyFilterAndSort === 'function') await renderDynamicCategories();
            applyFilterAndSort();"""
    content = content.replace(broken_click, "if(typeof applyFilterAndSort === 'function') applyFilterAndSort();")

    # In work.html, `let currentCat = 'all';` is defined globally.
    # It's fine because `renderDynamicCategories` will reset it to `cats[0].id`.
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

