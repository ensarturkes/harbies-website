/* ============================================================
   HARBIE v3 — İlmek katmanı
   Ayırıcı şerit ve süs iplikleri ÖRGÜ KORDON olarak çizilir:
   yol boyunca teğet çerçevesine oturan V ilmekler + sarılı yumak.
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

  /* ---------- 2) Örgü dokusu: bir eğri boyunca V ilmekler ----------
     Kübik Bézier'i örnekleyip, yol boyunca teğet/normal çerçevesine
     oturan küçük "V" ilmekler diziyoruz — ayırıcı şeritteki desenin aynısı. */
  function cubic(P, t) {
    var u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
    return [a * P[0][0] + b * P[1][0] + c * P[2][0] + d * P[3][0],
            a * P[0][1] + b * P[1][1] + c * P[2][1] + d * P[3][1]];
  }
  function cubicTangent(P, t) {
    var u = 1 - t, a = 3 * u * u, b = 6 * u * t, c = 3 * t * t;
    var x = a * (P[1][0] - P[0][0]) + b * (P[2][0] - P[1][0]) + c * (P[3][0] - P[2][0]);
    var y = a * (P[1][1] - P[0][1]) + b * (P[2][1] - P[1][1]) + c * (P[3][1] - P[2][1]);
    var n = Math.hypot(x, y) || 1;
    return [x / n, y / n];
  }

  /* Eğri boyunca eşit aralıklı ilmek yolları üretir. */
  function stitchPath(P, spacing, offset, phase, size) {
    // yay uzunluğuna göre t tablosu
    var steps = 240, table = [0], prev = cubic(P, 0), len = 0, i;
    for (i = 1; i <= steps; i++) {
      var p = cubic(P, i / steps);
      len += Math.hypot(p[0] - prev[0], p[1] - prev[1]);
      table.push(len); prev = p;
    }
    function tAt(s) {                       // yay uzunluğundan t'ye
      for (var j = 1; j <= steps; j++) if (table[j] >= s) {
        var d = table[j] - table[j - 1] || 1;
        return (j - 1 + (s - table[j - 1]) / d) / steps;
      }
      return 1;
    }

    var out = [], s;
    for (s = spacing * 0.6 + phase; s < len - spacing * 0.4; s += spacing) {
      var t = tAt(s), c = cubic(P, t), T = cubicTangent(P, t);
      var N = [-T[1], T[0]];
      var cx = c[0] + N[0] * offset, cy = c[1] + N[1] * offset;
      var pt = function (a, b) {
        return [cx + T[0] * a + N[0] * b, cy + T[1] * a + N[1] * b];
      };
      var a1 = pt(-size * 0.86, size), c1 = pt(size * 0.36, size * 0.62),
          ap = pt(size, 0),
          c2 = pt(size * 0.36, -size * 0.62), a2 = pt(-size * 0.86, -size);
      out.push('M' + a1 + ' Q' + c1 + ' ' + ap + ' Q' + c2 + ' ' + a2);
    }
    return out.join(' ').replace(/,/g, ' ');
  }

  /* ---------- 3) Bölüm süsü: örgü kordon + yumak ---------- */
  function yarnStrand(flip) {
    var svg = el('svg', { viewBox: '0 0 220 190', 'aria-hidden': 'true', focusable: 'false' });
    var g = el('g', flip ? { transform: 'translate(220,0) scale(-1,1)' } : {});
    var P = [[10, 184], [6, 110], [48, 46], [132, 34]];
    var d1 = 'M10 184 C 6 110, 48 46, 132 34';

    // kordon gövdesi
    g.appendChild(el('path', { d: d1, fill: 'none', stroke: 'currentColor',
      'stroke-width': '13', 'stroke-linecap': 'round', opacity: '.22' }));
    // iki sıra V ilmek (yarım adım kaydırmalı → örgü hissi)
    var dS = stitchPath(P, 11, -3, 0, 2.9) + ' ' + stitchPath(P, 11, 3, 5.5, 2.9);
    g.appendChild(el('path', { d: dS, fill: 'none', stroke: 'currentColor',
      'stroke-width': '2.1', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      opacity: '.5' }));

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

  /* ---------- 4) Scroll'a bağlı hafif paralaks (döngü yok) ---------- */
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
