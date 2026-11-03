const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const { resolve, dirname } = require('node:path');
const vm = require('node:vm');

const root = resolve(__dirname, '..');
const main = readFileSync(resolve(root, 'js/main.js'), 'utf8');

function setup({ valid = true, phone = '(81) 99999-9999', response = 'success', storageBlocked = false } = {}) {
  const status = { textContent: '', dataset: {} };
  const button = { disabled: false, textContent: 'Enviar pedido de conversa' };
  const attrs = {};
  let submit;
  let requests = 0;
  let redirects = 0;
  let resets = 0;
  let focused;
  const stored = new Map();
  const field = (name, value) => ({ value, focus() { focused = name; } });
  const form = {
    elements: { nome: field('nome', 'Teste'), whatsapp: field('whatsapp', phone), servico: field('servico', 'Landing page'), site: field('site', ''), data: field('data', ''), mensagem: field('mensagem', 'Preciso de um site para minha loja.') },
    dataset: { endpoint: 'https://example.invalid/form', successUrl: 'agendamento/index.html' },
    querySelector: selector => selector === '.form__status' ? status : button,
    addEventListener: (_, handler) => { submit = handler; },
    reportValidity: () => valid,
    setAttribute: (key, value) => { attrs[key] = value; },
    removeAttribute: key => { delete attrs[key]; },
    reset: () => { resets++; },
  };
  const context = {
    document: { querySelector: () => null, getElementById: id => id === 'form-agendamento' ? form : null },
    window: { location: { assign: url => { assert.equal(url, 'agendamento/index.html'); redirects++; } } },
    sessionStorage: { setItem: (key, value) => { if (storageBlocked) throw new Error('blocked'); stored.set(key, value); } },
    FormData: class {},
    fetch: async () => { requests++; if (response === 'network') throw new Error('offline'); return { ok: response === 'success', status: 422 }; },
  };
  vm.runInNewContext(main, context);
  return { form, status, button, attrs, stored, submit: () => submit({ preventDefault() {} }), counts: () => ({ requests, redirects, resets }), focused: () => focused };
}

test('sucesso redireciona para a tela de conclusão', async () => {
  const app = setup();
  await app.submit();
  assert.deepEqual(app.counts(), { requests: 1, redirects: 1, resets: 1 });
  assert.equal(app.stored.size, 0);
  assert.equal(app.attrs['aria-busy'], undefined);
});

for (const response of ['http', 'network']) {
  test(`falha ${response} preserva formulário e permite tentar novamente`, async () => {
    const app = setup({ response });
    await app.submit();
    assert.deepEqual(app.counts(), { requests: 1, redirects: 0, resets: 0 });
    assert.equal(app.status.dataset.type, 'erro');
    assert.equal(app.button.disabled, false);
    assert.equal(app.stored.size, 0);
  });
}

test('campos inválidos impedem o envio', async () => {
  const app = setup({ valid: false });
  await app.submit();
  assert.equal(app.counts().requests, 0);
  const phone = setup({ phone: '123' });
  await phone.submit();
  assert.equal(phone.counts().requests, 0);
  assert.equal(phone.focused(), 'whatsapp');
});

test('cliques repetidos geram um único envio enquanto aguarda resposta', async () => {
  const app = setup();
  await Promise.all([app.submit(), app.submit()]);
  assert.equal(app.counts().requests, 1);
});

test('armazenamento bloqueado não impede redirecionamento', async () => {
  const app = setup({ storageBlocked: true });
  await app.submit();
  assert.equal(app.counts().redirects, 1);
  assert.equal(app.status.dataset.type, 'ok');
  assert.match(app.status.textContent, /Pedido enviado/);
});

test('conclusão é visível sem JavaScript ou armazenamento', () => {
  const html = readFileSync(resolve(root, 'agendamento/index.html'), 'utf8');
  assert.match(html, /<h1[^>]*>Solicitação concluída!<\/h1>/);
  assert.doesNotMatch(html, /<script|\shidden(?:\s|=|>)/);
});

for (const [name, value] of [['nome', ' '], ['nome', 'A'], ['mensagem', 'curta'], ['mensagem', 'a'.repeat(1501)], ['data', '2000-01-01']]) {
  test(`rejeita ${name} fora das regras (${value.length > 30 ? 'texto longo' : value})`, async () => {
    const app = setup();
    app.form.elements[name].value = value;
    await app.submit();
    assert.equal(app.counts().requests, 0);
    assert.equal(app.focused(), name);
  });
}

test('permite sugestão de data futura e bloqueia campo isca preenchido', async () => {
  const app = setup();
  app.form.elements.data.value = '2099-12-31';
  await app.submit();
  assert.equal(app.counts().requests, 1);
  const robot = setup();
  robot.form.elements.site.value = 'spam';
  await robot.submit();
  assert.equal(robot.counts().requests, 0);
});

test('páginas não têm IDs duplicados e seus arquivos e âncoras locais existem', () => {
  for (const file of ['index.html', 'agendamento/index.html']) {
    const path = resolve(root, file);
    const html = readFileSync(path, 'utf8');
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, file);
    for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|data:)/.test(url)) continue;
      if (url.startsWith('#')) assert.ok(ids.includes(url.slice(1)), url);
      else assert.ok(existsSync(resolve(dirname(path), url.split('#')[0])), `${file}: ${url}`);
    }
  }
});
