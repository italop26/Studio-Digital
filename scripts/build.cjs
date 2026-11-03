const { cpSync, mkdirSync, rmSync } = require('node:fs');
const { resolve, join } = require('node:path');
const { spawnSync } = require('node:child_process');
const root = resolve(__dirname, '..');
const build = spawnSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build'], { cwd: join(root, 'sabor-express'), stdio: 'inherit' });
if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status || 1);
const output = join(root, 'dist');
if (output !== resolve(__dirname, '../dist')) throw new Error('Diretório de saída inesperado');
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
for (const file of ['index.html', 'css', 'js', 'assets', 'agendamento', 'barber-shop', 'dashboard', 'robots.txt', 'sitemap.xml', 'googlec550b8fad34d1909.html']) {
  cpSync(join(root, file), join(output, file), { recursive: true, filter: path => !path.endsWith('requirements.txt') });
}
// Preserva a URL pública já usada pelo portfólio e pelo sitemap.
mkdirSync(join(output, 'sabor-express'), { recursive: true });
cpSync(join(root, 'sabor-express/dist'), join(output, 'sabor-express/dist'), { recursive: true });
console.log('Site pronto em dist/. Execute npm run preview para conferir.');
