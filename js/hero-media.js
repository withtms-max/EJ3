// Wait for the saved settings before assigning a source: no old-video flash or download.
(() => {
  const mobile = window.matchMedia('(max-width: 768px)');
  const desktopVideo = document.getElementById('h-video-desktop');
  const mobileVideo = document.getElementById('h-video-mobile');
  let settings;
  let active;
  let inView = true;

  function playActive() {
    if (!active || !inView || document.hidden) return;
    active.play().catch(() => {}); // Autoplay may require a user gesture.
  }

  function selectVideo() {
    if (!settings) return;
    const next = mobile.matches ? mobileVideo : desktopVideo;
    if (!next) return;
    const custom = mobile.matches
      ? settings.hero_video_mobile || settings.video_url_mobile
      : settings.hero_video_desktop || settings.video_url_pc;
    const source = typeof custom === 'string' && custom.trim()
      ? custom.trim()
      : mobile.matches ? 'hero-mobile.mp4?v=2' : 'hero-desktop.webm?v=1.5';

    if (active && active !== next) {
      active.pause();
      active.removeAttribute('src');
      active.preload = 'none';
      active.load(); // Cancel the hidden video's pending transfer.
    }
    active = next;
    if (next.getAttribute('src') !== source) {
      next.muted = true;
      next.preload = 'metadata';
      next.src = source;
      next.load();
    }
    playActive();
  }

  window.heroMedia = {
    configure(value = {}) {
      settings = value;
      selectVideo();
    }
  };
  mobile.addEventListener('change', selectVideo);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) active?.pause();
    else playActive();
  });
  document.addEventListener('pointerdown', playActive, { once: true });
  const hero = desktopVideo?.closest('section');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) playActive();
      else active?.pause();
    }).observe(hero);
  }

  // Page reveal must not wait for videos, images, or Firebase to finish downloading.
  document.body.classList.remove('loading');
  document.body.classList.add('loaded');
})();
