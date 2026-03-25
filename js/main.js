document.addEventListener("DOMContentLoaded", () => {

  // ── 넵바 스크롤 ─────────────────────────────────────────────
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => navbar.classList.toggle("scrolled", window.scrollY > 50));

  // ── 앵커 스크롤 ──────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", function (e) {
      const t = document.querySelector(this.getAttribute("href"));
      if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" }); }
    });
  });

  // ── 페이드업 ─────────────────────────────────────────────────
  const fo = new IntersectionObserver((es, obs) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll(".fade-up").forEach(el => fo.observe(el));

  // ============================================================
  //  Hero — 검정 배경 + 3색 잉크 번짐 (파랑/보라/흰)
  // ============================================================
  const inkCanvas = document.getElementById('ink-canvas');
  if (inkCanvas) {
    const ctx = inkCanvas.getContext('2d');
    let W = 0, H = 0;

    const resize = () => { W = inkCanvas.width = window.innerWidth; H = inkCanvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    // ── 마우스/터치 ────────────────────────────────────────────
    let mx = 0.5, my = 0.5;
    window.addEventListener('mousemove', e => { mx = e.clientX / window.innerWidth; my = e.clientY / window.innerHeight; });
    window.addEventListener('touchmove', e => {
      if (e.touches[0]) { mx = e.touches[0].clientX / window.innerWidth; my = e.touches[0].clientY / window.innerHeight; }
    }, { passive: true });

    // ── 잉크 덩어리 클래스 ─────────────────────────────────────
    // 각 잉크 덩어리 = 중심 본체 + 가장자리 위성 블롭(물감 번짐 질감)
    class Ink {
      constructor(bx, by, rgb, ph) {
        this.bx = bx; this.by = by;   // 기준 위치 (0~1)
        this.rgb = rgb;
        this.ph = ph;
        // 가장자리 위성: 잉크가 번지며 생기는 불규칙한 돌기들
        this.sats = Array.from({ length: 28 }, (_, i) => ({
          a: (i / 28) * Math.PI * 2 + Math.random() * 0.4,
          d: 0.55 + Math.random() * 0.55,   // 중심에서 거리 비율
          sz: 0.18 + Math.random() * 0.32,   // 크기 비율
          sp: 0.06 + Math.random() * 0.10,   // 개별 애니 속도
          ph: Math.random() * Math.PI * 2,
        }));
      }

      draw(t) {
        const [r, g, b] = this.rgb;
        // 마우스에 살짝 반응해 위치 미세 이동
        const cx = (this.bx + (mx - 0.5) * 0.04) * W;
        const cy = (this.by + (my - 0.5) * 0.03) * H;
        // 화면 크기에 비례한 기본 반경 — 3개가 겹쳐서 전체를 커버
        const R = Math.min(W, H) * 0.48;

        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        // 1) 본체: 부드러운 방사형 그라디언트
        const g0 = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
        g0.addColorStop(0, `rgba(${r},${g},${b},0.80)`);
        g0.addColorStop(0.35, `rgba(${r},${g},${b},0.55)`);
        g0.addColorStop(0.68, `rgba(${r},${g},${b},0.20)`);
        g0.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, R * 1.05, 0, Math.PI * 2);
        ctx.fillStyle = g0;
        ctx.fill();

        // 2) 위성 블롭들: 가장자리 불규칙 번짐 (잉크 텍스처)
        this.sats.forEach(s => {
          const ang = s.a + t * s.sp;
          const dd = s.d * R * (0.85 + 0.22 * Math.sin(ang * 1.4 + s.ph));
          const px = cx + Math.cos(ang) * dd;
          const py = cy + Math.sin(ang) * dd;
          const pr = R * s.sz * (0.75 + 0.25 * Math.sin(t * 0.4 + s.ph));

          const gs = ctx.createRadialGradient(px, py, 0, px, py, pr);
          gs.addColorStop(0, `rgba(${r},${g},${b},0.65)`);
          gs.addColorStop(0.5, `rgba(${r},${g},${b},0.30)`);
          gs.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(px, py, pr, 0, Math.PI * 2);
          ctx.fillStyle = gs;
          ctx.fill();
        });

        ctx.restore();
      }
    }

    // ── 3개 잉크 덩어리 초기화 (삼각 배치) ───────────────────────
    const inks = [
      new Ink(0.18, 0.32, [0, 102, 255], 0.0),   /* Electric Blue */
      new Ink(0.82, 0.28, [71, 145, 255], 2.1),  /* Light Cyan-Blue */
      new Ink(0.50, 0.75, [255, 255, 255], 4.2), /* Pure White */
    ];

    // ── 3D 틸트 (히어로 텍스트) ────────────────────────────────
    let tiltX = 0, tiltY = 0, tgtX = 0, tgtY = 0;
    const heroEl = document.querySelector('.hero');
    const hc = document.querySelector('.hero-content');

    if (heroEl) {
      heroEl.style.perspective = '1200px';
      if (hc) {
        hc.style.transition = 'transform 0.15s ease-out';
        hc.style.transformStyle = 'preserve-3d';
        [['hero-title', '60px'], ['hero-subtitle', '38px'], ['hero-desc', '22px'], ['hero-buttons', '48px']].forEach(([cls, z]) => {
          const el = hc.querySelector('.' + cls); if (el) el.style.transform = `translateZ(${z})`;
        });
      }
      heroEl.addEventListener('mousemove', e => {
        const r = heroEl.getBoundingClientRect();
        tgtY = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 14;
        tgtX = -((e.clientY - r.top - r.height / 2) / (r.height / 2)) * 9;
      });
      heroEl.addEventListener('mouseleave', () => { tgtX = 0; tgtY = 0; });
      heroEl.addEventListener('touchmove', e => {
        if (!e.touches[0]) return;
        const r = heroEl.getBoundingClientRect();
        tgtY = ((e.touches[0].clientX - r.left - r.width / 2) / (r.width / 2)) * 9;
        tgtX = -((e.touches[0].clientY - r.top - r.height / 2) / (r.height / 2)) * 6;
      }, { passive: true });
      heroEl.addEventListener('touchend', () => { tgtX = 0; tgtY = 0; });
    }

    // ── 렌더 루프 ────────────────────────────────────────────
    function render(ts) {
      const t = ts * 0.001;

      // 틸트 lerp
      tiltX += (tgtX - tiltX) * 0.08;
      tiltY += (tgtY - tiltY) * 0.08;
      if (hc && hc.classList.contains('visible')) {
        hc.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }

      // 다크 프리미엄 배경
      ctx.fillStyle = '#0D0D0D';
      ctx.fillRect(0, 0, W, H);

      // 3색 잉크 그리기
      inks.forEach(ink => ink.draw(t));

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  // ============================================================
  //  서비스 카드 시퀀스 애니메이션 (기존)
  // ============================================================
  const PLAY_MS = 10000, HOLD_MS = 4500, LOOP_MS = 14500;
  const canvasMedias = document.querySelectorAll('.canvas-media');
  const getWord = f => ({ 'Business Consulting': 'THE', 'Branding Design': '3', 'VIDEO PRODUCTION': 'STUDIO' }[f] || '');

  const mediaStates = Array.from(canvasMedias).map(media => {
    const canvas = media.querySelector('canvas');
    return {
      media, canvas, ctx: canvas ? canvas.getContext('2d') : null,
      folder: media.getAttribute('data-folder'), totalFrames: parseInt(media.getAttribute('data-frames'), 10),
      isVisible: false, lastDrawnFrame: -1, cachedImg: null
    };
  });

  const animLoop = () => {
    const tl = Date.now() % LOOP_MS;
    const progress = tl < PLAY_MS ? tl / PLAY_MS : 1.0;
    const isHolding = tl >= PLAY_MS;
    const holdP = isHolding ? (tl - PLAY_MS) / HOLD_MS : 0;

    mediaStates.forEach(state => {
      if (!state.isVisible || !state.ctx) return;
      const cW = state.media.clientWidth, cH = state.media.clientHeight;
      if (cW > 0 && cH > 0 && (state.canvas.width !== cW || state.canvas.height !== cH)) {
        state.canvas.width = cW; state.canvas.height = cH;
        state.lastDrawnFrame = -1; state.cachedImg = null;
      }
      let cf = Math.min(Math.max(Math.floor(progress * state.totalFrames) + 1, 1), state.totalFrames);

      const drawFrame = img => {
        state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
        state.ctx.drawImage(img, 0, 0, state.canvas.width, state.canvas.height);
        if (isHolding) {
          state.ctx.fillStyle = `rgba(255, 252, 247, ${Math.min(holdP * 6, 1)})`;
          state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
          const ta = Math.min(Math.max((holdP - 0.15) * 5, 0), 1);
          if (ta > 0) {
            const word = getWord(state.folder);
            state.ctx.shadowColor = `rgba(255,255,255,${ta * 0.4})`; state.ctx.shadowBlur = 40;
            let fs = Math.round(Math.min(state.canvas.width * 0.42, state.canvas.height * 0.52) * (word === '3' ? 1.25 : 1));
            state.ctx.font = `900 ${fs}px Outfit,Pretendard,sans-serif`;
            const mw = state.ctx.measureText(word).width;
            if (mw > state.canvas.width * 0.88) fs = Math.floor(fs * (state.canvas.width * 0.88 / mw));
            state.ctx.font = `900 ${fs}px Outfit,Pretendard,sans-serif`;
            state.ctx.fillStyle = `rgba(44, 36, 32, ${ta})`; state.ctx.textAlign = 'center'; state.ctx.textBaseline = 'middle';
            state.ctx.fillText(word, state.canvas.width / 2, state.canvas.height / 2 + (1 - ta) * 40);
            state.ctx.shadowBlur = 0;
          }
        }
      };

      if (state.lastDrawnFrame === cf && state.cachedImg) { drawFrame(state.cachedImg); return; }
      state.lastDrawnFrame = cf;
      const img = new Image();
      img.src = encodeURI(`./새 폴더/${state.folder}/1 (${cf}).jpg`);
      img.onload = () => {
        const lt = Date.now() % LOOP_MS, cp = lt < PLAY_MS ? lt / PLAY_MS : 1;
        const ef = Math.floor(cp * state.totalFrames) + 1;
        if (Math.abs(ef - cf) > 10 && Math.abs(ef - cf) < state.totalFrames - 10) return;
        state.cachedImg = img; drawFrame(img);
      };
    });
    requestAnimationFrame(animLoop);
  };
  requestAnimationFrame(animLoop);

  const seqObs = new IntersectionObserver(entries => {
    entries.forEach(e => { const s = mediaStates.find(s => s.media === e.target); if (s) s.isVisible = e.isIntersecting; });
  }, { threshold: 0.1 });
  canvasMedias.forEach(m => seqObs.observe(m));

});
