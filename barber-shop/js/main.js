/* ==========================================================================
   BARBER SHOP — interações da landing page
   1. WhatsApp  2. Menu mobile  3. Revelação ao rolar  4. Abertura animada  5. Ano
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var config = window.BARBER_CONFIG || {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
        showToast('WhatsApp ainda não configurado. Defina o número em js/config.js.');
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

  /* ---------- 3. Revelação ao rolar ---------- */
  var revealItems = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 4. Abertura animada ---------- */
  var intro = document.getElementById('abertura');
  var INTRO_UNLOCK_MS = 7400; // o indicador de scroll aparece em ~7,1s
  var finished = false;

  function finishIntro() {
    if (finished) return;
    finished = true;
    root.classList.remove('intro-lock');
    root.classList.add('intro-done');
    if (intro) intro.classList.add('is-done');
  }

  if (!intro || reduceMotion) {
    if (intro) intro.remove();
    finishIntro();
  } else {
    var skip = intro.querySelector('.intro__skip');
    var started = false;
    var timer;

    var start = function () {
      if (started) return;
      started = true;
      window.scrollTo(0, 0);
      intro.classList.add('is-playing');
      timer = setTimeout(finishIntro, INTRO_UNLOCK_MS);
    };

    // Espera a fachada estar decodificada para a animação começar fluida
    var firstImage = intro.querySelector('.intro__img');
    var ready = firstImage && firstImage.decode ? firstImage.decode() : Promise.resolve();
    ready.then(start, start);
    setTimeout(start, 2500); // segurança caso a imagem demore

    if (skip) {
      skip.addEventListener('click', function () {
        clearTimeout(timer);
        started = true;
        intro.classList.add('is-skipped');
        finishIntro();
        var hero = document.getElementById('inicio');
        if (hero) hero.scrollIntoView({ behavior: 'auto' });
      });
    }
  }

  // O cabeçalho só aparece depois que a pessoa rola para além da abertura
  if (intro && !reduceMotion) {
    var onScroll = function () {
      root.classList.toggle('intro-top', window.scrollY < window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 5. Ano do rodapé ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
