/* ============================================================
   HARBIE v3 — Sekmeler (karakter sayfası) + galeri thumb değiştirme
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Sekmeler ---------- */
  var lists = document.querySelectorAll('[data-tabs]');
  lists.forEach(function (root) {
    var btns = root.querySelectorAll('.tab-btn');
    var panels = root.querySelectorAll('.tab-panel');

    function activate(idx) {
      btns.forEach(function (b, i) {
        var on = i === idx;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p, i) { p.classList.toggle('active', i === idx); });
    }

    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { activate(i); });
      b.addEventListener('keydown', function (e) {
        var idx = i;
        if (e.key === 'ArrowRight') idx = (i + 1) % btns.length;
        else if (e.key === 'ArrowLeft') idx = (i - 1 + btns.length) % btns.length;
        else return;
        e.preventDefault();
        btns[idx].focus();
        activate(idx);
      });
    });
    activate(0);
  });

  /* ---------- Galeri thumb → ana görsel ---------- */
  var gal = document.querySelector('[data-gallery]');
  if (gal) {
    var main = gal.querySelector('.main img');
    gal.querySelectorAll('.char-thumbs img').forEach(function (t) {
      t.addEventListener('click', function () {
        var cur = main.src;
        main.src = t.src;
        t.src = cur;
        main.alt = t.alt;
      });
    });
  }
})();
