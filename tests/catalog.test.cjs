const { test } = require('node:test');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const { resolve } = require('node:path');
const catalog = import(pathToFileURL(resolve(__dirname, '../sabor-express/src/catalog.js')).href);

test('carrinho aceita somente produtos conhecidos e quantidades inteiras positivas', async () => {
  const { normalizeCart } = await catalog;
  assert.deepEqual(normalizeCart({}), []);
  assert.deepEqual(normalizeCart([null, { id: 999, quantity: 1 }, { id: 1, quantity: -1 }, { id: 2, quantity: 1.5 }]), []);
});
test('carrinho restaura preço e nome do catálogo e limita quantidade', async () => {
  const { normalizeCart, products } = await catalog;
  const cart = normalizeCart([{ id: 1, price: 0, name: 'adulterado', quantity: 99 }, { id: 1, quantity: 2 }]);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].price, products[0].price);
  assert.equal(cart[0].name, products[0].name);
  assert.equal(cart[0].quantity, 20);
});
test('JSON inválido ou armazenamento bloqueado não quebra o carrinho', async () => {
  const { readCart, saveCart } = await catalog;
  assert.deepEqual(readCart({ getItem: () => '{' }), []);
  assert.deepEqual(readCart({ getItem() { throw Error('blocked'); } }), []);
  assert.doesNotThrow(() => saveCart([], { setItem() { throw Error('blocked'); } }));
});
