/* ==========================================================
   Draxivo Digital — main.js
   Arquivo único (sem módulos), então funciona até abrindo
   o index.html direto no navegador. Cada função cuida de
   uma responsabilidade e é chamada no final do arquivo.
   ========================================================== */

/* ---------- Menu mobile ---------- */
function initMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("menu-principal");
  if (!toggle || !menu) return;

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
  }

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Fecha ao clicar em um link (navegação por âncora)
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });

  // Fecha com Esc e devolve o foco ao botão
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });
}

/* ---------- Cabeçalho: sombra ao rolar + link da seção ativa ---------- */
function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Marca no menu a seção que está na tela
  const links = document.querySelectorAll(".nav__list a");
  const byId = new Map();
  links.forEach((a) => byId.set(a.getAttribute("href").slice(1), a));
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.remove("is-active"));
      const link = byId.get(entry.target.id);
      if (link) link.classList.add("is-active");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  byId.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

/* ---------- Animação de entrada ao rolar ---------- */
function initReveal() {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const items = document.querySelectorAll(".section__head, .card, .step, .about__text, .form");
  document.documentElement.classList.add("js-reveal");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("is-visible");
      obs.unobserve(el);
      // Depois da animação, devolve o elemento ao estado normal para
      // que o atraso/duração do reveal não atrapalhem o hover dos cards
      setTimeout(() => {
        el.classList.remove("reveal", "is-visible");
        el.style.transitionDelay = "";
      }, 900);
    });
  }, { threshold: 0.15 });

  items.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = (i % 4) * 80 + "ms"; // pequeno escalonamento entre irmãos
    observer.observe(el);
  });
}

/* ---------- Ano do rodapé ---------- */
function initYear() {
  const el = document.getElementById("ano");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Links sociais  ---------- */

/* ---------- Formulário de agendamento ---------- */
function initForm() {
  const form = document.getElementById("form-agendamento");
  if (!form) return;
  const status = form.querySelector(".form__status");
  const button = form.querySelector("button[type='submit']");

  function show(message, type) {
    status.textContent = message;
    status.dataset.type = type; // "ok" | "erro" (usado no CSS)
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Campo isca: se um robô preencheu, finge que deu certo e não envia
    if (form.elements.site.value) return;

    // Validação simples (o novalidate no HTML desliga a do navegador)
    const nome = form.elements.nome.value.trim();
    const whatsapp = form.elements.whatsapp.value.replace(/\D/g, "");
    if (!nome) return show("Informe seu nome.", "erro");
    if (whatsapp.length < 10) return show("Informe um WhatsApp com DDD.", "erro");
    if (!form.elements.servico.value) return show("Escolha o serviço de interesse.", "erro");

    // Sem endpoint configurado, o envio não existe: avisamos em vez de simular
    const endpoint = form.dataset.endpoint;
    if (!endpoint) {
      return show("O envio por formulário ainda não está ativo. Use o botão do WhatsApp.", "erro");
    }

    button.disabled = true;
    show("Enviando...", "ok");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      form.reset();
      show("Recebi seu pedido! Entro em contato em breve.", "ok");
    } catch (err) {
      show("Não consegui enviar agora. Tente de novo ou chame no WhatsApp.", "erro");
    } finally {
      button.disabled = false;
    }
  });
}

/* ---------- Início ---------- */
initMenu();
initHeader();
initReveal();
initYear();
initForm();
