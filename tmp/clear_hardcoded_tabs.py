import os
import re

html_files = ['work.html', 'portfolio.html', 'about.html']

for f in html_files:
    path = os.path.join('c:\\THE3studio', f)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        new_content = re.sub(
            r'(<div[^>]*id="filter-tabs"[^>]*>)\s*([\s\S]*?)\s*(</div>)', 
            r'\1\n        <!-- Categories loaded dynamically from DB (Skeleton prevents flickering) -->\n    \3', 
            content
        )
        
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print("Updated (Removed hardcoded filter tabs):", f)
