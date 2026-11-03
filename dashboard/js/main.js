const { useState, useMemo, useEffect, useRef } = React;
const html = htm.bind(React.createElement);
const nf = new Intl.NumberFormat('pt-BR');
const dec = (v, d = 1) => v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
const TODAY = new Date('2026-10-15T12:00:00');

/* ---------- Dados fictícios ---------- */
const MONTHS = ['Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'];
const REVENUE = [3980, 4310, 3720, 3850, 4020, 4190, 4260, 4380, 4510, 4620, 4710, 4820];
const GOAL = [4000, 4100, 3900, 4000, 4100, 4200, 4300, 4400, 4500, 4600, 4700, 4800];
const HEADCOUNT = [281, 284, 286, 289, 293, 297, 301, 303, 306, 309, 311, 312];
const HIRES = [6, 5, 4, 5, 7, 6, 6, 4, 5, 6, 4, 3];
const EXITS = [3, 2, 2, 2, 3, 2, 2, 2, 2, 3, 2, 2];
const NEW_CLIENTS = [5, 4, 3, 4, 6, 5, 6, 5, 7, 6, 5, 6];
const LOST_CLIENTS = [2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 1];
const CLIENTS_ACTIVE = [107, 110, 111, 114, 118, 121, 126, 129, 135, 139, 143, 148];

const DEPTS = [
  { name: 'Tecnologia', n: 96, turnover: 8.9, abs: 1.6, enps: 54, salary: 14.8, color: 'var(--c-teal)' },
  { name: 'Operações', n: 68, turnover: 10.1, abs: 3.4, enps: 31, salary: 6.2, color: 'var(--c-blue)' },
  { name: 'Comercial', n: 42, turnover: 11.4, abs: 1.9, enps: 38, salary: 9.4, color: 'var(--c-amber)' },
  { name: 'Atendimento', n: 38, turnover: 12.0, abs: 3.1, enps: 27, salary: 4.6, color: 'var(--c-rose)' },
  { name: 'Financeiro', n: 18, turnover: 3.8, abs: 1.2, enps: 62, salary: 11.3, color: 'var(--c-lav)' },
  { name: 'Marketing', n: 16, turnover: 8.1, abs: 1.5, enps: 49, salary: 8.9, color: 'var(--c-teal)' },
  { name: 'RH', n: 14, turnover: 5.2, abs: 1.4, enps: 66, salary: 8.1, color: 'var(--c-blue)' },
  { name: 'Diretoria', n: 12, turnover: 1.9, abs: 0.7, enps: 68, salary: 32.0, color: 'var(--c-amber)' },
  { name: 'Jurídico', n: 8, turnover: 0.0, abs: 0.9, enps: 71, salary: 16.5, color: 'var(--c-rose)' },
];
const TENURE = [
  { name: 'Menos de 1 ano', value: 58 }, { name: '1 a 2 anos', value: 74 }, { name: '2 a 4 anos', value: 83 },
  { name: '4 a 7 anos', value: 56 }, { name: 'Mais de 7 anos', value: 41 },
];
const WORKMODE = [
  { name: 'Híbrido', value: 134, color: 'var(--c-teal)' },
  { name: 'Presencial', value: 128, color: 'var(--c-blue)' },
  { name: 'Remoto', value: 50, color: 'var(--c-amber)' },
];
const E = (name, cargo, depto, unidade, adm, status, perf) => {
  const [y, m] = adm.split('-').map(Number);
  return { name, cargo, depto, unidade, adm, status, perf, meses: (2026 - y) * 12 + (10 - m) };
};
const EMPLOYEES = [
  E('Helena Duarte', 'Gerente de Produto', 'Tecnologia', 'São Paulo', '2019-03', 'Ativo', 4.7),
  E('Rafael Moreira', 'Engenheiro de Software Sênior', 'Tecnologia', 'Recife', '2020-08', 'Ativo', 4.5),
  E('Camila Nogueira', 'Analista Financeira Pleno', 'Financeiro', 'São Paulo', '2021-02', 'Ativo', 4.2),
  E('Thiago Albuquerque', 'Executivo de Contas', 'Comercial', 'Recife', '2022-05', 'Ativo', 3.9),
  E('Beatriz Lacerda', 'Designer de Produto', 'Tecnologia', 'Remoto', '2023-01', 'Ativo', 4.4),
  E('Diego Fontes', 'Coordenador de Operações', 'Operações', 'Belo Horizonte', '2018-11', 'Ativo', 4.1),
  E('Larissa Pacheco', 'Analista de RH', 'RH', 'São Paulo', '2022-09', 'Férias', 4.3),
  E('Gustavo Ramalho', 'Analista de Suporte N2', 'Atendimento', 'Recife', '2026-03', 'Experiência', 3.6),
  E('Marina Teixeira', 'Analista de Marketing', 'Marketing', 'São Paulo', '2023-07', 'Ativo', 4.0),
  E('Felipe Castanheira', 'Advogado Corporativo', 'Jurídico', 'São Paulo', '2017-06', 'Ativo', 4.6),
  E('Juliana Brandão', 'Líder de Atendimento', 'Atendimento', 'Recife', '2019-10', 'Ativo', 4.4),
  E('Lucas Vasconcelos', 'Engenheiro de Dados', 'Tecnologia', 'Remoto', '2021-11', 'Ativo', 4.3),
  E('Patrícia Medeiros', 'Analista de Logística', 'Operações', 'Belo Horizonte', '2020-04', 'Afastado', 3.8),
  E('Rodrigo Siqueira', 'Gerente Comercial', 'Comercial', 'São Paulo', '2016-02', 'Ativo', 4.5),
  E('Aline Cavalcanti', 'Analista de BI', 'Tecnologia', 'Recife', '2022-12', 'Ativo', 4.2),
  E('Bruno Falcão', 'Técnico de Operações', 'Operações', 'Belo Horizonte', '2026-06', 'Experiência', 3.4),
  E('Vanessa Lins', 'Controller', 'Financeiro', 'São Paulo', '2018-05', 'Ativo', 4.8),
  E('Eduardo Pinheiro', 'Engenheiro SRE', 'Tecnologia', 'Remoto', '2023-09', 'Ativo', 4.1),
  E('Carolina Aragão', 'Analista de Customer Success', 'Atendimento', 'Recife', '2022-03', 'Ativo', 4.0),
  E('Henrique Bezerra', 'Diretor de Operações', 'Diretoria', 'São Paulo', '2015-01', 'Ativo', 4.7),
  E('Sofia Mendonça', 'Recrutadora', 'RH', 'Remoto', '2026-01', 'Experiência', 3.7),
  E('Matheus Guedes', 'Executivo de Contas', 'Comercial', 'Belo Horizonte', '2021-08', 'Férias', 4.0),
  E('Renata Almeida', 'Analista de Compliance', 'Jurídico', 'São Paulo', '2023-04', 'Ativo', 4.2),
  E('Igor Fernandes', 'Engenheiro de QA', 'Tecnologia', 'Recife', '2022-07', 'Ativo', 3.9),
];
const EVENTS = [
  { d: '22', m: 'out', t: 'Pesquisa de clima encerra', s: 'Participação atual: 81%' },
  { d: '27', m: 'out', t: 'Integração de 3 novos colaboradores', s: 'São Paulo e Recife' },
  { d: '01', m: 'nov', t: 'Data-base: reajuste coletivo', s: 'Folha de novembro' },
  { d: '03', m: 'nov', t: 'Início do ciclo de avaliação de desempenho', s: 'Prazo das autoavaliações: 14/11' },
];

const SEGMENTS = [
  { name: 'Varejo', value: 34, color: 'var(--c-teal)' },
  { name: 'Indústria', value: 27, color: 'var(--c-blue)' },
  { name: 'Saúde', value: 18, color: 'var(--c-amber)' },
  { name: 'Financeiro', value: 12, color: 'var(--c-rose)' },
  { name: 'Educação', value: 9, color: 'var(--c-lav)' },
];
const REGIONS = [
  { name: 'Sudeste', value: 61, color: 'var(--c-blue)' }, { name: 'Nordeste', value: 37, color: 'var(--c-blue)' },
  { name: 'Sul', value: 28, color: 'var(--c-blue)' }, { name: 'Centro-Oeste', value: 14, color: 'var(--c-blue)' },
  { name: 'Norte', value: 8, color: 'var(--c-blue)' },
];
const FUNNEL = [
  { name: 'Leads', v: 1240 }, { name: 'Qualificados', v: 486 }, { name: 'Propostas', v: 192 },
  { name: 'Negociação', v: 88 }, { name: 'Fechados', v: 41 },
];
const TICKETS = [
  { name: 'Acesso', value: 14, color: 'var(--c-teal)' }, { name: 'Integração', value: 18, color: 'var(--c-teal)' },
  { name: 'Faturamento', value: 12, color: 'var(--c-teal)' }, { name: 'Desempenho', value: 9, color: 'var(--c-teal)' },
  { name: 'Outros', value: 10, color: 'var(--c-teal)' },
];
const C = (name, seg, uf, mrr, health, fim, csm) => ({ name, seg, uf, mrr, health, fim, csm, dias: Math.round((new Date(fim + 'T12:00:00') - TODAY) / 86400000) });
const CLIENTS = [
  C('Supermercados Boa Safra', 'Varejo', 'PE', 412, 88, '2027-05-30', 'Ana Prado'),
  C('Metalúrgica Vale do Aço', 'Indústria', 'MG', 368, 81, '2027-02-14', 'Caio Ribeiro'),
  C('Hospital São Gabriel', 'Saúde', 'SP', 331, 74, '2026-12-18', 'Ana Prado'),
  C('Banco Cooperativo Horizonte', 'Financeiro', 'RS', 297, 92, '2027-08-01', 'Mônica Leal'),
  C('Rede Farma Popular', 'Varejo', 'BA', 264, 67, '2026-11-30', 'Caio Ribeiro'),
  C('Têxtil Cariri', 'Indústria', 'CE', 241, 79, '2027-03-22', 'Davi Sampaio'),
  C('Universidade Litoral', 'Educação', 'SC', 218, 85, '2027-01-10', 'Mônica Leal'),
  C('Distribuidora Rota 116', 'Varejo', 'GO', 196, 58, '2026-12-05', 'Davi Sampaio'),
  C('Laboratório Genomed', 'Saúde', 'SP', 187, 41, '2026-11-20', 'Ana Prado'),
  C('Química Paranaense', 'Indústria', 'PR', 173, 83, '2027-06-17', 'Caio Ribeiro'),
  C('Seguradora Pampa', 'Financeiro', 'RS', 164, 76, '2027-04-09', 'Mônica Leal'),
  C('Colégio Nova Aurora', 'Educação', 'PE', 121, 52, '2026-12-28', 'Davi Sampaio'),
  C('Clínica Vitalis', 'Saúde', 'DF', 109, 36, '2026-11-12', 'Ana Prado'),
  C('Financeira Ponte Sul', 'Financeiro', 'SC', 98, 90, '2027-09-03', 'Mônica Leal'),
];
const FEED = [
  { tone: 'var(--good)', t: 'Contrato renovado: Supermercados Boa Safra, 24 meses, R$ 412 mil por mês', time: 'há 12 min' },
  { tone: 'var(--bad)', t: 'Clínica Vitalis caiu para saúde 36 após três chamados sem resolução', time: 'há 48 min' },
  { tone: 'var(--info)', t: 'Três admissões confirmadas para a integração de 27/10', time: 'há 2 h' },
  { tone: 'var(--good)', t: 'Chamado crítico #4821 resolvido em 1 h 52 min, dentro do SLA', time: 'há 3 h' },
  { tone: 'var(--c-amber)', t: 'Proposta enviada à Distribuidora Rota 116: R$ 186 mil por mês', time: 'há 5 h' },
  { tone: 'var(--info)', t: 'Pesquisa de clima chegou a 81% de participação', time: 'ontem' },
  { tone: 'var(--good)', t: 'Meta de receita de outubro atingida em 100,4%', time: 'ontem' },
];

/* ---------- Utilidades ---------- */
function niceScale(min, max, n) {
  const span = max - min || 1;
  const step0 = span / n;
  const mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const norm = step0 / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
  const lo = Math.floor(min / step + 1e-9) * step;
  const hi = Math.ceil(max / step - 1e-9) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Math.round(v * 1000) / 1000);
  return { lo, hi, ticks };
}
function useWidth() {
  const ref = useRef(null);
  const [w, setW] = useState(640);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    setW(Math.max(260, Math.floor(el.clientWidth || 640)));
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(es => setW(Math.max(260, Math.floor(es[0].contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}
function useSort(rows, init) {
  const [k, setK] = useState(init.key);
  const [d, setD] = useState(init.dir);
  const sorted = useMemo(() => [...rows].sort((a, b) => {
    const x = a[k], y = b[k];
    const c = typeof x === 'string' ? x.localeCompare(y, 'pt-BR') : x - y;
    return d === 'asc' ? c : -c;
  }), [rows, k, d]);
  const toggle = key => { if (key === k) setD(d === 'asc' ? 'desc' : 'asc'); else { setK(key); setD('desc'); } };
  return { sorted, k, d, toggle };
}
const hueOf = s => { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 360; return h; };
const initials = s => s.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('');
const tenureText = m => (m >= 12 ? Math.floor(m / 12) + ' a ' + (m % 12) + ' m' : m + ' meses');
const brDate = iso => iso.split('-').reverse().join('/');

/* ---------- Componentes base ---------- */
const Icon = ({ name }) => {
  const paths = {
    grid: html`<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />`,
    users: html`<g><circle cx="9.5" cy="8" r="3.2" /><path d="M3.5 19v-1.4A3.6 3.6 0 0 1 7.1 14h4.8a3.6 3.6 0 0 1 3.6 3.6V19" /><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M20.5 19v-1.2a3.3 3.3 0 0 0-2.3-3.1" /></g>`,
    building: html`<path d="M5 20V5l8-2v17M13 8h6v12M3 20h18M8 8h2M8 12h2M8 16h2" />`,
  };
  return html`<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
};
const Card = ({ title, sub, right, children }) => html`
  <section className="card">
    ${(title || right) && html`<header className="card-h"><div><h3>${title}</h3>${sub && html`<p>${sub}</p>`}</div>${right}</header>`}
    ${children}
  </section>`;
const Pill = ({ tone, children }) => html`<span className=${'pill ' + (tone || '')}>${children}</span>`;
const Delta = ({ v, good = 'up', unit = '%', digits = 1 }) => {
  const pos = (v > 0) === (good === 'up');
  const tone = v === 0 ? 'flat' : pos ? 'good' : 'bad';
  const txt = (v > 0 ? '+' : '') + dec(v, digits) + unit;
  return html`<span className=${'delta ' + tone}>${v > 0 ? '▲' : v < 0 ? '▼' : '■'} ${txt}</span>`;
};
const Spark = ({ data, color }) => {
  const mn = Math.min(...data), mx = Math.max(...data), r = (mx - mn) || 1;
  const pts = data.map((v, i) => [100 * i / (data.length - 1), 100 * (1 - (v - mn) / r)]);
  const d = 'M' + pts.map(p => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join('L');
  const last = pts[pts.length - 1];
  return html`<div className="spark-wrap"><div className="spark-in">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d=${d + 'L100 100L0 100Z'} style=${{ fill: color, opacity: 0.14 }} />
      <path d=${d} fill="none" style=${{ stroke: color }} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
    <i className="spark-dot" style=${{ top: last[1] + '%', background: color }}></i>
  </div></div>`;
};
const Kpi = ({ label, value, unit, delta, good, dUnit, dDigits, note, spark, color = 'var(--accent)' }) => html`
  <div className="kpi">
    <span className="lbl">${label}</span>
    <div className="kpi-val"><b>${value}</b>${unit && html`<small>${unit}</small>`}</div>
    <div className="kpi-foot">${delta != null && html`<${Delta} v=${delta} good=${good} unit=${dUnit} digits=${dDigits} />`}<span>${note}</span></div>
    ${spark && html`<${Spark} data=${spark} color=${color} />`}
  </div>`;
const Legend = ({ items }) => html`<div className="legend">${items.map(s => html`<span key=${s.name}><i style=${{ background: s.color }}></i>${s.name}</span>`)}</div>`;
const Tip = ({ pct, title, rows }) => html`
  <div className="tip" style=${{ left: pct + '%', transform: pct > 68 ? 'translateX(-100%)' : pct < 32 ? 'translateX(0)' : 'translateX(-50%)' }}>
    <b>${title}</b>
    ${rows.map(r => html`<div key=${r.name}><i style=${{ background: r.color }}></i>${r.name}<span>${r.value}</span></div>`)}
  </div>`;

function LineChart({ uid, labels, series, fmt, axisFmt, height = 250 }) {
  const [ref, W] = useWidth();
  const [hi, setHi] = useState(null);
  const H = height, L = 46, R = 14, T = 14, B = 28;
  const all = series.flatMap(s => s.data);
  const sc = niceScale(Math.min(...all), Math.max(...all), 4);
  const n = labels.length;
  const step = (W - L - R) / (n - 1);
  const x = i => L + step * i;
  const y = v => T + (H - T - B) * (1 - (v - sc.lo) / (sc.hi - sc.lo));
  const path = s => 'M' + s.data.map((v, i) => x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join('L');
  const every = W < 480 ? 2 : 1;
  return html`<div className="chart" ref=${ref} onMouseLeave=${() => setHi(null)}>
    <svg width=${W} height=${H} viewBox=${'0 0 ' + W + ' ' + H} role="img" aria-label=${series.map(s => s.name).join(' e ') + ' por mês'}>
      <defs>${series.map((s, i) => s.area && html`<linearGradient key=${i} id=${uid + i} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" style=${{ stopColor: s.color, stopOpacity: 0.28 }} /><stop offset="100%" style=${{ stopColor: s.color, stopOpacity: 0 }} /></linearGradient>`)}</defs>
      ${sc.ticks.map(t => html`<g key=${t}><line className="grid" x1=${L} x2=${W - R} y1=${y(t)} y2=${y(t)} /><text className="ax" x=${L - 8} y=${y(t) + 4} textAnchor="end">${axisFmt(t)}</text></g>`)}
      ${labels.map((l, i) => i % every === 0 && html`<text key=${l + i} className="ax" x=${x(i)} y=${H - 8} textAnchor="middle">${l}</text>`)}
      ${hi != null && html`<line x1=${x(hi)} x2=${x(hi)} y1=${T} y2=${H - B} style=${{ stroke: 'var(--line-2)' }} />`}
      ${series.map((s, i) => html`<g key=${s.name}>
        ${s.area && html`<path d=${path(s) + 'L' + x(n - 1) + ' ' + y(sc.lo) + 'L' + x(0) + ' ' + y(sc.lo) + 'Z'} fill=${'url(#' + uid + i + ')'} />`}
        <path d=${path(s)} fill="none" style=${{ stroke: s.color }} strokeWidth=${s.dash ? 1.6 : 2.2} strokeDasharray=${s.dash ? '5 4' : undefined} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx=${x(hi != null ? hi : n - 1)} cy=${y(s.data[hi != null ? hi : n - 1])} r=${s.dash ? 0 : 4.5} style=${{ fill: s.color, stroke: 'var(--surface)' }} strokeWidth="2" />
      </g>`)}
      ${labels.map((l, i) => html`<rect key=${'h' + i} x=${x(i) - step / 2} y=${T} width=${step} height=${H - T - B} fill="transparent" onMouseEnter=${() => setHi(i)} onTouchStart=${() => setHi(i)} />`)}
    </svg>
    ${hi != null && html`<${Tip} pct=${x(hi) / W * 100} title=${labels[hi]} rows=${series.map(s => ({ name: s.name, color: s.color, value: (s.fmt || fmt)(s.data[hi]) }))} />`}
  </div>`;
}

function FlowBars({ labels, up, down, upName, downName, height = 230 }) {
  const [ref, W] = useWidth();
  const [hi, setHi] = useState(null);
  const H = height, L = 36, R = 10, T = 12, B = 28;
  const sc = niceScale(-Math.max(...down), Math.max(...up), 4);
  const n = labels.length, step = (W - L - R) / n, bw = Math.min(22, step * 0.58);
  const cx = i => L + step * (i + 0.5);
  const y = v => T + (H - T - B) * (1 - (v - sc.lo) / (sc.hi - sc.lo));
  const every = W < 420 ? 2 : 1;
  return html`<div className="chart" ref=${ref} onMouseLeave=${() => setHi(null)}>
    <svg width=${W} height=${H} viewBox=${'0 0 ' + W + ' ' + H} role="img" aria-label=${upName + ' e ' + downName + ' por mês'}>
      ${sc.ticks.map(t => html`<g key=${t}><line className=${t === 0 ? 'zero' : 'grid'} x1=${L} x2=${W - R} y1=${y(t)} y2=${y(t)} /><text className="ax" x=${L - 8} y=${y(t) + 4} textAnchor="end">${t}</text></g>`)}
      ${hi != null && html`<rect className="hover-bg" x=${cx(hi) - step / 2} y=${T} width=${step} height=${H - T - B} rx="4" />`}
      ${labels.map((l, i) => html`<g key=${l + i}>
        <rect x=${cx(i) - bw / 2} y=${y(up[i])} width=${bw} height=${y(0) - y(up[i])} rx="2" style=${{ fill: 'var(--c-teal)' }} />
        <rect x=${cx(i) - bw / 2} y=${y(0)} width=${bw} height=${y(-down[i]) - y(0)} rx="2" style=${{ fill: 'var(--c-rose)' }} />
        ${i % every === 0 && html`<text className="ax" x=${cx(i)} y=${H - 8} textAnchor="middle">${l}</text>`}
        <rect x=${cx(i) - step / 2} y=${T} width=${step} height=${H - T - B} fill="transparent" onMouseEnter=${() => setHi(i)} onTouchStart=${() => setHi(i)} />
      </g>`)}
    </svg>
    ${hi != null && html`<${Tip} pct=${cx(hi) / W * 100} title=${labels[hi]} rows=${[
      { name: upName, color: 'var(--c-teal)', value: '+' + up[hi] },
      { name: downName, color: 'var(--c-rose)', value: '−' + down[hi] },
      { name: 'Saldo', color: 'var(--faint)', value: (up[hi] - down[hi] > 0 ? '+' : '') + (up[hi] - down[hi]) },
    ]} />`}
  </div>`;
}

const BarList = ({ items, max, fmt = v => nf.format(v) }) => {
  const mx = max || Math.max(...items.map(i => i.value));
  return html`<div className="blist">${items.map(i => html`
    <div className="brow" key=${i.name}>
      <span className="nm" title=${i.name}>${i.name}</span>
      <div className="track"><div className="fill" style=${{ width: (i.value / mx * 100) + '%', background: i.color || 'var(--c-teal)' }}></div></div>
      <span className="vl">${fmt(i.value)}</span>
    </div>`)}</div>`;
};

function Donut({ items, big, small, fmt = v => v + '%' }) {
  const [hov, setHov] = useState(null);
  const total = items.reduce((a, b) => a + b.value, 0);
  const r = 58, C2 = 2 * Math.PI * r, gap = 3;
  let acc = 0;
  const shown = hov != null ? items[hov] : null;
  return html`<div className="donut-wrap">
    <svg className="donut" viewBox="0 0 150 150" role="img" aria-label="Distribuição">
      <g transform="rotate(-90 75 75)">
        ${items.map((it, i) => {
          const len = it.value / total * C2;
          const el = html`<circle key=${it.name} cx="75" cy="75" r=${r} fill="none" strokeWidth="16" style=${{ stroke: it.color, opacity: hov == null || hov === i ? 1 : 0.3 }} strokeDasharray=${Math.max(len - gap, 1) + ' ' + (C2 - len + gap)} strokeDashoffset=${-acc} />`;
          acc += len;
          return el;
        })}
      </g>
      <text x="75" y="76" textAnchor="middle" style=${{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 600 }}>${shown ? fmt(shown.value) : big}</text>
      <text x="75" y="94" textAnchor="middle" className="ax">${shown ? shown.name : small}</text>
    </svg>
    <div className="dleg">${items.map((it, i) => html`
      <button type="button" key=${it.name} onMouseEnter=${() => setHov(i)} onMouseLeave=${() => setHov(null)} onFocus=${() => setHov(i)} onBlur=${() => setHov(null)}>
        <i style=${{ background: it.color }}></i><span>${it.name}</span><em>${fmt(it.value)}</em>
      </button>`)}</div>
  </div>`;
}

const Funnel = ({ steps }) => html`<div className="funnel">${steps.map((s, i) => html`
  <div className="f-row" key=${s.name}>
    <div className="f-bar" style=${{ width: Math.max(16, s.v / steps[0].v * 100) + '%', background: 'color-mix(in srgb, var(--c-blue) ' + (100 - i * 15) + '%, var(--surface-2))' }}>${nf.format(s.v)}</div>
    <div className="f-meta"><b>${s.name}</b>${i > 0 && html`<em>${dec(s.v / steps[i - 1].v * 100, 0)}% da etapa anterior</em>`}</div>
  </div>`)}</div>`;

const Th = ({ k, label, s, right }) => html`
  <th className=${right ? 'r' : ''} aria-sort=${s.k === k ? (s.d === 'asc' ? 'ascending' : 'descending') : 'none'}>
    <button type="button" onClick=${() => s.toggle(k)}>${label}<span className="car">${s.k === k ? (s.d === 'asc' ? '▲' : '▼') : ''}</span></button>
  </th>`;
const Avatar = ({ name }) => html`<span className="av" style=${{ background: 'hsl(' + hueOf(name) + ' 32% 28%)' }}>${initials(name)}</span>`;
const Meter = ({ v, max, color }) => html`<div className="meter"><div className="track"><div className="fill" style=${{ width: (v / max * 100) + '%', background: color }}></div></div><span>${max === 5 ? dec(v, 1) : v}</span></div>`;
const healthColor = h => (h >= 75 ? 'var(--good)' : h >= 50 ? 'var(--warn)' : 'var(--bad)');
const statusTone = { Ativo: 'good', Férias: 'info', Afastado: 'warn', Experiência: 'info' };

/* ---------- Tabelas ---------- */
function EmployeeTable({ q }) {
  const [dept, setDept] = useState('Todos');
  const [all, setAll] = useState(false);
  const rows = useMemo(() => EMPLOYEES.filter(e => (dept === 'Todos' || e.depto === dept) && (e.name + ' ' + e.cargo + ' ' + e.depto).toLowerCase().includes(q.toLowerCase())), [dept, q]);
  const s = useSort(rows, { key: 'meses', dir: 'desc' });
  const list = all ? s.sorted : s.sorted.slice(0, 10);
  return html`<${Card} title="Colaboradores" sub="Amostra do quadro de 312 pessoas"
    right=${html`<select id="f-dept" className="btn" aria-label="Filtrar por departamento" value=${dept} onChange=${e => setDept(e.target.value)}><option>Todos</option>${DEPTS.map(d => html`<option key=${d.name}>${d.name}</option>`)}</select>`}>
    <div className="tbl-wrap"><table>
      <thead><tr>
        <${Th} k="name" label="Nome" s=${s} /><${Th} k="depto" label="Departamento" s=${s} /><${Th} k="unidade" label="Unidade" s=${s} />
        <${Th} k="meses" label="Tempo de casa" s=${s} /><${Th} k="status" label="Situação" s=${s} /><${Th} k="perf" label="Desempenho" s=${s} />
      </tr></thead>
      <tbody>${list.map(e => html`<tr key=${e.name}>
        <td><div className="who"><${Avatar} name=${e.name} /><div><b>${e.name}</b><span>${e.cargo}</span></div></div></td>
        <td>${e.depto}</td><td>${e.unidade}</td>
        <td className="num">${tenureText(e.meses)}</td>
        <td><${Pill} tone=${statusTone[e.status]}>${e.status}<//></td>
        <td><${Meter} v=${e.perf} max=${5} color=${e.perf >= 4.2 ? 'var(--c-teal)' : e.perf >= 3.8 ? 'var(--c-blue)' : 'var(--c-amber)'} /></td>
      </tr>`)}
      ${list.length === 0 && html`<tr><td colSpan="6" className="muted">Nenhum colaborador encontrado para esse filtro.</td></tr>`}</tbody>
    </table></div>
    <div className="tfoot"><span>Mostrando ${list.length} de ${rows.length}</span>${rows.length > 10 && html`<button type="button" className="btn" onClick=${() => setAll(!all)}>${all ? 'Mostrar menos' : 'Ver todos'}</button>`}</div>
  <//>`;
}

function ClientTable({ q }) {
  const rows = useMemo(() => CLIENTS.filter(c => (c.name + ' ' + c.seg).toLowerCase().includes(q.toLowerCase())).map(c => ({ ...c, status: c.health >= 75 ? 'Saudável' : c.health >= 50 ? 'Atenção' : 'Risco' })), [q]);
  const s = useSort(rows, { key: 'mrr', dir: 'desc' });
  const tone = { Saudável: 'good', Atenção: 'warn', Risco: 'bad' };
  return html`<${Card} title="Principais clientes" sub="Ordenados por receita mensal recorrente (MRR)">
    <div className="tbl-wrap"><table>
      <thead><tr>
        <${Th} k="name" label="Cliente" s=${s} /><${Th} k="seg" label="Segmento" s=${s} /><${Th} k="mrr" label="MRR" s=${s} right />
        <${Th} k="health" label="Saúde da conta" s=${s} /><${Th} k="dias" label="Renovação" s=${s} /><${Th} k="status" label="Situação" s=${s} />
      </tr></thead>
      <tbody>${s.sorted.map(c => html`<tr key=${c.name}>
        <td><div className="who"><${Avatar} name=${c.name} /><div><b>${c.name}</b><span>${c.uf} · CSM ${c.csm}</span></div></div></td>
        <td>${c.seg}</td>
        <td className="num r">R$ ${nf.format(c.mrr)} mil</td>
        <td><${Meter} v=${c.health} max=${100} color=${healthColor(c.health)} /></td>
        <td className="num">${brDate(c.fim)}<br /><span className="muted">${c.dias} dias</span></td>
        <td><${Pill} tone=${tone[c.status]}>${c.status}<//></td>
      </tr>`)}
      ${s.sorted.length === 0 && html`<tr><td colSpan="6" className="muted">Nenhum cliente encontrado.</td></tr>`}</tbody>
    </table></div>
  <//>`;
}

function DeptTable() {
  const s = useSort(DEPTS, { key: 'n', dir: 'desc' });
  const tt = v => (v >= 11 ? 'bad' : v >= 8 ? 'warn' : 'good');
  const at = v => (v >= 3 ? 'bad' : v >= 2 ? 'warn' : 'good');
  const et = v => (v >= 50 ? 'good' : v >= 35 ? 'warn' : 'bad');
  return html`<${Card} title="Indicadores por departamento" sub="Turnover em 12 meses, absenteísmo do mês e eNPS">
    <div className="tbl-wrap"><table style=${{ minWidth: 560 }}>
      <thead><tr><${Th} k="name" label="Departamento" s=${s} /><${Th} k="n" label="Pessoas" s=${s} right /><${Th} k="turnover" label="Turnover" s=${s} right /><${Th} k="abs" label="Absenteísmo" s=${s} right /><${Th} k="enps" label="eNPS" s=${s} right /><${Th} k="salary" label="Salário médio" s=${s} right /></tr></thead>
      <tbody>${s.sorted.map(d => html`<tr key=${d.name}>
        <td><b>${d.name}</b></td>
        <td className="num r">${d.n}</td>
        <td className="r"><${Pill} tone=${tt(d.turnover)}>${dec(d.turnover)}%<//></td>
        <td className="r"><${Pill} tone=${at(d.abs)}>${dec(d.abs)}%<//></td>
        <td className="r"><${Pill} tone=${et(d.enps)}>${d.enps}<//></td>
        <td className="num r">R$ ${dec(d.salary)} mil</td>
      </tr>`)}</tbody>
    </table></div>
  <//>`;
}

/* ---------- Telas ---------- */
const mil = v => 'R$ ' + dec(v / 1000, 2) + ' mi';

function Overview() {
  const alerts = [
    { tone: 'bad', tag: 'Crítico', t: '2 contas com saúde abaixo de 50', d: 'Clínica Vitalis e Laboratório Genomed somam R$ 296 mil de MRR.' },
    { tone: 'warn', tag: 'Atenção', t: 'Absenteísmo de Operações em 3,4%', d: 'Meta do departamento é 2,5%. Maior alta desde abril.' },
    { tone: 'warn', tag: 'Atenção', t: '14 vagas abertas, 4 há mais de 45 dias', d: 'Três delas em Tecnologia, uma em Atendimento.' },
    { tone: 'info', tag: 'Prazo', t: '4 renovações nos próximos 60 dias', d: 'R$ 756 mil de MRR entre Vitalis, Genomed, Farma Popular e Rota 116.' },
  ];
  return html`<${React.Fragment}>
    <div className="row kpis">
      <${Kpi} label="Receita do mês" value=${mil(4820)} delta=${2.3} note="100,4% da meta" spark=${REVENUE} color="var(--c-teal)" />
      <${Kpi} label="Clientes ativos" value="148" delta=${3.5} note="+5 no mês" spark=${CLIENTS_ACTIVE} color="var(--c-blue)" />
      <${Kpi} label="Colaboradores" value="312" delta=${0.3} note="+1 no mês" spark=${HEADCOUNT} color="var(--c-amber)" />
      <${Kpi} label="Receita por colaborador" value="R$ 15,4" unit="mil" delta=${2.0} note="vs mês anterior" spark=${REVENUE.map((r, i) => r / HEADCOUNT[i])} color="var(--c-lav)" />
      <${Kpi} label="NPS de clientes" value="62" delta=${4} dUnit=" pts" dDigits=${0} note="zona de qualidade" spark=${[52, 54, 53, 55, 57, 56, 58, 59, 60, 59, 61, 62]} color="var(--c-teal)" />
      <${Kpi} label="eNPS de colaboradores" value="46" delta=${3} dUnit=" pts" dDigits=${0} note="pesquisa de set." spark=${[38, 39, 39, 41, 40, 42, 43, 43, 44, 44, 45, 46]} color="var(--c-rose)" />
    </div>
    <div className="row two">
      <${Card} title="Receita mensal e meta" sub="Em milhões de reais, últimos 12 meses" right=${html`<${Legend} items=${[{ name: 'Receita', color: 'var(--c-teal)' }, { name: 'Meta', color: 'var(--faint)' }]} />`}>
        <${LineChart} uid="ov-rev" labels=${MONTHS} fmt=${v => 'R$ ' + dec(v / 1000, 2) + ' mi'} axisFmt=${v => dec(v / 1000, 1)}
          series=${[{ name: 'Receita', data: REVENUE, color: 'var(--c-teal)', area: true }, { name: 'Meta', data: GOAL, color: 'var(--faint)', dash: true }]} />
      <//>
      <${Card} title="Receita por segmento" sub="Participação no mês de outubro">
        <${Donut} items=${SEGMENTS} big="R$ 4,82 mi" small="receita total" />
      <//>
    </div>
    <div className="row two-eq">
      <${Card} title="Pessoas por departamento" sub="312 colaboradores">
        <${BarList} items=${DEPTS.map(d => ({ name: d.name, value: d.n, color: d.color }))} />
      <//>
      <${Card} title="Precisa de atenção" sub="Itens que pedem decisão esta semana">
        <ul className="alerts">${alerts.map(a => html`<li key=${a.t}><div><b>${a.t}</b><span className="d">${a.d}</span></div><${Pill} tone=${a.tone}>${a.tag}<//></li>`)}</ul>
      <//>
    </div>
    <${Card} title="Atividade recente" sub="Clientes, pessoas e atendimento">
      <ul className="feed" style=${{ margin: 0, padding: 0 }}>${FEED.map(f => html`<li key=${f.t}><i className="dot" style=${{ background: f.tone }}></i><div><p>${f.t}</p><time>${f.time}</time></div></li>`)}</ul>
    <//>
  <//>`;
}

function Employees({ q }) {
  return html`<${React.Fragment}>
    <div className="row kpis">
      <${Kpi} label="Quadro atual" value="312" unit="pessoas" delta=${0.3} note="+1 no mês" spark=${HEADCOUNT} color="var(--c-teal)" />
      <${Kpi} label="Turnover em 12 meses" value="9,1%" delta=${-0.6} good="down" dUnit=" pp" note="27 desligamentos" spark=${[10.4, 10.2, 10.1, 9.9, 9.8, 9.7, 9.6, 9.5, 9.4, 9.3, 9.2, 9.1]} color="var(--c-amber)" />
      <${Kpi} label="Absenteísmo" value="2,4%" delta=${0.2} good="down" dUnit=" pp" note="meta: 2,5%" spark=${[2.1, 2.2, 2.6, 2.3, 2.2, 2.1, 2.2, 2.3, 2.2, 2.3, 2.2, 2.4]} color="var(--c-rose)" />
      <${Kpi} label="Vagas abertas" value="14" delta=${2} good="down" dUnit="" dDigits=${0} note="4 há mais de 45 dias" spark=${[9, 10, 12, 11, 10, 12, 13, 12, 11, 12, 12, 14]} color="var(--c-blue)" />
      <${Kpi} label="eNPS" value="46" delta=${3} dUnit=" pts" dDigits=${0} note="81% de participação" spark=${[38, 39, 39, 41, 40, 42, 43, 43, 44, 44, 45, 46]} color="var(--c-lav)" />
      <${Kpi} label="Custo da folha" value="R$ 3,12" unit="mi/mês" delta=${0.5} good="down" note="inclui encargos" spark=${[2.88, 2.9, 2.92, 2.95, 2.98, 3.0, 3.03, 3.05, 3.07, 3.09, 3.11, 3.12]} color="var(--c-amber)" />
    </div>
    <div className="row two-eq">
      <${Card} title="Evolução do quadro" sub="Colaboradores ao fim de cada mês">
        <${LineChart} uid="emp-hc" labels=${MONTHS} fmt=${v => nf.format(v) + ' pessoas'} axisFmt=${v => v}
          series=${[{ name: 'Quadro', data: HEADCOUNT, color: 'var(--c-teal)', area: true }]} />
      <//>
      <${Card} title="Admissões e desligamentos" sub="Entradas acima da linha, saídas abaixo" right=${html`<${Legend} items=${[{ name: 'Admissões', color: 'var(--c-teal)' }, { name: 'Desligamentos', color: 'var(--c-rose)' }]} />`}>
        <${FlowBars} labels=${MONTHS} up=${HIRES} down=${EXITS} upName="Admissões" downName="Desligamentos" />
      <//>
    </div>
    <div className="row two">
      <${DeptTable} />
      <div className="row" style=${{ alignContent: 'start' }}>
        <${Card} title="Tempo de casa" sub="Distribuição do quadro">
          <${BarList} items=${TENURE.map(t => ({ ...t, color: 'var(--c-blue)' }))} />
        <//>
        <${Card} title="Modelo de trabalho">
          <${Donut} items=${WORKMODE} big="312" small="pessoas" fmt=${v => nf.format(v)} />
        <//>
      </div>
    </div>
    <${EmployeeTable} q=${q} />
    <${Card} title="Próximos eventos de pessoas">
      <ul className="events">${EVENTS.map(e => html`<li key=${e.t}><div className="date"><b>${e.d}</b><span>${e.m}</span></div><div><p>${e.t}</p><small>${e.s}</small></div></li>`)}</ul>
    <//>
  <//>`;
}

function Clients({ q }) {
  return html`<${React.Fragment}>
    <div className="row kpis">
      <${Kpi} label="Clientes ativos" value="148" delta=${3.5} note="6 novos, 1 perdido" spark=${CLIENTS_ACTIVE} color="var(--c-blue)" />
      <${Kpi} label="Receita recorrente (MRR)" value=${mil(4820)} delta=${2.3} note="vs setembro" spark=${REVENUE} color="var(--c-teal)" />
      <${Kpi} label="Ticket médio" value="R$ 32,6" unit="mil" delta=${-1.0} note="por cliente, mês" spark=${REVENUE.map((r, i) => r / CLIENTS_ACTIVE[i])} color="var(--c-amber)" />
      <${Kpi} label="Churn mensal" value="0,7%" delta=${-0.5} good="down" dUnit=" pp" note="1 cancelamento" spark=${LOST_CLIENTS} color="var(--c-rose)" />
      <${Kpi} label="NPS" value="62" delta=${4} dUnit=" pts" dDigits=${0} note="CSAT 4,6 de 5" spark=${[52, 54, 53, 55, 57, 56, 58, 59, 60, 59, 61, 62]} color="var(--c-lav)" />
      <${Kpi} label="Chamados dentro do SLA" value="94,2%" delta=${1.1} note="63 em aberto" spark=${[90.1, 91.0, 90.4, 91.8, 92.5, 92.2, 93.0, 93.4, 93.1, 93.8, 94.1, 94.2]} color="var(--c-teal)" />
    </div>
    <div className="row two">
      <${Card} title="Receita recorrente mensal" sub="Em milhões de reais" right=${html`<${Legend} items=${[{ name: 'MRR', color: 'var(--c-teal)' }]} />`}>
        <${LineChart} uid="cli-mrr" labels=${MONTHS} fmt=${v => 'R$ ' + dec(v / 1000, 2) + ' mi'} axisFmt=${v => dec(v / 1000, 1)}
          series=${[{ name: 'MRR', data: REVENUE, color: 'var(--c-teal)', area: true }]} />
      <//>
      <${Card} title="Receita por segmento" sub="Participação no MRR">
        <${Donut} items=${SEGMENTS} big="148" small="clientes" />
      <//>
    </div>
    <div className="row three">
      <${Card} title="Novos e cancelados" sub="Clientes por mês" right=${html`<${Legend} items=${[{ name: 'Novos', color: 'var(--c-teal)' }, { name: 'Cancelados', color: 'var(--c-rose)' }]} />`}>
        <${FlowBars} labels=${MONTHS} up=${NEW_CLIENTS} down=${LOST_CLIENTS} upName="Novos clientes" downName="Cancelamentos" />
      <//>
      <${Card} title="Funil comercial" sub="Últimos 90 dias, 41 contratos fechados">
        <${Funnel} steps=${FUNNEL} />
      <//>
      <${Card} title="Clientes por região" sub="148 contratos ativos">
        <${BarList} items=${REGIONS} />
      <//>
    </div>
    <${ClientTable} q=${q} />
    <div className="row two-eq">
      <${Card} title="Atendimento" sub="Chamados em aberto por categoria">
        <div className="statgrid">
          <div className="stat"><span>Em aberto</span><b>63</b></div>
          <div className="stat"><span>Tempo médio de resposta</span><b>3 h 12 min</b></div>
          <div className="stat"><span>CSAT</span><b>4,6 / 5</b></div>
          <div className="stat"><span>Críticos hoje</span><b>2</b></div>
        </div>
        <${BarList} items=${TICKETS} />
      <//>
      <${Card} title="Atividade recente" sub="Contas e contratos">
        <ul className="feed" style=${{ margin: 0, padding: 0 }}>${FEED.filter((f, i) => [0, 1, 3, 4, 6].includes(i)).map(f => html`<li key=${f.t}><i className="dot" style=${{ background: f.tone }}></i><div><p>${f.t}</p><time>${f.time}</time></div></li>`)}</ul>
      <//>
    </div>
  <//>`;
}

function App() {
  const [view, setView] = useState('geral');
  const [q, setQ] = useState('');
  const nav = [['geral', 'Visão geral', 'grid'], ['func', 'Funcionários', 'users'], ['cli', 'Clientes', 'building']];
  const head = {
    geral: ['Visão geral', 'Resumo da empresa, clientes e pessoas em outubro de 2026'],
    func: ['Funcionários', '312 colaboradores em 4 unidades, com quadro, turnover e clima'],
    cli: ['Clientes', '148 contas ativas, receita recorrente e atendimento'],
  }[view];
  return html`<div className="shell">
    <aside className="side">
      <div className="brand"><div className="mark">A</div><div><b>Atlântica</b><span>Soluções empresariais</span></div></div>
      <nav className="nav" aria-label="Seções">${nav.map(n => html`<button type="button" key=${n[0]} aria-current=${view === n[0] ? 'page' : undefined} onClick=${() => { setView(n[0]); setQ(''); }}><${Icon} name=${n[2]} />${n[1]}</button>`)}</nav>
      <p className="side-foot">Dados fictícios criados para demonstração. Nomes, valores e empresas não representam pessoas ou organizações reais.</p>
    </aside>
    <main className="main" id="conteudo">
      <header className="top">
        <div><h1>${head[0]}</h1><p>${head[1]}</p></div>
        <div className="tools">
          ${view !== 'geral' && html`<input id="q" className="search" type="search" placeholder=${view === 'func' ? 'Buscar colaborador ou cargo' : 'Buscar cliente ou segmento'} aria-label="Buscar" value=${q} onChange=${e => setQ(e.target.value)} />`}
          <span className="chip">nov/2025 a out/2026</span>
        </div>
      </header>
      ${view === 'geral' && html`<${Overview} />`}
      ${view === 'func' && html`<${Employees} q=${q} />`}
      ${view === 'cli' && html`<${Clients} q=${q} />`}
    </main>
  </div>`;
}

ReactDOM.createRoot(document.getElementById('root')).render(html`<${App} />`);
