/* ============================================================
   HARBIE v3 — Sahneler: karakter bölümü üretimi + video lazy-load
   ============================================================ */
(function () {
  'use strict';

  var AUTOPLAY_MOBILE = false; // Faz 6 / toplantı: tek bayrakla açılır
  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width:760px)').matches;

  /* ---------- Karakter bölümlerini veriden bas ---------- */
  var host = document.querySelector('[data-scenes]');
  if (host && window.HARBIE_CHARS) {
    var html = '';
    window.HARBIE_CHARS.forEach(function (c) {
      var edge = c.kenar === 'sag' ? 'scene--sag' : 'scene--sol';
      html +=
        '<section class="scene ' + edge + ' reveal" style="--k:var(--' + c.renk.replace(/^--/, '') + ')">' +
          '<div class="scene-stage">' +
            '<video class="scene-video" poster="assets/gen/' + c.slug + '-diorama.png" ' +
                   'muted playsinline preload="none" loop ' +
                   'aria-label="' + c.ad + ' sahnesi" ' +
                   'data-scene data-src="assets/v3/video/' + c.slug + '.mp4"></video>' +
            '<div class="scene-tap"><span></span></div>' +
          '</div>' +
          '<div class="scene-copy">' +
            '<p class="scene-kicker">' + c.bolumNo + ' — ' + c.unvan + '</p>' +
            '<h3 class="scene-motto">' + c.motto + '</h3>' +
            '<p class="scene-desc">' + c.aciklama + '</p>' +
            '<a class="btn scene-cta" href="karakter-' + c.slug + '.html">Hikâyesini oku</a>' +
          '</div>' +
        '</section>';
    });
    host.innerHTML = html;
  }

  /* ---------- Video lazy-load + görününce oynat ---------- */
  var vids = document.querySelectorAll('video[data-scene]');
  if (!vids.length) return;

  function load(v) { if (!v.src && v.dataset.src) { v.src = v.dataset.src; } }
  function canAutoplay() { return !rm && (!isMobile || AUTOPLAY_MOBILE); }

  // Autoplay yapılmayacaksa sahneye "dokun-oynat" işareti koy
  if (!canAutoplay()) {
    vids.forEach(function (v) {
      var scene = v.closest('.scene, .hero-media');
      if (scene) scene.classList.add('tap-mode');
    });
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (canAutoplay()) {
            load(v);
            var p = v.play();
            if (p && p.catch) p.catch(function () {});
          }
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { threshold: 0.55 });
    vids.forEach(function (v) { io.observe(v); });
  }

  // Tıkla/dokun → oynat-durdur (autoplay kapalıyken de çalışır)
  vids.forEach(function (v) {
    v.addEventListener('click', function () {
      load(v);
      var scene = v.closest('.scene, .hero-media');
      if (v.paused) {
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
        if (scene) scene.classList.remove('tap-mode');
      } else {
        v.pause();
      }
    });
  });
})();
