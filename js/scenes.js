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

  /* Varlık yolları — v2 kareler: karakter sağda, sol taraf metne boş,
     videolarda sağdan giriş animasyonu. */
  var IMG = 'assets/v3/img2/web/', IMGEXT = '.jpg';
  var VID = 'assets/v3/video2/';

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
          '<video class="panel-video" poster="' + IMG + c.slug + '-b' + IMGEXT + '" ' +
                 'muted playsinline preload="none" loop ' +
                 'aria-label="' + c.ad + ' sahnesi" ' +
                 'data-scene data-src="' + VID + c.slug + '.mp4"></video>' +
        '</article>';
    });

    host.innerHTML =
      '<div class="showcase" data-showcase style="--count:' + chars.length + '">' +
        '<div class="showcase-pin">' +
          '<div class="showcase-stage">' + panels + '</div>' +
          '<div class="showcase-scrim" aria-hidden="true"></div>' +
          '<div class="showcase-tap"><span></span></div>' +
          '<div class="showcase-ui">' +
            '<nav class="showcase-rail" aria-label="Karakter seçimi">' +
              '<span class="rail-track"><span class="rail-thumb" data-rail-thumb></span></span>' +
              rail +
            '</nav>' +
            '<div class="panel-copy" data-copy>' +
              '<p class="panel-kicker" data-copy-kicker></p>' +
              '<h3 class="panel-motto" data-copy-motto></h3>' +
              '<p class="panel-desc" data-copy-desc></p>' +
              '<a class="btn panel-cta" data-copy-cta href="#">Hikâyesini oku</a>' +
            '</div>' +
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

  var copyBox = showcase ? showcase.querySelector('[data-copy]') : null;
  var elKicker = showcase ? showcase.querySelector('[data-copy-kicker]') : null;
  var elMotto = showcase ? showcase.querySelector('[data-copy-motto]') : null;
  var elDesc = showcase ? showcase.querySelector('[data-copy-desc]') : null;
  var elCta = showcase ? showcase.querySelector('[data-copy-cta]') : null;

  function paintCopy(i) {
    var c = chars[i];
    if (!c || !copyBox) return;
    function fill() {
      elKicker.textContent = c.bolumNo + ' — ' + c.unvan;
      elMotto.textContent = c.motto;
      elDesc.textContent = c.aciklama;
      elCta.setAttribute('href', 'karakter-' + c.slug + '.html');
      copyBox.style.setProperty('--k', c.renk ? 'var(' + c.renk + ')' : 'var(--accent)');
      copyBox.classList.remove('is-out');
    }
    if (rm || current < 0) { fill(); return; }
    copyBox.classList.add('is-out');
    clearTimeout(copyBox._t);
    copyBox._t = setTimeout(fill, 220);
  }

  function setActive(i) {
    if (i === current || i < 0 || i >= charPanels.length) return;
    paintCopy(i);
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
    var k = charPanels[i].style.getPropertyValue('--k');
    if (railThumb) {
      railThumb.style.transform = 'translateY(' + (i * 100) + '%)';
      if (k) railThumb.style.setProperty('--k-active', k.trim());
    }
    // Aktif karakter rengini sayfaya yay
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

  /* Mobilde paneller üst üste duruyor (masaüstüyle aynı) — aktif karakteri
     yalnızca üstteki chip'ler belirler; scroll ile değişmez. */

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
    document.querySelectorAll('.scene, .hero-media, .showcase-pin').forEach(function (s) {
      s.classList.add('tap-mode');
    });
  }
  document.querySelectorAll('video[data-scene]').forEach(function (v) {
    v.addEventListener('click', function () {
      load(v);
      var box = v.closest('.scene, .hero-media, .showcase-pin');
      if (v.paused) {
        var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
        if (box) box.classList.remove('tap-mode');
      } else { v.pause(); }
    });
  });
  // Tam ekran vitrinde videoya tıklama alanı perdenin altında kalıyor —
  // rozete/perdeye tıklayınca da aktif video oynasın/dursun.
  var pinBox = document.querySelector('.showcase-pin');
  if (pinBox) {
    pinBox.addEventListener('click', function (e) {
      if (e.target.closest('.rail-item') || e.target.closest('.panel-copy')) return;
      var act = document.querySelector('.char-panel.is-active video');
      if (!act) return;
      load(act);
      if (act.paused) {
        var pr = act.play(); if (pr && pr.catch) pr.catch(function () {});
        pinBox.classList.remove('tap-mode');
      } else { act.pause(); }
    });
  }
})();
