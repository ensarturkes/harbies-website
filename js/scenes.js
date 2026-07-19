/* ============================================================
   HARBIE v3 — Karakter vitrini (scroll ile tek tek değişen)
   Sol: kalıcı karakter seçici · Sağ: video + yanında açıklama
   Sticky tabanlı — GSAP olmadan da çalışır. Mobilde dikey yığılır.
   ============================================================ */
(function () {
  'use strict';

  var AUTOPLAY_MOBILE = false;
  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mqMobile = window.matchMedia('(max-width:860px)');

  var host = document.querySelector('[data-scenes]');
  var chars = window.HARBIE_CHARS || [];

  /* ---------- Vitrini bas ---------- */
  if (host && chars.length) {
    var rail = '', panels = '';

    chars.forEach(function (c, i) {
      var k = 'var(' + c.renk + ')';
      rail +=
        '<button class="rail-item' + (i === 0 ? ' is-active' : '') + '" type="button" ' +
                'data-go="' + i + '" style="--k:' + k + '" ' +
                'aria-label="' + c.ad + '" aria-current="' + (i === 0 ? 'true' : 'false') + '">' +
          '<span class="rail-no">' + c.bolumNo + '</span>' +
          '<span class="rail-name">' + c.ad.replace('Harbie ', '') + '</span>' +
          '<span class="rail-unvan">' + c.unvan + '</span>' +
        '</button>';

      panels +=
        '<article class="char-panel' + (i === 0 ? ' is-active' : '') + '" data-panel="' + i + '" ' +
                 'style="--k:' + k + '" aria-hidden="' + (i === 0 ? 'false' : 'true') + '">' +
          '<div class="scene-stage">' +
            '<video class="scene-video" poster="assets/v3/img/' + c.slug + '-b.jpg" ' +
                   'muted playsinline preload="none" loop ' +
                   'aria-label="' + c.ad + ' sahnesi" ' +
                   'data-scene data-src="assets/v3/video/' + c.slug + '.mp4"></video>' +
            '<div class="scene-tap"><span></span></div>' +
          '</div>' +
          '<div class="panel-copy">' +
            '<p class="scene-kicker">' + c.bolumNo + ' — ' + c.unvan + '</p>' +
            '<h3 class="scene-motto">' + c.motto + '</h3>' +
            '<p class="scene-desc">' + c.aciklama + '</p>' +
            '<a class="btn scene-cta" href="karakter-' + c.slug + '.html">Hikâyesini oku</a>' +
          '</div>' +
        '</article>';
    });

    host.innerHTML =
      '<div class="showcase" data-showcase style="--count:' + chars.length + '">' +
        '<div class="showcase-pin">' +
          '<div class="showcase-inner">' +
            '<nav class="showcase-rail" aria-label="Karakter seçimi">' + rail +
              '<span class="rail-track"><span class="rail-thumb" data-rail-thumb></span></span>' +
            '</nav>' +
            '<div class="panel-wrap">' + panels + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  var showcase = document.querySelector('[data-showcase]');
  var railItems = showcase ? showcase.querySelectorAll('.rail-item') : [];
  var charPanels = showcase ? showcase.querySelectorAll('.char-panel') : [];
  var railThumb = showcase ? showcase.querySelector('[data-rail-thumb]') : null;
  var current = -1;

  function canAutoplay() { return !rm && (!mqMobile.matches || AUTOPLAY_MOBILE); }
  function load(v) { if (!v.src && v.dataset.src) v.src = v.dataset.src; }

  function playPanel(i) {
    charPanels.forEach(function (p, j) {
      var v = p.querySelector('video');
      if (!v) return;
      if (j === i && canAutoplay()) {
        load(v);
        var pr = v.play();
        if (pr && pr.catch) pr.catch(function () {});
      } else if (!v.paused) {
        v.pause();
      }
    });
  }

  function setActive(i) {
    if (i === current || i < 0 || i >= charPanels.length) return;
    current = i;
    railItems.forEach(function (b, j) {
      var on = j === i;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-current', on ? 'true' : 'false');
    });
    charPanels.forEach(function (p, j) {
      var on = j === i;
      p.classList.toggle('is-active', on);
      p.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    if (railThumb) {
      railThumb.style.transform = 'translateY(' + (i * 100) + '%)';
    }
    // Aktif karakter rengini sayfaya yay
    var k = charPanels[i].style.getPropertyValue('--k');
    if (k) document.documentElement.style.setProperty('--active-accent', k.trim());
    playPanel(i);
  }

  /* ---------- Scroll → aktif karakter ---------- */
  function onScroll() {
    if (!showcase) return;
    if (mqMobile.matches) return; // mobilde panel bazlı IO devrede
    var pin = showcase.querySelector('.showcase-pin');
    var travel = showcase.offsetHeight - pin.offsetHeight;
    if (travel <= 0) return;
    var scrolled = -showcase.getBoundingClientRect().top;
    var p = Math.max(0, Math.min(1, scrolled / travel));
    // p'yi n dilime böl; son dilimde son karakter kalsın
    var idx = Math.min(charPanels.length - 1, Math.floor(p * charPanels.length));
    setActive(idx);
  }

  /* ---------- Rail tıklama → o karaktere kaydır ---------- */
  railItems.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var i = parseInt(btn.dataset.go, 10);
      if (mqMobile.matches) {
        charPanels[i].scrollIntoView({ behavior: rm ? 'auto' : 'smooth', block: 'start' });
        setActive(i);
        return;
      }
      var pin = showcase.querySelector('.showcase-pin');
      var travel = showcase.offsetHeight - pin.offsetHeight;
      var slice = travel / charPanels.length;
      var top = showcase.offsetTop + slice * i + slice * 0.5;
      window.scrollTo({ top: top, behavior: rm ? 'auto' : 'smooth' });
      setActive(i);
    });
  });

  if (showcase) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    setActive(0);
    onScroll();
  }

  /* ---------- Mobil: her panel görününce aktifleşsin ---------- */
  if (showcase && 'IntersectionObserver' in window) {
    var pio = new IntersectionObserver(function (entries) {
      if (!mqMobile.matches) return;
      entries.forEach(function (e) {
        if (e.isIntersecting) setActive(parseInt(e.target.dataset.panel, 10));
      });
    }, { threshold: 0.5 });
    charPanels.forEach(function (p) { pio.observe(p); });
  }

  /* ---------- Diğer videolar (hero, karakter sayfası) ---------- */
  var others = document.querySelectorAll('video[data-scene]:not(.char-panel video)');
  if (others.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (v.closest('.char-panel')) return;
        if (e.isIntersecting) {
          if (canAutoplay()) { load(v); var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
        } else if (!v.paused) { v.pause(); }
      });
    }, { threshold: 0.55 });
    others.forEach(function (v) { io.observe(v); });
  }

  /* ---------- Dokun-oynat (autoplay kapalıyken) ---------- */
  if (!canAutoplay()) {
    document.querySelectorAll('.scene, .hero-media, .char-panel').forEach(function (s) {
      s.classList.add('tap-mode');
    });
  }
  document.querySelectorAll('video[data-scene]').forEach(function (v) {
    v.addEventListener('click', function () {
      load(v);
      var box = v.closest('.scene, .hero-media, .char-panel');
      if (v.paused) {
        var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
        if (box) box.classList.remove('tap-mode');
      } else { v.pause(); }
    });
  });
})();
