import sys, re

def process():
    try:
        with open('c:/THE3studio/index.html', 'r', encoding='utf-8') as f:
            html = f.read()
    except Exception as e:
        print('Error reading', e)
        return

    # Add tailwind script right before </head> if not present
    head_end = html.find('</head>')
    if head_end != -1 and 'tailwindcss.com' not in html:
        tailwind_script = '<script src="https://cdn.tailwindcss.com"></script>\n'
        html = html[:head_end] + tailwind_script + html[head_end:]

    # Update CSS variables: 
    # The existing was something like --accent: #FF7E36;
    html = re.sub(r'--accent:\s*#[a-fA-F0-9]+;', '--accent: #E63E00;', html)
    html = re.sub(r'--gold:\s*#[a-fA-F0-9]+;', '--gold: #C9A66B;', html)
    # the user also said: "1단계에서 정의한 --accent #E63E00, --gold #C9A66B 등 CSS 변수와 호환되게 조정."

    # Now let's grab the stuff after </html>
    html_split = html.split('</html>')
    before_html = html_split[0]
    after_html = html_split[1] if len(html_split) > 1 else ''

    # Get the pieces inside <body>
    body_start_match = re.search(r'<body[^>]*>', before_html)
    if not body_start_match:
        print("Body tag not found")
        return
        
    body_start_idx = body_start_match.end()
    body_end_idx = before_html.rfind('</body>')

    body_inner = before_html[body_start_idx:body_end_idx]

    # Find the different sections inside the old body
    # nav
    nav_match = re.search(r'<nav.*?</nav>', body_inner, flags=re.DOTALL)
    nav_html = nav_match.group(0) if nav_match else ''
    
    # services-redesign (Services)
    services_match = re.search(r'<!-- Services Redesign Section -->.*?</section>', body_inner, flags=re.DOTALL)
    services_html = services_match.group(0) if services_match else ''

    # pricing-section (Packages)
    pricing_match = re.search(r'<!-- Pricing & Packages Section \(New\) -->.*?</section>', body_inner, flags=re.DOTALL)
    pricing_html = pricing_match.group(0) if pricing_match else ''

    # contact (CTA)
    contact_match = re.search(r'<!-- Contact Chat Section -->.*?</section>', body_inner, flags=re.DOTALL)
    contact_html = contact_match.group(0) if contact_match else ''

    # footer
    footer_match = re.search(r'<footer>.*?</footer>', body_inner, flags=re.DOTALL)
    footer_html = footer_match.group(0) if footer_match else ''

    # contact-suite (Floating CTA)
    contact_suite_match = re.search(r'<!-- Floating Contact Button & AI Chatbot -->.*?</div>\s*<style>.*?</style>', body_inner, flags=re.DOTALL)
    if not contact_suite_match:
        contact_suite_match = re.search(r'<div class="contact-suite">.*?<style>.*?</style>', body_inner, flags=re.DOTALL)
    contact_suite_html = contact_suite_match.group(0) if contact_suite_match else ''

    # script 
    # Because there are a couple of scripts, let's grab the last big script block which has the logic
    script_match = re.search(r'<script>\s*/\* ===== 포트폴리오 상세 팝업 스크립트 ===== \*/.*?</script>', body_inner, flags=re.DOTALL)
    script_html = script_match.group(0) if script_match else ''
    
    if not script_html:
        scripts = re.findall(r'<script>.*?</script>', body_inner, flags=re.DOTALL)
        if scripts:
            script_html = scripts[-1]

    # Combine the new body content
    new_body_pieces = [
        nav_html,
        after_html.strip(),  # newly pasted ones: Hero, Real Results, Portfolio
        services_html,
        pricing_html,
        contact_html,
        footer_html,
        contact_suite_html,
        script_html
    ]

    new_body = '\n\n'.join([p for p in new_body_pieces if p])

    new_full_html = before_html[:body_start_idx] + '\n' + new_body + '\n</body>\n</html>'
    
    with open('c:/THE3studio/index.html', 'w', encoding='utf-8') as f:
        f.write(new_full_html)
    
    print('PROCESS COMPLETE')

process()
