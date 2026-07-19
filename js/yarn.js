/* ============================================================
   HARBIE v3 — İlmek katmanı
   Bölüm ayırıcılarını gerçek "dikiş"e çevirir ve bölümlere
   ince iplik/yumak süsleri ekler.
   KURAL (UI-UX Pro Max): dekoratif öğede sonsuz döngü YOK —
   hareket yalnızca scroll'a bağlı. Motor durursa iplik
   tam çizili ve görünür kalır (asla kaybolmaz).
   ============================================================ */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  function el(name, attrs) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  /* ---------- 1) Ayırıcılar → el dikişi ---------- */
  document.querySelectorAll('.knit-divider').forEach(function (d) {
    d.innerHTML = '';
    d.classList.add('stitch-divider');
    // Çizim animasyonu yalnızca IO + hareket izni varsa
    if ('IntersectionObserver' in window &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      d.classList.add('stitch-draw', 'reveal');
    }

    var svg = el('svg', {
      viewBox: '0 0 1200 24', preserveAspectRatio: 'none',
      'aria-hidden': 'true', focusable: 'false'
    });
    // Hafif dalgalı bir dikiş hattı
    var path = el('path', {
      d: 'M0 12 C 100 4, 200 20, 300 12 S 500 4, 600 12 S 800 20, 900 12 S 1100 4, 1200 12',
      fill: 'none', stroke: 'currentColor', 'stroke-width': '2.5',
      'stroke-linecap': 'round', 'stroke-dasharray': '14 11'
    });
    svg.appendChild(path);
    // İki ucunda küçük yumak düğümü
    svg.appendChild(el('circle', { cx: 4, cy: 12, r: 3.5, fill: 'currentColor', opacity: '.85' }));
    svg.appendChild(el('circle', { cx: 1196, cy: 12, r: 3.5, fill: 'currentColor', opacity: '.85' }));
    d.appendChild(svg);
  });

  /* Güvenlik ağı: gözlemci herhangi bir sebeple tetiklenmezse
     3sn sonra dikişleri zorla göster — asla gizli kalmasın. */
  setTimeout(function () {
    document.querySelectorAll('.stitch-draw:not(.in)').forEach(function (d) {
      d.classList.add('in');
    });
  }, 3000);

  /* ---------- 2) Bölüm süsleri: iplik yayı + yumak ---------- */
  var YARN = {
    arc: function (flip) {
      var svg = el('svg', { viewBox: '0 0 220 180', 'aria-hidden': 'true', focusable: 'false' });
      var g = el('g', flip ? { transform: 'translate(220,0) scale(-1,1)' } : {});
      g.appendChild(el('path', {
        d: 'M8 172 C 8 92, 60 34, 140 26',
        fill: 'none', stroke: 'currentColor', 'stroke-width': '2',
        'stroke-linecap': 'round', 'stroke-dasharray': '12 9', opacity: '.55'
      }));
      // yumak
      g.appendChild(el('circle', { cx: 160, cy: 24, r: 20, fill: 'currentColor', opacity: '.14' }));
      g.appendChild(el('circle', { cx: 160, cy: 24, r: 20, fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6', opacity: '.5' }));
      g.appendChild(el('path', {
        d: 'M144 16 C 154 22, 166 26, 176 32 M146 32 C 156 26, 166 20, 174 15',
        fill: 'none', stroke: 'currentColor', 'stroke-width': '1.4', opacity: '.5', 'stroke-linecap': 'round'
      }));
      svg.appendChild(g);
      return svg;
    }
  };

  document.querySelectorAll('[data-yarn]').forEach(function (host) {
    var deco = document.createElement('div');
    deco.className = 'yarn-deco yarn-deco--' + (host.dataset.yarn || 'sol');
    deco.setAttribute('aria-hidden', 'true');
    deco.appendChild(YARN.arc(host.dataset.yarn === 'sag'));
    host.appendChild(deco);
  });

  /* ---------- 3) Scroll'a bağlı hafif paralaks (döngü yok) ---------- */
  var decos = document.querySelectorAll('.yarn-deco');
  if (!decos.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.gsap || !window.ScrollTrigger) return;   // yoksa sabit dururlar, sorun değil

  decos.forEach(function (d, i) {
    gsap.fromTo(d, { y: 18 }, {
      y: -18, ease: 'none',
      scrollTrigger: {
        trigger: d.parentElement,
        start: 'top bottom', end: 'bottom top', scrub: true
      }
    });
  });
})();
