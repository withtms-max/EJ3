import re

with open('admin/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fallback filter to first cat in renderPortfolio
content = content.replace("currentPortfolioFilter = filter;", 
"""currentPortfolioFilter = filter;
        if (filter === 'all' && window.GLOBAL_CATS && window.GLOBAL_CATS.length > 0) {
            filter = window.GLOBAL_CATS[0].id;
            currentPortfolioFilter = filter;
        }""")

# Set first tab active natively in renderPortfolioHeroSettings
content = content.replace("window.selectHeroTab('all', appView.querySelector('.nav-item.active'));",
"""const firstCatId = (window.GLOBAL_CATS && window.GLOBAL_CATS.length > 0) ? window.GLOBAL_CATS[0].id : '';
            if(firstCatId) window.selectHeroTab(firstCatId, appView.querySelector('.nav-item'));""")

with open('admin/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
