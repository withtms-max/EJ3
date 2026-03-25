import json
import re

def rebuild_site():
    with open('index_backup_spline.html', 'r', encoding='utf-8') as f:
        old_html = f.read()

    # Extract the script block
    script_block_start = old_html.find('<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>')
    script_block = old_html[script_block_start:] if script_block_start != -1 else ""

    new_html = """<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>THE3 STUDIO | 사장님들의 든든한 디자인 파트너</title>
    <!-- Tailwind -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Pretendard', 'sans-serif'],
                        outfit: ['Outfit', 'sans-serif']
                    },
                    colors: {
                        brand: {
                            DEFAULT: '#C9A66B', // The Warm Gold they use
                            red: '#E63E00', // Terracotta Red
                            dark: '#141414',
                            darker: '#0a0a0a',
                        }
                    }
                }
            }
        }
    </script>
    
    <!-- Spline & Swiper & Icons -->
    <script type="module" src="https://unpkg.com/@splinetool/viewer/build/spline-viewer.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;700;900&family=Outfit:wght@400;700;900&display=swap" rel="stylesheet">
    
    <style>
        body { background: #141414; color: #fff; scroll-behavior: smooth; overflow-x: hidden; }
        ::selection { background: #C9A66B; color: #000; }
        
        /* Swiper coverflow styles adapted */
        .cover-swiper { width: 100%; padding: 40px 0; }
        .cover-swiper .swiper-slide {
            width: 250px; height: 350px; border-radius: 20px;
            background-size: cover; background-position: center;
            border: 1px solid rgba(255,255,255,0.1);
            transition: all 0.5s;
            -webkit-box-reflect: bottom 15px linear-gradient(transparent, transparent 70%, rgba(255, 255, 255, 0.15));
        }
        .cover-swiper .swiper-slide-active {
            border-color: #C9A66B;
            box-shadow: 0 0 40px rgba(201, 166, 107, 0.3);
        }
        
        /* Modals & Chatbot custom styles to support the JS */
        .pf-modal-backdrop { display: none; position: fixed; inset: 0; z-index: 9999; background: rgba(10,8,6,0.92); backdrop-filter: blur(16px); align-items: center; justify-content: center; padding: 20px; }
        .pf-modal-backdrop.open { display: flex; }
        .pf-modal { background: #1a1612; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; width: 100%; max-width: 900px; max-height: 90vh; overflow-y: auto; position: relative; }
        .pf-close { position: absolute; top: 20px; right: 24px; font-size: 1.8rem; color: rgba(255,255,255,0.4); cursor: pointer; z-index: 10;}
        .pf-gallery { position: relative; width: 100%; height: 50vw; max-height: 400px; overflow: hidden; border-radius: 24px 24px 0 0; background: #0a0a0a; }
        .pf-gallery-slides { display: flex; height: 100%; transition: transform 0.45s; }
        .pf-slide { min-width: 100%; height: 100%; object-fit: contain; }
        .pf-gallery-btn { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); border: none; color: #fff; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; z-index: 5; }
        .pf-gallery-btn.prev { left: 16px; } .pf-gallery-btn.next { right: 16px; }
        .pf-gallery-dots { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; z-index: 5;}
        .pf-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.3); border: none; cursor: pointer; }
        .pf-dot.active { background: #fff; transform: scale(1.3); }
        .pf-body { padding: 32px; }
        .pf-tag { display: inline-block; padding: 4px 14px; border-radius: 99px; font-size: 0.8rem; background: rgba(201,166,107,0.15); color: #C9A66B; margin-bottom: 14px; font-weight:700;}
        .pf-sections { display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 20px;}
        @media(min-width: 640px) { .pf-sections { grid-template-columns: 1fr 1fr 1fr; } }
        .pf-section-item { background: rgba(255,255,255,0.04); padding: 20px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.05); }
        
        .contact-suite { position: fixed; bottom: 30px; right: 30px; z-index: 2000; }
        .chatbot-window { position: absolute; bottom: 80px; right: 0; width: 350px; height: 500px; background: #1a1a1a; border: 1px solid #333; border-radius: 20px; display: flex; flex-direction: column; transform: translateY(20px); opacity: 0; pointer-events: none; transition: all 0.3s; overflow:hidden;}
        .chatbot-window.active { transform: translateY(0); opacity: 1; pointer-events: all; }
        .chat-header { padding: 20px; background: #111; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #333; }
        .chat-messages { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; background:#141414; }
        .message { max-width: 85%; padding: 12px 16px; border-radius: 16px; font-size: 0.9rem; }
        .bot-message { background: #222; align-self: flex-start; border-bottom-left-radius: 4px; }
        .user-message { background: #C9A66B; color: #000; align-self: flex-end; border-bottom-right-radius: 4px; font-weight:bold; }
        .chat-input-area { padding: 15px; display: flex; gap: 10px; background: #111; border-top: 1px solid #333;}
        .chat-options { padding: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; border-top: 1px solid #333; background:#111;}
        .chat-options button { background: #222; border: 1px solid #333; color: #ccc; padding: 10px; border-radius: 8px; font-size: 0.8rem; cursor: pointer; transition: 0.2s;}
        .chat-options button:hover { border-color: #C9A66B; color: #C9A66B; }
        .floating-contact { width: 60px; height: 60px; background: #C9A66B; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: #000; cursor: pointer; box-shadow: 0 10px 20px rgba(201, 166, 107, 0.3); transition: transform 0.3s; text-decoration: none;}
        .floating-contact:hover { transform: scale(1.1); }
        .close-chat { margin-left: auto; background: none; border: none; color: #999; font-size: 1.5rem; cursor: pointer; }
        #chat-input { flex: 1; background: #000; border: 1px solid #333; border-radius: 8px; padding: 10px; color: #fff; outline:none;}
        #chat-input:focus { border-color: #C9A66B; }
        #send-chat { background: #C9A66B; color: #000; padding: 0 15px; border-radius: 8px; font-weight: bold; cursor:pointer;}
        
        .pulse-ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid #C9A66B; animation: pulse 2s infinite; pointer-events:none;}
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
        
        .stagger-item { opacity: 0; transform: translateY(30px); transition: all 0.8s ease; }
        .stagger-item.is-visible { opacity: 1; transform: translateY(0); }
    </style>
</head>
<body class="bg-brand-dark text-white font-sans selection:bg-brand selection:text-black">
    
    <!-- 1. Navigation Bar -->
    <nav class="fixed top-0 w-full flex justify-between items-center p-6 md:px-12 z-50 backdrop-blur-md bg-brand-dark/80 border-b border-white/5 transition-all">
        <div class="text-2xl font-black tracking-tighter uppercase font-outfit">
            {THE3 STUDIO}
        </div>
        <a href="#contact" class="flex items-center gap-2 bg-brand text-black px-6 py-2 uppercase font-bold text-sm tracking-widest hover:bg-white transition-colors cursor-pointer">
            <span>[ 문의하기 ]</span>
        </a>
    </nav>

    <!-- 2. Hero Section (3D Spline) -->
    <header class="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center pt-20" id="home">
        <!-- Crosshair lines -->
        <div class="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/10 -translate-x-1/2 pointer-events-none z-10"></div>
        <div class="absolute top-1/2 bottom-0 left-0 right-0 h-[1px] bg-white/10 -translate-y-1/2 pointer-events-none z-10"></div>

        <!-- 3D Spline -->
        <div class="absolute inset-0 w-full h-full z-0 transform scale-[1.3] md:scale-[1.5] origin-center">
            <spline-viewer url="https://prod.spline.design/zYnTxAxV1wIuElaT/scene.splinecode"></spline-viewer>
        </div>

        <div class="relative z-10 pointer-events-none flex flex-col items-center mt-[-5vh] w-full px-4 text-center">
            <!-- Using existing IDs for api sync -->
            <h1 id="hero-tagline-main" class="text-[12vw] leading-[0.85] font-black tracking-tighter uppercase mix-blend-difference text-white font-outfit">
                CREATIVE<br/>INNOVATION
            </h1>
            
            <div class="mt-16 flex flex-col items-center">
                <div class="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center mb-8 backdrop-blur-sm animate-bounce">
                    <i class="fa-solid fa-arrow-down text-brand"></i>
                </div>
                <!-- Dynamic loaded from admin -->
                <p id="hero-subtitle" class="text-white max-w-xl text-lg md:text-xl font-medium tracking-tight bg-black/60 p-6 rounded-2xl backdrop-blur-md border border-white/10 break-keep leading-[1.6]">
                    사장님은 장사만 하세요.<br/>
                    저희가 성장의 모든 과정을 책임집니다.
                </p>
                <div id="hero-title" class="hidden"></div>
                <div id="hero-top-phrase" class="hidden"></div>
            </div>
        </div>
    </header>

    <!-- 3. Cover Flow Swiper Section -->
    <section class="bg-brand-darker py-20 relative z-20 overflow-hidden border-t border-white/5" id="hero-carousel">
        <div class="text-center mb-8">
            <p class="text-brand font-bold tracking-widest uppercase text-sm">Best Works</p>
            <h2 class="text-3xl font-black mt-2 font-outfit">FEATURED PROJECTS</h2>
        </div>
        <div class="swiper cover-swiper">
            <div class="swiper-wrapper" id="hero-swiper-wrapper">
                <!-- Dynamically loaded -->
            </div>
            <div class="swiper-pagination"></div>
        </div>
    </section>

    <!-- 4. Introduction (Light mode transition style) -->
    <section class="bg-[#e5e5e5] text-[#141414] py-32 md:py-48 px-6 sm:px-12 relative overflow-hidden" id="about">
        <!-- dots background -->
        <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(#000 1.5px, transparent 1.5px); background-size: 32px 32px"></div>
        
        <div class="max-w-7xl mx-auto">
            <h2 class="text-[40px] md:text-[60px] leading-[1.1] font-black tracking-tighter uppercase relative z-10 font-outfit">
                INTERSECTING<br/>BUSINESS & DESIGN
            </h2>
            
            <div class="mt-20 grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 relative z-10">
                <div class="md:col-span-6 flex flex-col justify-center">
                    <p class="text-2xl md:text-3xl font-bold leading-[1.5] tracking-tight mb-8 break-keep">
                        비싼 로고, 복잡한 기획서가<br/>정답은 아닙니다.
                    </p>
                    <p class="text-lg md:text-xl text-black/70 font-medium leading-[1.6] break-keep">
                        정확한 상권 타겟팅, 브랜드를 각인시키는 비주얼, 
                        그리고 구매를 부르는 마케팅 영상 배포까지.<br/><br/>
                        거품은 걷어내고, 사장님의 매장에 딱 맞는 최적의 크리에이티브 솔루션만을 제공하여 즉각적인 성장을 견인합니다.
                    </p>
                </div>
                <div class="md:col-span-6 bg-[#141414] aspect-square md:aspect-video flex items-center justify-center border-l-8 border-brand shadow-2xl relative overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop" class="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" alt="">
                    <span class="relative z-10 text-brand font-bold uppercase tracking-widest px-6 py-3 border border-brand/20 backdrop-blur-md group-hover:bg-brand group-hover:text-black group-hover:border-transparent transition-all duration-300">
                        [ Our Philosophy ]
                    </span>
                </div>
            </div>
        </div>
    </section>

    <!-- 5. Services Capabilities List -->
    <section class="bg-gradient-to-b from-[#0a0a0a] to-[#141414] text-white py-32 md:py-48 px-6 sm:px-12 border-t border-white/5" id="services">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
            <div class="md:col-span-4 flex flex-col pt-4">
                <h3 class="text-2xl font-bold uppercase tracking-widest text-brand mb-8 font-outfit">Capabilities</h3>
                <p class="text-white/60 text-lg leading-[1.6] font-medium break-keep">
                    기획부터 브랜딩 개발,<br/>마케팅 영상 제작까지<br/>비즈니스의 모든 과정을<br/>완벽하게 구축합니다.
                </p>
            </div>
            
            <div class="md:col-span-8 flex flex-col border-t border-white/10">
                <div class="group flex justify-between items-center py-10 border-b border-white/10 hover:border-brand cursor-pointer transition-colors duration-300 stagger-item">
                    <span class="text-2xl md:text-[40px] font-black uppercase tracking-tighter text-white/50 group-hover:text-white transition-colors duration-300 break-keep leading-[1.2] font-outfit">Brand Identity & Strategy</span>
                    <i class="fa-solid fa-plus text-2xl text-white/20 group-hover:text-brand transition-all duration-300 transform group-hover:rotate-90"></i>
                </div>
                <div class="group flex justify-between items-center py-10 border-b border-white/10 hover:border-brand cursor-pointer transition-colors duration-300 stagger-item">
                    <span class="text-2xl md:text-[40px] font-black uppercase tracking-tighter text-white/50 group-hover:text-white transition-colors duration-300 break-keep leading-[1.2] font-outfit">UX UI Web Design</span>
                    <i class="fa-solid fa-plus text-2xl text-white/20 group-hover:text-brand transition-all duration-300 transform group-hover:rotate-90"></i>
                </div>
                <div class="group flex justify-between items-center py-10 border-b border-white/10 hover:border-brand cursor-pointer transition-colors duration-300 stagger-item">
                    <span class="text-2xl md:text-[40px] font-black uppercase tracking-tighter text-white/50 group-hover:text-white transition-colors duration-300 break-keep leading-[1.2] font-outfit">Video Production & Motion</span>
                    <i class="fa-solid fa-plus text-2xl text-white/20 group-hover:text-brand transition-all duration-300 transform group-hover:rotate-90"></i>
                </div>
                <div class="group flex justify-between items-center py-10 border-b border-white/10 hover:border-brand cursor-pointer transition-colors duration-300 stagger-item">
                    <span class="text-2xl md:text-[40px] font-black uppercase tracking-tighter text-white/50 group-hover:text-white transition-colors duration-300 break-keep leading-[1.2] font-outfit">Digital Marketing & SEO</span>
                    <i class="fa-solid fa-plus text-2xl text-white/20 group-hover:text-brand transition-all duration-300 transform group-hover:rotate-90"></i>
                </div>
            </div>
        </div>
    </section>

    <!-- 6. Portfolio Integration -->
    <section class="bg-[#111] py-32 px-6 sm:px-12 border-t border-white/5" id="portfolio">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-brand text-xl font-bold mb-2 uppercase tracking-widest font-outfit">Selected Works</h2>
            <div class="h-[1px] w-full bg-white/10 mb-12"></div>
            
            <div id="portfolio-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Loaded dynamically by Javascript -->
                <div class="col-span-full text-center py-12 text-white/40">포트폴리오를 불러오는 중입니다...</div>
            </div>
        </div>
    </section>

    <!-- 8. Team & Journey -->
    <section class="bg-brand-dark py-32 px-6 sm:px-12" id="about-team">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-brand text-xl font-bold mb-2 uppercase tracking-widest font-outfit text-center">The Experts</h2>
            <h3 class="text-center text-3xl md:text-5xl font-black mb-16 uppercase tracking-tighter break-keep">분야별 최고의 전문가가 함께합니다.</h3>
            <div id="team-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                <!-- API Loading -->
            </div>
        </div>
        <div class="max-w-7xl mx-auto mt-32" id="journey">
            <h2 class="text-brand text-xl font-bold mb-2 uppercase tracking-widest font-outfit text-center">Our Journey</h2>
            <h3 class="text-center text-3xl md:text-5xl font-black mb-16 uppercase tracking-tighter break-keep">지속적으로 혁신합니다.</h3>
            <!-- grid from JS requires some styling fixes -->
            <div id="journey-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <!-- API Loading -->
            </div>
        </div>
    </section>
    
    <!-- 7. Scrolling Partner/Logo Bar -->
    <style>
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    </style>
    <section class="bg-brand text-black py-12 border-y border-white/20 overflow-hidden flex whitespace-nowrap">
        <div class="flex gap-16 items-center uppercase font-black text-2xl tracking-widest opacity-80 font-outfit px-8" style="animation: scroll 20s linear infinite;">
            <div class="flex items-center gap-16 clients-logo-grid"></div>
            <div class="flex items-center gap-16 clients-logo-grid"></div>
        </div>
    </section>

    <!-- 9. Big Footer -->
    <footer class="bg-black text-white py-32 md:py-48 px-6 flex flex-col items-center text-center relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/10 rounded-full blur-[120px] pointer-events-none"></div>

        <h2 class="text-[30px] sm:text-[40px] md:text-[60px] leading-[1.1] font-black tracking-tighter uppercase mb-6 hover:text-brand transition-colors duration-500 cursor-pointer relative z-10 break-keep font-outfit">
            HELLO@THE3STUDIO.COM
        </h2>
        
        <p class="font-bold tracking-widest uppercase text-sm md:text-base mb-24 text-white/50 relative z-10 leading-[1.6]">
            사장님의 성장이 곧 우리의 성장입니다.
        </p>
        
        <div class="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-10 uppercase font-bold text-xs md:text-sm tracking-widest text-white/40 relative z-10">
            <span>© 2026 THE3 STUDIO. ALL RIGHTS RESERVED.</span>
            <span class="mt-4 md:mt-0">Seoul, South Korea</span>
        </div>
    </footer>

    <!-- ===== Modals & Chatbot Suites ===== -->
    <div class="pf-modal-backdrop" id="pf-modal" role="dialog">
        <div class="pf-modal" id="pf-modal-inner">
            <span class="pf-close" id="pf-close">&times;</span>
            <div class="pf-gallery" id="pf-gallery">
                <div class="pf-gallery-slides" id="pf-slides"></div>
                <button class="pf-gallery-btn prev" id="pf-prev">‹</button>
                <button class="pf-gallery-btn next" id="pf-next">›</button>
                <div class="pf-gallery-dots" id="pf-dots"></div>
            </div>
            <div class="pf-body">
                <span class="pf-tag" id="pf-tag"></span>
                <h2 class="text-3xl font-black mb-2" id="pf-title"></h2>
                <p class="text-white/40 text-sm mb-6" id="pf-client"></p>
                <div class="pf-sections" id="pf-sections">
                    <div class="pf-section-item" id="pf-challenge-wrap">
                        <h4 class="text-brand text-xs font-bold uppercase mb-2">Challenge</h4>
                        <p class="text-white/70 text-sm" id="pf-challenge"></p>
                    </div>
                    <div class="pf-section-item" id="pf-solution-wrap">
                        <h4 class="text-brand text-xs font-bold uppercase mb-2">Solution</h4>
                        <p class="text-white/70 text-sm" id="pf-solution"></p>
                    </div>
                    <div class="pf-section-item" id="pf-result-wrap">
                        <h4 class="text-brand text-xs font-bold uppercase mb-2">Result</h4>
                        <p class="text-white/70 text-sm" id="pf-result"></p>
                    </div>
                </div>
                <div class="mt-6 flex flex-wrap gap-2" id="pf-tags"></div>
            </div>
        </div>
    </div>

    <div class="contact-suite">
        <div id="chatbot-window" class="chatbot-window">
            <div class="chat-header">
                <div class="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-black font-bold text-xs tracking-tighter">THE3</div>
                <div>
                    <strong class="block text-sm text-white">THE3 사장님 도우미</strong>
                    <span class="text-xs text-white/50">답변이 빨라요!</span>
                </div>
                <button id="close-chat" class="close-chat">&times;</button>
            </div>
            <div id="chat-messages" class="chat-messages">
                <div class="message bot-message">안녕하세요 사장님! 오늘 장사는 어떠셨나요?<br/>THE3 STUDIO가 사장님의 성장을 돕겠습니다. 궁금하신 내용을 질문해 주세요!</div>
            </div>
            <div id="chat-input-area" class="chat-input-area" style="display: none;">
                <input type="text" id="chat-input" placeholder="성함을 입력해 주세요...">
                <button id="send-chat">전송</button>
            </div>
            <div id="chat-options" class="chat-options">
                <button onclick="handleChatOption('가격')">💰 가격 궁금해요</button>
                <button onclick="handleChatOption('기간')">⏱ 얼마나 걸리나요?</button>
                <button onclick="handleChatOption('효과')">📈 진짜 효과 있나요?</button>
                <button onclick="handleChatOption('상담')">💬 예약 상담하기</button>
            </div>
        </div>
        <a href="javascript:void(0)" id="chat-toggle" class="floating-contact">
            <span class="pulse-ring"></span>
            <i class="fa-solid fa-comment-dots text-2xl"></i>
        </a>
    </div>

"""

    # Injecting the JS hooks
    full_html = new_html + script_block
    
    # Simple CSS fixes inside the injected JS
    full_html = full_html.replace('class="ext-card stagger-item"', 'class="ext-card stagger-item bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden hover:border-brand transition-all block group"')
    full_html = full_html.replace('class="expert-card stagger-item"', 'class="expert-card stagger-item bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden p-6 text-center hover:border-brand transition-all"')
    full_html = full_html.replace('class="j-card fade-in-section is-visible"', 'class="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 hover:border-brand transition-all stagger-item block is-visible"')
    full_html = full_html.replace('background:rgba(255,255,255,0.03);', ' ')
    full_html = full_html.replace('class="client-logo-item"', 'class="client-logo-item flex items-center shrink-0 min-w-max"')
    full_html = full_html.replace('class="j-logo"', 'class="text-brand font-bold uppercase mb-2 flex justify-between"')
    full_html = full_html.replace('<h4>', '<h4 class="text-xl font-bold mb-4">')
    full_html = full_html.replace('<p>', '<p class="text-white/60">')
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(full_html)
    
if __name__ == "__main__":
    rebuild_site()
