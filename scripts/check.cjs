const assert = require('node:assert/strict');
const { existsSync, readFileSync, readdirSync } = require('node:fs');
const { resolve, dirname, join } = require('node:path');
const { spawnSync } = require('node:child_process');
const root = resolve(__dirname, '..');
function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (['node_modules', 'dist', '.git'].includes(entry.name)) return [];
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}
for (const path of files(root).filter(path => /\.(js|cjs)$/.test(path))) {
  const check = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8' });
  assert.equal(check.status, 0, check.stderr);
}
const output = join(root, 'dist');
assert.ok(existsSync(output), 'Execute npm run build antes do check.');
const pages = ['index.html', 'agendamento/index.html', 'barber-shop/index.html', 'dashboard/Painel Atlântica.html', 'sabor-express/dist/index.html'];
for (const page of pages) {
  const path = join(output, page);
  const html = readFileSync(path, 'utf8');
  assert.match(html, /<html lang="pt-BR">/, page);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `IDs repetidos: ${page}`);
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|data:|mailto:|tel:)/.test(url)) continue;
    if (url.startsWith('#')) {
      // O conteúdo do dashboard é renderizado pelo React.
      if (!page.startsWith('dashboard/')) assert.ok(ids.includes(url.slice(1)), `${page}: ${url}`);
      continue;
    }
    const target = resolve(dirname(path), decodeURIComponent(url.split('#')[0]));
    assert.ok(existsSync(target), `${page}: arquivo ausente ${url}`);
  }
}
const sitemap = readFileSync(join(output, 'sitemap.xml'), 'utf8');
for (const [, url] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const pathname = decodeURIComponent(new URL(url).pathname);
  assert.ok(existsSync(join(output, pathname === '/' ? 'index.html' : pathname)), `Sitemap: ${url}`);
}
assert.doesNotMatch(sitemap, /agendamento\//);
console.log('PASSOU: sintaxe JS, páginas geradas, IDs, arquivos locais e sitemap.');
