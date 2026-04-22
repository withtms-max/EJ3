import codecs
import re

def fix_index():
    print("Starting full restoration of index.html from index_stable.html...")
    # Read the stable file (UTF-16 LE)
    try:
        with codecs.open('index_stable.html', 'r', 'utf-16') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading index_stable.html: {e}")
        return

    # 1. Fix Navigation (Desktop)
    nav_old_pattern = r'<!-- NAV -->.*?<nav id="navbar">.*?</nav>'
    nav_new = """<!-- NAV -->
<nav id="navbar">
  <a href="#home" class="nav-logo">THE <span>3</span> STUDIO</a>
  <ul class="nav-links">
    <li><a href="#home">홈</a></li>
    <li><a href="#team">전문가&서비스</a></li>
    <li><a href="#gallery">포트폴리오</a></li>
    <li><a href="#journey">스토리</a></li>
    <li><a href="/the3cut/">THE3 Cut 🚀</a></li>
    <li><a href="#contact" class="nav-cta">무료 진단받기</a></li>
  </ul>
  <button id="nav-toggle" class="nav-toggle"><i class="fa fa-bars"></i></button>
</nav>"""
    content = re.sub(nav_old_pattern, nav_new, content, flags=re.DOTALL)

    # 2. Fix Mobile Menu
    mobile_old_pattern = r'<!-- MOBILE MENU OVERLAY -->.*?<div class="mobile-menu" id="mobile-menu">.*?</div>'
    mobile_new = """<!-- MOBILE MENU OVERLAY -->
<div class="mobile-menu" id="mobile-menu">
  <button class="close-mobile" id="close-mobile">&times;</button>
  <ul class="mobile-links">
    <li style="--item-index:1;"><a href="#home" onclick="toggleMobileMenu()"><small>01</small> 홈</a></li>
    <li style="--item-index:2;"><a href="#team" onclick="toggleMobileMenu()"><small>02</small> 전문가&서비스</a></li>
    <li style="--item-index:3;"><a href="#gallery" onclick="toggleMobileMenu()"><small>03</small> 포트폴리오</a></li>
    <li style="--item-index:4;"><a href="#journey" onclick="toggleMobileMenu()"><small>04</small> 스토리</a></li>
    <li><a href="/the3cut/" style="color:var(--primary); font-weight:900;"><small>05</small> THE3 Cut 🚀</a></li>
    <li style="--item-index:5;"><a href="#contact" onclick="toggleMobileMenu()"><small>06</small> 무료 진단받기</a></li>
  </ul>
</div>"""
    content = re.sub(mobile_old_pattern, mobile_new, content, flags=re.DOTALL)

    # 3. Fix Hero Section Titles
    hero_old_pattern = r'<div class="fh-title".*?</div>\s*</div>\s*<p id="hero-desc".*?</p>'
    hero_new = """<div class="fh-title" style="max-width: 1200px; padding: 0 20px; z-index: 100; position: relative; opacity: 1 !important;">
    <h3 id="hero-sub" style="font-weight:900; font-size: 0.9rem; color:#E63946; letter-spacing:0.4rem; text-transform:uppercase; margin-bottom:1.5rem; text-align:center;">The Premier Creative Agency</h3>
    
    <div class="the3-hero-wrap" style="width: 100%; max-width: 1200px; margin: 0 auto; text-align:center;">
      <h1 id="the3-headline-main" style="margin-bottom: 2rem; color:#fff;">
        <span id="hero-subline" class="headline-subline" style="margin-bottom: 1rem; display:block;">역사상 가장 바쁜 지금,</span>
        <span id="hero-accent" class="the3-accent" style="display:block;">콘텐츠까지 고민하시나요?</span>
      </h1>
    </div>
    
    <p id="hero-desc" style="color:rgba(255,255,255,0.8); font-weight:600; margin-bottom: 3rem; text-align:center;">
       매출 상승은 콘텐츠가 결정합니다. 진단, 기획, 제작까지<br class="hide-pc"> 고수들의 전문가 집단 &lt;THE3 스튜디오&gt;
    </p>"""
    content = re.sub(hero_old_pattern, hero_new, content, flags=re.DOTALL)

    # Save as UTF-8 (No BOM)
    with codecs.open('index.html', 'w', 'utf-8') as f:
        f.write(content)
    print("Successfully restored index.html and applied branding updates!")

if __name__ == "__main__":
    fix_index()
