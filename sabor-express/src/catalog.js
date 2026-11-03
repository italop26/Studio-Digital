export const products = [
  { id: 1, name: 'Clássico da Casa', category: 'Hambúrgueres', description: 'Hambúrguer, cheddar, alface e molho da casa.', price: 28.9, image: 'photo-1568901346375-23c9450c58cd', featured: true },
  { id: 2, name: 'Duplo Cheddar', category: 'Hambúrgueres', description: 'Dois hambúrgueres, cheddar e cebola caramelizada.', price: 34.9, image: './images/duplo-cheddar.webp', featured: true },
  { id: 3, name: 'Batata com Páprica', category: 'Acompanhamentos', description: 'Porção de batatas fritas temperadas com páprica.', price: 16.9, image: 'photo-1573080496219-bb080dd4f877' },
  { id: 4, name: 'Onion Rings', category: 'Acompanhamentos', description: 'Porção de anéis de cebola empanados.', price: 18.9, image: 'photo-1639024471283-03518883512d' },
  { id: 5, name: 'Milk-shake de Chocolate', category: 'Bebidas', description: 'Sorvete de chocolate batido com leite e calda.', price: 19.9, image: 'photo-1572490122747-3968b75cc699' },
  { id: 6, name: 'Limonada da Casa', category: 'Bebidas', description: 'Suco de limão com água e gelo.', price: 10.9, image: './images/limonada-casa.webp' },
];
export const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const productImage = (image, width) => image.startsWith('photo-') ? `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=80` : image;

export function normalizeCart(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value.flatMap(item => {
    const product = products.find(product => product.id === item?.id);
    if (!product || seen.has(product.id) || !Number.isInteger(item.quantity) || item.quantity < 1) return [];
    seen.add(product.id);
    return [{ ...product, quantity: Math.min(20, item.quantity) }];
  });
}
export function readCart(storage) {
  try {
    return normalizeCart(JSON.parse((storage ?? globalThis.localStorage).getItem('se-cart')));
  } catch {
    // Dados inválidos ou armazenamento indisponível: iniciar um carrinho vazio.
    return [];
  }
}
export function saveCart(cart, storage) {
  try {
    (storage ?? globalThis.localStorage).setItem('se-cart', JSON.stringify(cart));
  } catch {
    // O carrinho continua funcionando em memória quando o armazenamento é bloqueado.
  }
}
