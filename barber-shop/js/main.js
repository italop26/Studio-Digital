/* ==========================================================================
   BARBER SHOP — interações da landing page
   WhatsApp demonstrativo, menu mobile e ano do rodapé.
   ========================================================================== */
(function () {
  'use strict';

  var config = window.BARBER_CONFIG || {};

  /* ---------- Toast ---------- */
  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 4500);
  }

  /* ---------- 1. WhatsApp ---------- */
  var number = String(config.whatsappNumber || '').replace(/\D/g, '');
  var numberIsValid = number.length >= 10 && number.length <= 15;

  document.querySelectorAll('[data-whatsapp]').forEach(function (link) {
    var service = link.getAttribute('data-service');
    var message = config.whatsappMessage || 'Olá! Gostaria de agendar um horário.';
    if (service) message = 'Olá! Gostaria de agendar: ' + service + '.';

    if (numberIsValid) {
      link.href = 'https://wa.me/' + number + '?text=' + encodeURIComponent(message);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } else {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        showToast('Esta é uma demonstração. Nenhum horário foi reservado. Para criar seu site, fale com a Draxivo Digital.');
      });
    }
  });

  /* ---------- 2. Menu mobile ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu');

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('is-open', open);
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* ---------- 5. Ano do rodapé ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
