import sys, re

def main():
    with open('c:/THE3studio/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    with open('c:/THE3studio/new_sections.txt', 'r', encoding='utf-8') as f:
        new_sections = f.read()

    # 1. Add Tailwind CSS CDN right before </head> if not exists
    head_end = html.find('</head>')
    if head_end != -1 and 'tailwindcss.com' not in html:
        tailwind_script = '    <script src="https://cdn.tailwindcss.com"></script>\n'
        html = html[:head_end] + tailwind_script + html[head_end:]

    # 2. Update CSS Variables
    html = re.sub(r'--accent:\s*#[a-fA-F0-9]+;', '--accent: #E63E00;', html)
    html = re.sub(r'--gold:\s*#[a-fA-F0-9]+;', '--gold: #C9A66B;', html)

    # 3. Find insertion point for new_sections.txt
    # We want it right after <nav ...> </nav> or right before <!-- Services Redesign Section -->
    # Since my previous run put <!-- Services Redesign Section --> right after <nav>, we can search for it
    target = '<!-- Services Redesign Section -->'
    insert_pos = html.find(target)
    
    if insert_pos != -1:
        # Check if new_sections is already there
        if 'Hero Section (100vh Cinematic Before & After)' not in html:
            html = html[:insert_pos] + new_sections + '\n\n' + html[insert_pos:]
    else:
        print('Target insertion point not found!')
        return

    # 4. Save
    with open('c:/THE3studio/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
        
    print("SUCCESS")

if __name__ == '__main__':
    main()
