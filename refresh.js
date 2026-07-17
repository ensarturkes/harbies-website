/* ============================================================
   HARBIE — Görsel yenileme davranışları (refresh.js)
   Hero karakter döngüsü · sahne reveal · dikiş animasyonu
   app.js'ten SONRA yüklenir.
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero karakter döngüsü ---------- */
  var cyc = document.querySelector('.hero-cycle');
  if (cyc) {
    var frames = [].slice.call(cyc.querySelectorAll('.frame'));
    var bgs = [].slice.call(cyc.querySelectorAll('.scene-bg'));
    var dots = [].slice.call(cyc.querySelectorAll('.hero-dots button'));
    var plate = cyc.querySelector('.nameplate');
    var roles = frames.map(function (f) { return { role: f.dataset.role, motto: f.dataset.motto }; });
    var ci = 0, timer = null;

    function show(n) {
      ci = (n + frames.length) % frames.length;
      frames.forEach(function (f, i) { f.toggleAttribute('data-on', i === ci); });
      bgs.forEach(function (b, i) { b.toggleAttribute('data-on', i === ci); });
      dots.forEach(function (d, i) { d.setAttribute('aria-current', String(i === ci)); });
      if (plate) {
        plate.querySelector('.role').textContent = roles[ci].role;
        plate.querySelector('.motto').textContent = roles[ci].motto;
      }
    }
    function next() { show(ci + 1); }
    function start() { if (!reduce) { stop(); timer = setInterval(next, 3600); } }
    function stop() { if (timer) clearInterval(timer); }

    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { show(i); start(); });
    });
    cyc.addEventListener('mouseenter', stop);
    cyc.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  /* ---------- Dikiş / stitch çizim animasyonu (görünürken) ---------- */
  var stitches = document.querySelectorAll('.draw-stitch');
  if ('IntersectionObserver' in window && stitches.length && !reduce) {
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); sio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    stitches.forEach(function (s) { sio.observe(s); });
  } else {
    stitches.forEach(function (s) { s.classList.add('in'); });
  }
})();
