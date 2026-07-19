/* ============================================================
   HARBIE v3 — Hareket katmanı (GSAP + ScrollTrigger)
   Progressive enhancement. İKİ TEMEL KURAL:
   1) reduced-motion açıksa ya da GSAP yoksa → hiçbir şey yapma.
   2) Hiçbir efekt içeriği KALICI gizlemez. Giriş fade'lerini
      shell.js + CSS (IntersectionObserver, rAF'ye bağlı değil)
      yönetir; motion.js yalnızca gizlemeyen zenginleştirmeler
      (transform paralaks, immediateRender:false girişler) ekler.
   ============================================================ */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  /* Hero giriş animasyonu artık CSS'te (base/pages.css @keyframes heroRise):
     fill-mode:both ile bitiş durumu kalıcı — ticker dursa bile başlık görünür. */

  /* ---------- Hero medya: hafif paralaks (yalnızca transform) ---------- */
  var heroMedia = document.querySelector('.hero-media');
  if (heroMedia) {
    gsap.to(heroMedia, {
      yPercent: 10, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* ---------- Sahne kartı: hafif paralaks (transform; fail olursa sabit durur) ---------- */
  document.querySelectorAll('.scene-stage').forEach(function (stage) {
    var scene = stage.closest('.scene');
    if (!scene) return;
    gsap.fromTo(stage, { y: 24 }, {
      y: -24, ease: 'none',
      scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* ---------- Aktif karakter rengini sayfaya yay (additive; içerik gizlemez) ---------- */
  document.querySelectorAll('.scene[style*="--k"]').forEach(function (scene) {
    var k = scene.style.getPropertyValue('--k');
    if (!k) return;
    ScrollTrigger.create({
      trigger: scene, start: 'top center', end: 'bottom center',
      onEnter: function () { document.documentElement.style.setProperty('--active-accent', k.trim()); },
      onEnterBack: function () { document.documentElement.style.setProperty('--active-accent', k.trim()); }
    });
  });

  /* ---------- Örgü ayırıcı: çizilerek beliriş (immediateRender:false → fail olursa görünür) ---------- */
  document.querySelectorAll('.knit-divider').forEach(function (d) {
    gsap.from(d, {
      scaleX: 0, transformOrigin: 'left center', duration: 1, ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: { trigger: d, start: 'top 90%' }
    });
  });

  /* Sayfa/görsel yüklenince pozisyonları tazele (font/görsel kayması). */
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
})();
