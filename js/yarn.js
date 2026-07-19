/* ============================================================
   HARBIE v3 — İlmek katmanı
   Ayırıcılar gerçek ZİNCİR İLMEK (iç içe geçmiş örgü halkaları),
   süsler bükümlü iplik + sarılı yumak olarak çizilir.
   KURAL (UI-UX Pro Max): dekoratif öğede sonsuz döngü YOK —
   hareket yalnızca scroll'a bağlı. Motor durursa iplik tam
   çizili ve görünür kalır.
   ============================================================ */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  function el(name, attrs) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  /* ---------- Sarılı yumak ---------- */
  function yarnBall(cx, cy, r) {
    var g = el('g', {});
    g.appendChild(el('circle', { cx: cx, cy: cy, r: r, fill: 'currentColor', opacity: '.13' }));
    g.appendChild(el('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: 'currentColor',
      'stroke-width': '2.2', opacity: '.6' }));
    // sarım izleri
    [[-0.62, 0.5], [-0.2, 0.85], [0.25, 0.8], [0.6, 0.45]].forEach(function (p) {
      g.appendChild(el('path', {
        d: 'M' + (cx + p[0] * r) + ' ' + (cy - r * p[1]) +
           ' Q ' + (cx + p[0] * r * 0.2) + ' ' + cy + ', ' +
           (cx + p[0] * r) + ' ' + (cy + r * p[1]),
        fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6',
        'stroke-linecap': 'round', opacity: '.45'
      }));
    });
    return g;
  }

  /* ---------- 1) Ayırıcılar: zincir ilmek deseni CSS'te.
     Burada yalnızca çizim animasyonu sınıfı ekleniyor. ---------- */
  document.querySelectorAll('.knit-divider').forEach(function (d) {
    if ('IntersectionObserver' in window &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      d.classList.add('stitch-draw', 'reveal');
    }
  });

  /* Güvenlik ağı: gözlemci tetiklenmezse 3sn sonra zorla göster. */
  setTimeout(function () {
    document.querySelectorAll('.stitch-draw:not(.in)').forEach(function (d) {
      d.classList.add('in');
    });
  }, 3000);

  /* ---------- 2) Bölüm süsü: bükümlü iplik + yumak ---------- */
  function yarnStrand(flip) {
    var svg = el('svg', { viewBox: '0 0 220 190', 'aria-hidden': 'true', focusable: 'false' });
    var g = el('g', flip ? { transform: 'translate(220,0) scale(-1,1)' } : {});
    var d1 = 'M10 184 C 6 110, 48 46, 132 34';
    // kalın gövde
    g.appendChild(el('path', { d: d1, fill: 'none', stroke: 'currentColor',
      'stroke-width': '4.4', 'stroke-linecap': 'round', opacity: '.5' }));
    // büküm izi (ipliğin katları)
    g.appendChild(el('path', { d: d1, fill: 'none', stroke: 'var(--bg)',
      'stroke-width': '1.5', 'stroke-linecap': 'round',
      'stroke-dasharray': '3 9', opacity: '.85' }));
    g.appendChild(yarnBall(160, 30, 22));
    svg.appendChild(g);
    return svg;
  }

  document.querySelectorAll('[data-yarn]').forEach(function (host) {
    var deco = document.createElement('div');
    deco.className = 'yarn-deco yarn-deco--' + (host.dataset.yarn || 'sol');
    deco.setAttribute('aria-hidden', 'true');
    deco.appendChild(yarnStrand(host.dataset.yarn === 'sag'));
    host.appendChild(deco);
  });

  /* ---------- 3) Scroll'a bağlı hafif paralaks (döngü yok) ---------- */
  var decos = document.querySelectorAll('.yarn-deco');
  if (!decos.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.gsap || !window.ScrollTrigger) return;

  decos.forEach(function (d) {
    gsap.fromTo(d, { y: 20 }, {
      y: -20, ease: 'none',
      scrollTrigger: { trigger: d.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
})();
