/* ============================================================
   HARBIE v3 — Kurumsal form (gönderimsiz demo)
   NOT: Form verisi hiçbir yere gönderilmez. Gerçek gönderim hedefi
   (e-posta servisi / CRM) toplantı sonrası belirlenecek.
   ============================================================ */
(function () {
  'use strict';
  var form = document.querySelector('[data-corp-form]');
  if (!form) return;
  var ok = document.querySelector('[data-form-ok]');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    form.style.display = 'none';
    if (ok) {
      ok.classList.add('show');
      ok.focus();
    }
  });
})();
