import os
import glob

files_to_check = [
    'work-detail.html',
    'contact.html',
    'portfolio.html',
    'services.html',
    'about.html',
    'admin/index.html',
    'admin/login.html'
]

# We also need to fix contact.html's active chip styles since it used #0066ff.
# Specifically in contact.html:
# .svc-chip:hover { border-color: #0066ff; color: #fff; transform: translateY(-2px); }
# body.light-mode .svc-chip.selected { background: #0066ff !important; color: #fff !important; ... }
# These all use #0066ff and will be gracefully changed to #C8102E.

for filename in files_to_check:
    filepath = os.path.join(r'c:\THE3studio', filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the literal #0066ff
        modified = content.replace('#0066ff', '#C8102E')
        
        # Also replace #0044aa with #A00D25 (the hover/gradient variant in blue vs red)
        # In contact.html or services.html, if #0044aa is used in gradient
        modified = modified.replace('#0044aa', '#A00D25')
        
        # In portfolio.html, there's #74b3ff in gradient.
        modified = modified.replace('#74b3ff', '#EF9A9A') # lighter red variant
        
        if content != modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(modified)
            print(f'Updated {filename}')
        else:
            print(f'No changes for {filename}')
    else:
        print(f'File not found: {filename}')
