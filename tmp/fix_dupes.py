import re

with open('admin/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove duplicate nav item
# Find all occurrences of the nav_item block
nav_block = """<div class="nav-item" onclick="switchView('manage_categories')" style="background: rgba(100,50,200,0.1); border: 1px solid rgba(100,50,200,0.3);"><i class="fa fa-tags" style="color:#b57bff;"></i> <b>카테고리명/순서 관리</b></div>"""
text = text.replace(nav_block + "\n            <div class=\"nav-item\" onclick=\"switchView('portfolio')\"><i class=\"fa fa-folder\"></i> 포트폴리오(3D 카드) 관리</div>\n            " + nav_block, 
                    nav_block)

# Just in case it's a cleaner duplicate
count = text.count(nav_block)
if count > 1:
    text = text.replace(nav_block, "", count - 1)


# 2. Fix duplicated catSnap blocks
dup_block = """        const catSnap = await getDoc(doc(db, 'settings', 'categories'));
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
        }"""

text = text.replace(dup_block + "\n" + dup_block, dup_block)

# Write it back
with open('admin/index.html', 'w', encoding='utf-8') as f:
    f.write(text)
