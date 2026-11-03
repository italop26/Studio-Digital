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

/* ---------- Ano do rodapé ---------- */
function initYear() {
  const el = document.getElementById("ano");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Formulário de agendamento ---------- */
function initForm() {
  const form = document.getElementById("form-agendamento");
  if (!form) return;
  const status = form.querySelector(".form__status");
  const button = form.querySelector("button[type='submit']");
  const buttonLabel = button.textContent;
  const date = form.elements.data;
  const today = new Date();
  const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  date.min = localToday;

  function show(message, type) {
    status.textContent = message;
    status.dataset.type = type; // "ok" | "erro" (usado no CSS)
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (button.disabled) return;

    // Campo isca: se um robô preencheu, finge que deu certo e não envia
    if (form.elements.site.value) return;

    if (!form.reportValidity()) return;
    const nome = form.elements.nome.value.trim();
    const whatsapp = form.elements.whatsapp.value.replace(/\D/g, "");
    if (nome.length < 2 || nome.length > 80) {
      form.elements.nome.focus();
      return show("Informe seu nome, com 2 a 80 caracteres.", "erro");
    }
    if (!/^(?:55)?[1-9]{2}9\d{8}$/.test(whatsapp)) {
      form.elements.whatsapp.focus();
      return show("Informe um WhatsApp válido com DDD.", "erro");
    }
    if (!form.elements.servico.value) return show("Escolha o serviço de interesse.", "erro");
    const mensagem = form.elements.mensagem.value.trim();
    if (mensagem.length < 10 || mensagem.length > 1500) {
      form.elements.mensagem.focus();
      return show("Descreva o que precisa em 10 a 1.500 caracteres.", "erro");
    }
    const now = new Date();
    const minimum = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    date.min = minimum;
    if (date.value && date.value < minimum) {
      date.focus();
      return show("Escolha hoje ou uma data futura para a conversa.", "erro");
    }

    // Sem endpoint configurado, o envio não existe: avisamos em vez de simular
    const endpoint = form.dataset.endpoint;
    if (!endpoint) {
      return show("O envio por formulário ainda não está ativo. Use o botão do WhatsApp.", "erro");
    }

    button.disabled = true;
    button.textContent = "Enviando pedido…";
    form.setAttribute("aria-busy", "true");
    show("Enviando...", "ok");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      form.reset();
      show("Pedido enviado. Vou entrar em contato pelo WhatsApp para combinar o horário.", "ok");
      window.location.assign(form.dataset.successUrl);
    } catch (err) {
      show("Não consegui enviar agora. Tente de novo ou chame no WhatsApp.", "erro");
    } finally {
      button.disabled = false;
      button.textContent = buttonLabel;
      form.removeAttribute("aria-busy");
    }
  });
}

/* ---------- Início ---------- */
initMenu();
initHeader();
initYear();
initForm();
