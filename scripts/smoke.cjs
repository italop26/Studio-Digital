const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { join } = require('node:path');
const server = spawn(process.execPath, [join(__dirname, 'serve.cjs')], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
async function run() {
  try {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Servidor não iniciou')), 8000);
      server.stdout.once('data', () => { clearTimeout(timeout); resolve(); });
      server.once('error', error => { clearTimeout(timeout); reject(error); });
      server.once('exit', code => { clearTimeout(timeout); reject(new Error(`Servidor encerrou: ${code}`)); });
    });
    for (const path of ['/', '/agendamento/', '/barber-shop/', '/sabor-express/dist/', '/dashboard/Painel%20Atl%C3%A2ntica.html', '/sitemap.xml', '/robots.txt', '/css/style.css', '/dashboard/js/main.js']) {
      const response = await fetch(`http://127.0.0.1:4173${path}`);
      assert.equal(response.status, 200, path);
      assert.ok((await response.text()).length > 0, path);
    }
    assert.equal((await fetch('http://127.0.0.1:4173/pagina-inexistente')).status, 404);
    console.log('PASSOU: páginas, assets e SEO respondem por HTTP; página inexistente retorna 404.');
  } finally {
    server.kill();
  }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
