/* ============================================================
   HARBIE v3 — Kabuk: mobil menü, reveal, yıl
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Mobil menü ---------- */
  var burger = document.querySelector('[data-burger]');
  var menu = document.querySelector('[data-mobile-menu]');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Yıl ---------- */
  var y = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (e) { e.textContent = y; });

  /* ---------- Reveal on scroll (motion.js devralmazsa temel davranış) ----------
     GSAP yüklüyse motion.js reveal öğelerini kendi yönetir ve bu gözlemciyi
     devre dışı bırakır (data-motion işareti). Burada yalnızca fallback var. */
  var revs = document.querySelectorAll('.reveal');
  if (!revs.length) return;
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revs.forEach(function (el) { io.observe(el); });
  } else {
    revs.forEach(function (el) { el.classList.add('in'); });
  }
})();
