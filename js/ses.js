/* ============================================================
   HARBIE v3 — Sosyal Etki Sayacı (SES)
   Mantık app.js'ten taşındı (kanıtlanmış), markup sözleşmesi korundu.
   ============================================================ */
(function () {
  'use strict';

  var fmt = function (n) { return n.toLocaleString('tr-TR'); };
  var GOAL = 13000;
  var CYCLE = 100; // 100 paylaşım = +1 oyuncak

  var toys = parseInt(localStorage.getItem('harbie_toys') || '12480', 10);
  var cycle = parseInt(localStorage.getItem('harbie_cycle') || '72', 10);

  var elCount = document.querySelector('[data-ses-count]');
  if (!elCount) return; // SES bölümü bu sayfada yoksa çık

  var elMini = document.querySelectorAll('[data-ses-mini]');
  var elBar = document.querySelector('[data-ses-bar]');
  var elToward = document.querySelector('[data-ses-toward]');
  var elGoal = document.querySelector('[data-ses-goal]');
  var elMeter = document.querySelector('[data-ses-meter]');
  var elShare = document.querySelector('[data-ses-share]');
  var elToast = document.querySelector('[data-ses-toast]');

  function paintMini() { elMini.forEach(function (m) { m.textContent = fmt(toys); }); }
  function paintMeta() {
    if (elBar) elBar.style.width = (cycle / CYCLE * 100) + '%';
    if (elToward) elToward.textContent = (CYCLE - cycle) + ' paylaşım sonraki oyuncağa';
    if (elGoal) elGoal.textContent = 'Hedef ' + fmt(GOAL);
  }
  function save() {
    localStorage.setItem('harbie_toys', String(toys));
    localStorage.setItem('harbie_cycle', String(cycle));
  }
  function setCount(n) { elCount.textContent = fmt(n); }

  paintMini();
  paintMeta();
  setCount(toys);

  // Görünüme girince sayım animasyonu
  if (elMeter && 'IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var done = false;
    var mio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !done) {
          done = true;
          var from = Math.max(0, toys - 240);
          var t0 = performance.now();
          (function step(t) {
            var p = Math.min(1, (t - t0) / 1300);
            var eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.round(from + (toys - from) * eased));
            if (p < 1) requestAnimationFrame(step); else setCount(toys);
          })(t0);
          mio.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    mio.observe(elMeter);
  }

  function toast(msg) {
    if (!elToast) return;
    elToast.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 21s-7-4.35-9.5-8.5C.8 9 2.3 5.5 5.5 5.5c1.9 0 3.2 1 3.9 2.2C10.3 6.5 11.6 5.5 13.5 5.5c3.2 0 4.7 3.5 3 7C16 16.65 12 21 12 21z"/></svg><span>' + msg + '</span>';
    elToast.classList.add('show');
    clearTimeout(elToast._t);
    elToast._t = setTimeout(function () { elToast.classList.remove('show'); }, 2600);
  }

  function heartPop() {
    if (!elShare || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var r = elShare.getBoundingClientRect();
    for (var i = 0; i < 6; i++) {
      (function (i) {
        var h = document.createElement('div');
        h.className = 'ses-pop';
        h.textContent = ['❤', '🧶', '✨', '❤'][i % 4];
        h.style.position = 'fixed';
        h.style.left = (r.left + r.width / 2) + 'px';
        h.style.top = (r.top) + 'px';
        h.style.zIndex = 200;
        document.body.appendChild(h);
        var dx = (Math.random() - 0.5) * 120;
        var dy = -70 - Math.random() * 90;
        h.animate([
          { transform: 'translate(-50%,-50%) scale(.6)', opacity: 0 },
          { transform: 'translate(calc(-50% + ' + dx * 0.5 + 'px),' + dy * 0.5 + 'px) scale(1.1)', opacity: 1, offset: .3 },
          { transform: 'translate(calc(-50% + ' + dx + 'px),' + dy + 'px) scale(.9)', opacity: 0 }
        ], { duration: 1100 + Math.random() * 400, easing: 'cubic-bezier(.2,.7,.3,1)' })
          .onfinish = function () { h.remove(); };
      })(i);
    }
  }

  function bump() {
    elCount.animate([
      { transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }
    ], { duration: 420, easing: 'ease-out' });
  }

  if (elShare) {
    elShare.addEventListener('click', function () {
      cycle += 1;
      heartPop();
      if (cycle >= CYCLE) {
        cycle = 0;
        toys += 1;
        setCount(toys);
        paintMini();
        bump();
        toast('Tebrikler! Kumbaramıza +1 oyuncak eklendi 🎉');
      } else {
        toast('Paylaşımınız için teşekkürler — kumbara doluyor!');
      }
      paintMeta();
      save();

      if (navigator.share) {
        navigator.share({
          title: 'Harbie — Mesleklerin cinsiyeti yoktur',
          text: 'Eşitlik oyunla başlar. Harbie ile geleceğin eşitlik elçilerini keşfet.',
          url: location.href
        }).catch(function () {});
      }
    });
  }
})();
