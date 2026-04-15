import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html') and f != 'the3cut.html']

for file in html_files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            encoding = 'utf-8'
    except UnicodeDecodeError:
        with open(file, 'r', encoding='utf-16') as f:
            content = f.read()
            encoding = 'utf-16'

    # Skip if THE3 컷 is already there
    if 'THE3 컷' in content:
        continue

    # Desktop
    content = re.sub(
        r'(<li><a[^>]*>포트폴리오</a></li>)',
        r'\1\n    <li><a href="the3cut.html">THE3 컷</a></li>',
        content,
        flags=re.IGNORECASE
    )

    # Mobile
    content = re.sub(
        r'(<li[^>]*><a[^>]*><small>[^<]*</small>\s*포트폴리오</a></li>)',
        r'\1\n    <li style="--item-index:3.5;"><a href="the3cut.html" onclick="toggleMobileMenu()"><small>AI</small> THE3 컷</a></li>',
        content,
        flags=re.IGNORECASE
    )

    with open(file, 'w', encoding=encoding) as f:
        f.write(content)

print("Menus added.")
