import React, { createContext, useContext, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowRight, Check, Minus, Plus, ShoppingBag, ShoppingCart, Trash2, Utensils } from 'lucide-react';
import { products, money, productImage, readCart, saveCart } from './catalog.js';
import './styles.css';

const CartContext = createContext(null);
const useCart = () => useContext(CartContext);

function Header({ go }) {
  const { count } = useCart();
  return <header className="header">
    <button className="brand" onClick={() => go('inicio')} aria-label="Sabor Express, início">
      <i><Utensils size={19}/></i><b>Sabor<span>Express</span><small>CARDÁPIO DEMONSTRATIVO</small></b>
    </button>
    <button className="cart-button" onClick={() => go('carrinho')} aria-label={`Carrinho, ${count} itens`}>
      <ShoppingCart size={18}/> Carrinho {count > 0 && <em>{count}</em>}
    </button>
  </header>;
}

function Product({ product }) {
  const { add } = useCart();
  return <article className="product">
    <div className="product-img"><img src={productImage(product.image, 800)} alt={product.name} loading="lazy" width="800" height="600"/></div>
    <div className="product-info">
      <small>{product.category}</small><h3>{product.name}</h3><p>{product.description}</p>
      <footer><b>{money(product.price)}</b><button aria-label={`Adicionar ${product.name}`} onClick={() => add(product)}><Plus size={19}/></button></footer>
    </div>
  </article>;
}

function SiteFooter() {
  return <footer className="footer"><b>Sabor<span>Express</span></b><p>Cardápio de demonstração da Draxivo Digital. Sem pedidos ou cobranças reais.</p><a href="../../index.html#projetos">Voltar ao portfólio</a></footer>;
}

function Home({ go }) {
  return <main id="conteudo" tabIndex={-1}>
    <section className="hero">
      <div className="hero-copy">
        <div className="pill">SABOR EXPRESS · CARDÁPIO DEMONSTRATIVO</div>
        <h1>Hambúrguer,<br/>batata e <span>companhia.</span></h1>
        <p>Do clássico com salada ao duplo cheddar. Veja os ingredientes, escolha os acompanhamentos e monte seu pedido.</p>
        <div className="hero-actions"><button className="primary" onClick={() => go('cardapio')}>Ver cardápio <ArrowRight size={18}/></button></div>
        <p className="demo-copy">Este é um restaurante fictício. Os valores e as imagens são ilustrativos.</p>
      </div>
      <div className="hero-visual"><img src={productImage(products[0].image, 1000)} alt="Hambúrguer com queijo, salada e molho" width="1000" height="900" fetchPriority="high"/></div>
    </section>
    <section className="section">
      <div className="section-title"><div><small>PARA COMEÇAR</small><h2>Hambúrgueres da casa</h2></div><button className="text-link" onClick={() => go('cardapio')}>Todo o cardápio <ArrowRight size={17}/></button></div>
      <div className="grid">{products.filter(p => p.featured).map(p => <Product key={p.id} product={p}/>)}</div>
    </section>
    <SiteFooter/>
  </main>;
}

function Menu({ go }) {
  const [category, setCategory] = useState('Todos');
  const categories = ['Todos', 'Hambúrgueres', 'Acompanhamentos', 'Bebidas'];
  const list = category === 'Todos' ? products : products.filter(p => p.category === category);
  return <main className="page" id="conteudo" tabIndex={-1}>
    <div className="intro"><h1>Cardápio</h1><p>Ingredientes e valores por item. Adicione ao carrinho para experimentar a demonstração.</p><div className="crumb"><button onClick={() => go('inicio')}>Início</button> / Cardápio</div></div>
    <div className="filters" role="group" aria-label="Categorias">{categories.map(c => <button className={category === c ? 'selected' : ''} aria-pressed={category === c} key={c} onClick={() => setCategory(c)}>{c}</button>)}</div>
    <div className="grid">{list.map(p => <Product key={p.id} product={p}/>)}</div>
    <SiteFooter/>
  </main>;
}

function Empty({ go }) {
  return <div className="empty"><ShoppingBag size={36}/><h2>Seu carrinho está vazio.</h2><p>Escolha os itens no cardápio para continuar.</p><button className="primary" onClick={() => go('cardapio')}>Ver cardápio <ArrowRight size={18}/></button></div>;
}

function Summary({ total, go, action, label }) {
  return <aside className="summary"><h2>Resumo do pedido</h2><p>Subtotal <b>{money(total)}</b></p><p>Entrega <b>Não se aplica</b></p><hr/><h3>Total ilustrativo <b>{money(total)}</b></h3><button className="primary" onClick={action}>{label}<ArrowRight size={18}/></button><small>Demonstração: nenhuma cobrança real.</small><button className="back" onClick={() => go('cardapio')}><ArrowLeft size={14}/> Continuar no cardápio</button></aside>;
}

function Cart({ go }) {
  const { cart, change, remove } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <main className="page" id="conteudo" tabIndex={-1}>
    <div className="intro"><h1>Seu carrinho</h1><p>Confira os itens e as quantidades.</p></div>
    {!cart.length ? <Empty go={go}/> : <div className="cart-layout">
      <section className="cart-items"><h2>Itens do pedido</h2>{cart.map(item => <article className="cart-item" key={item.id}>
        <img src={productImage(item.image, 240)} alt={item.name} width="70" height="70"/>
        <div><small>{item.category}</small><h3>{item.name}</h3><b>{money(item.price)}</b></div>
        <div className="controls">
          <button onClick={() => change(item.id, -1)} aria-label={`Diminuir ${item.name}`}><Minus size={14}/></button><span>{item.quantity}</span>
          <button onClick={() => change(item.id, 1)} disabled={item.quantity >= 20} aria-label={`Aumentar ${item.name}`}><Plus size={14}/></button>
          <button className="trash" onClick={() => remove(item.id)} aria-label={`Remover ${item.name}`}><Trash2 size={16}/></button><b>{money(item.price * item.quantity)}</b>
        </div>
      </article>)}</section>
      <Summary total={total} go={go} action={() => go('pagamento')} label="Revisar pedido"/>
    </div>}
    <SiteFooter/>
  </main>;
}

function Payment({ go }) {
  const { cart, clear } = useCart();
  const [method, setMethod] = useState('Pix demonstrativo');
  const [done, setDone] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const methods = [
    ['Pix demonstrativo', 'Sem chave ou transação real'],
    ['Cartão demonstrativo', 'Nenhum dado de cartão será solicitado'],
    ['Dinheiro na entrega', 'Opção fictícia para esta demonstração'],
  ];
  if (done) return <main className="page" id="conteudo" tabIndex={-1}><div className="success"><span><Check size={34}/></span><small>PEDIDO DEMONSTRATIVO</small><h1>Simulação concluída.</h1><p>Nenhum pedido foi enviado e nenhum pagamento foi realizado.</p><button className="primary" onClick={() => go('inicio')}>Voltar ao início <ArrowRight size={18}/></button></div><SiteFooter/></main>;
  if (!cart.length) return <main className="page" id="conteudo" tabIndex={-1}><Empty go={go}/><SiteFooter/></main>;
  return <main className="page" id="conteudo" tabIndex={-1}>
    <div className="intro"><h1>Revisar pedido</h1><p>Escolha uma opção para concluir a simulação.</p></div>
    <div className="cart-layout"><section className="payment">
      <h2>Forma de pagamento ilustrativa</h2><p>Não solicitamos dados pessoais ou bancários.</p>
      <div role="group" aria-label="Forma de pagamento">{methods.map(([name, detail]) => <button key={name} className={`method ${method === name ? 'chosen' : ''}`} aria-pressed={method === name} onClick={() => setMethod(name)}><span><b>{name}</b><small>{detail}</small></span></button>)}</div>
      <h3>Itens do pedido</h3>{cart.map(item => <p className="preview" key={item.id}>{item.quantity}× {item.name}<b>{money(item.price * item.quantity)}</b></p>)}
    </section><Summary total={total} go={go} action={() => { clear(); setDone(true); }} label="Concluir simulação"/></div>
    <SiteFooter/>
  </main>;
}

function App() {
  const [cart, setCart] = useState(readCart);
  const [page, setPage] = useState(location.hash.slice(1) || 'inicio');
  const [notice, setNotice] = useState('');
  useEffect(() => { saveCart(cart); }, [cart]);
  useEffect(() => {
    const update = () => setPage(location.hash.slice(1) || 'inicio');
    addEventListener('hashchange', update);
    return () => removeEventListener('hashchange', update);
  }, []);
  useEffect(() => {
    document.getElementById('conteudo')?.focus({ preventScroll: true });
    scrollTo(0, 0);
  }, [page]);
  const go = next => { location.hash = next; setPage(next); };
  const add = product => {
    setCart(current => {
      const existing = current.find(item => item.id === product.id);
      return existing ? current.map(item => item.id === product.id ? { ...item, quantity: Math.min(20, item.quantity + 1) } : item) : [...current, { ...product, quantity: 1 }];
    });
    setNotice(`${product.name} adicionado ao carrinho. Limite de 20 por item.`);
  };
  const change = (id, amount) => setCart(current => current.map(item => item.id === id ? { ...item, quantity: Math.min(20, item.quantity + amount) } : item).filter(item => item.quantity > 0));
  const remove = id => setCart(current => current.filter(item => item.id !== id));
  const clear = () => setCart([]);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const pages = { inicio: <Home go={go}/>, cardapio: <Menu go={go}/>, carrinho: <Cart go={go}/>, pagamento: <Payment go={go}/> };
  return <CartContext.Provider value={{ cart, count, add, change, remove, clear }}><div className="app"><a className="skip-link" href="#conteudo">Ir para o conteúdo</a><Header go={go}/><div className="sr-only" role="status" aria-live="polite">{notice}</div>{pages[page] || pages.inicio}</div></CartContext.Provider>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);