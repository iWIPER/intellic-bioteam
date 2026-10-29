import * as D from "./dados.js";
import * as K from "./calculo.js";

const { LIMITE, PROBLEMA, CRIT, ESP, EQUIPE, CORES, TAREFAS, STATS, LEIT, FONTES } = D;

function fontesAgente(a) {
  const f = FONTES[a.id];
  if (!f) return "";
  return `<div class="card" style="margin-top:22px"><h3>${ic("bookmark", 20, "#ffb347")}De onde vêm os argumentos</h3>
    <p class="lead" style="margin-bottom:14px">${esc(f.intro)}</p>
    <ol class="fontes">${f.itens.map(([org, txt, url]) => `<li><b>${esc(org)}</b><span>${esc(txt)}</span>
      <a href="${url}" target="_blank" rel="noopener">Ver a fonte ↗</a></li>`).join("")}</ol></div>`;
}
const { arred, classificar, COR_ESTADO, calcular, CALC, GC, GI, ESTADO } = K;

// ============================================================ utilitários
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const sinal = v => (v > 0 ? "+" : v < 0 ? "−" : "+") + Math.abs(v);
// URL absoluta: uma url() dentro de variável CSS é resolvida a partir do styles.css, não da página.
const ICONES = new URL("../icons/", import.meta.url).href;
const ic = (nome, tam = 20, cor = "currentColor") => `<i class="ic" aria-hidden="true" style="--m:url('${ICONES}${nome}.svg');--s:${tam}px;--c:${cor}"></i>`;
function leitura(c, d) {
  if (c >= 5 && d < 5) return ["Convicção", "#2fbf71"];
  if (c >= 5) return ["Contradição", "#ff7a1a"];
  if (d < 5) return ["Falta de informação", "#8fb0e0"];
  return ["Incerteza", "#d4a017"];
}
const badge = e => `<span class="estado" style="--e:${COR_ESTADO[e]}">${e}</span>`;
const titulo = (icone, txt, lead = "", cls = "") => `<h2 class="titulo ${cls}">${ic(icone, cls ? 24 : 30, "#ffb347")}${txt}</h2>${lead ? `<p class="lead">${lead}</p>` : ""}`;
function lerGC(v) {
  if (v >= LIMITE) return "Funciona: os especialistas têm evidência forte a favor.";
  if (v > 0) return "Pende para “funciona”, mas sem força para chegar ao limite.";
  if (v === 0) return "Empate: o argumento a favor e o contra se anulam.";
  if (v > -LIMITE) return `Praticamente empate, levemente para o lado do “não funciona” (${sinal(v)}%).`;
  return "Não funciona: evidência forte contra.";
}
function lerGI(v) {
  if (v >= LIMITE) return "Contradição demais: resultado descartado.";
  if (v > 0) return "Um pouco de contradição: há notas altas a favor e contra ao mesmo tempo.";
  if (v === 0) return "Equilíbrio: nem contradição, nem falta de informação. Os especialistas se compensam.";
  if (v > -LIMITE) return "Um pouco de falta de informação: notas baixas a favor e contra.";
  return "Falta de informação demais: resultado descartado.";
}

// ---- quadro Reels (robô do agente ou caricatura da equipe)
const REEL_CSS = `:root{color-scheme:dark}html,body{margin:0;height:100%;background:transparent!important;overflow:hidden}.stars{display:none!important}
.robo{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:16% 0 34%}
.robo svg{height:100%!important;width:auto!important;max-width:90%!important;margin:0!important;overflow:visible;filter:drop-shadow(0 14px 22px rgba(0,0,0,.45))}
@media(prefers-reduced-motion:reduce){*{animation:none!important}}`;
const cacheRobo = {};
async function roboHTML(id) {
  if (!cacheRobo[id]) cacheRobo[id] = fetch(`assets/agentes/${id}.html`).then(r => r.text()).then(t => {
    const doc = new DOMParser().parseFromString(t, "text/html");
    const css = [...doc.querySelectorAll("style")].map(s => s.textContent).join("\n");
    const svg = doc.querySelector("svg");
    return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style><style>${REEL_CSS}</style></head><body><div class="robo">${svg ? svg.outerHTML : ""}</div></body></html>`;
  }).catch(() => "");
  return cacheRobo[id];
}
// Barras estilo Stories: uma por membro do grupo; as anteriores cheias, a atual enchendo, as próximas vazias.
function barras(atual, total = 4) {
  return Array.from({ length: total }, (_, i) => `<i class="${i < atual ? "cheia" : i === atual ? "on" : ""}"></i>`).join("");
}
const ORDEM_EQUIPE = [...EQUIPE.facilitadores, ...EQUIPE.analistas].map(p => p.slug);

function reel({ miolo, nome, papel, cores, mini = false, pos = 0, total = 4 }) {
  return `<div class="reel${mini ? " mini" : ""}" style="--c1:${cores[0]};--c2:${cores[1]}"><div class="tela">
    ${mini ? `<div class="barras" aria-hidden="true">${barras(pos, total)}</div>` : ""}
    <div class="topo"><span>iC</span>IntelliC · BIOTEAM</div>${miolo}
    <div class="legenda"><b>${esc(nome)}</b><em>${esc(papel)}</em></div></div></div>`;
}
const reelAgente = (a, mini) => reel({ miolo: `<iframe title="Robô de ${esc(a.curto)}" data-robo="${a.id}" sandbox="allow-same-origin" loading="lazy"></iframe>`, nome: a.nome, papel: a.papel, cores: a.cores, mini, pos: ESP.indexOf(a), total: ESP.length });
const reelPessoa = (p, cores, mini) => reel({ miolo: `<img src="assets/caricaturas/${p.slug}.jpg" alt="Caricatura de ${esc(p.nome)}">`, nome: p.nome, papel: p.papel, cores, mini, pos: ORDEM_EQUIPE.indexOf(p.slug), total: ORDEM_EQUIPE.length });
async function preencherRobos() {
  for (const f of document.querySelectorAll("iframe[data-robo]")) { if (!f.srcdoc) f.srcdoc = await roboHTML(f.dataset.robo); }
}
function perfil(handle, nome, selo, stats, bio, cor) {
  return `<div class="perfil" style="--c:${cor}">
    <div class="perfil-topo"><span class="handle">@${handle}</span>${ic("badge-check", 22, "#3897f0")}<span class="selo">${selo}</span></div>
    <div class="stats">${stats.map(([n, l]) => `<div><b>${n}</b><span>${l}</span></div>`).join("")}</div>
    <h2>${esc(nome)}</h2>
    <ul class="bio">${bio.map(([i, t]) => `<li>${ic(i, 18, cor)}<span>${esc(t)}</span></li>`).join("")}</ul></div>`;
}

// ============================================================ páginas
function paginaInicio() {
  const pessoas = [...EQUIPE.facilitadores.map(p => [p, CORES.facilitadores]), ...EQUIPE.analistas.map(p => [p, CORES.analistas])];
  return `
  <div class="grid topo-grid">
    <section class="hero">
      <div class="kicker">${ic("flame", 16, "#ffb347")}Desafio IntelliC · SEDCITEC IFSP 2026 · BIOTEAM</div>
      <h1 class="hero-title">IntelliC</h1>
      <p class="sub2">Inteligência Colaborativa com Lógica Paraconsistente</p>
      <p class="q">Quem decide como <span>apagar o fogo?</span></p>
      <div class="hero-resp">${ic("gauge", 18, COR_ESTADO[ESTADO])}<span>Resposta do estudo: <b>sozinho, o satélite não resolve</b> · ${badge(ESTADO)}</span></div>
      <div class="hero-acoes"><a class="btn prim" href="#resultado">Ver o resultado</a><a class="btn" href="#especialistas">Conhecer os especialistas</a></div>
    </section>
    <div class="grid">
      <div class="card"><h3>${ic("target", 20, "#ffb347")}Problema em análise</h3><p class="problema">${PROBLEMA}</p></div>
      <div class="grid g2">${[[`${sinal(GC)}%`, "viabilidade (GC)"], [`${sinal(GI)}%`, "dúvida (GI)"], [`+${LIMITE}%`, "para ser viável"], ["20", "pareceres"]].map(([n, l]) => `<div class="card stat"><b>${n}</b><span>${l}</span></div>`).join("")}</div>
    </div>
  </div>
  ${titulo("flame", "O problema em números", "Dados públicos de 2024, o pior ano de fogo na Amazônia em quase duas décadas.")}
  <div class="grid g3">${NUMEROS.map(([n, t, fonte, url]) => `<div class="card numero"><b>${n}</b><p>${t}</p><a href="${url}" target="_blank" rel="noopener">${fonte} ↗</a></div>`).join("")}</div>
  ${titulo("bot", "Os especialistas", "Quatro agentes de IA, quatro saberes diferentes sobre o mesmo problema. A divergência entre eles é o que a Lógica Paraconsistente mede. Clique em um para ver o perfil, as notas e as fontes.")}
  <div class="grid g4">${ESP.map(a => `<a class="reel-col reel-link" href="#especialistas-${a.id}">${reelAgente(a, true)}<span class="avalia">${AVALIA[a.id]}</span></a>`).join("")}</div>
  <div class="card" style="margin-top:24px"><h3>${ic("compass", 20, "#ffb347")}Fluxo de governança</h3>
    <div class="flow">
      <div class="step" style="--c:#3a78d8"><b>${ic("compass", 20, "#8fb0e0")}Facilitadores</b><small>Montam o Problema, os critérios e os participantes</small></div>
      <div class="step" style="--c:#ff7a1a"><b>${ic("bot", 20, "#ff7a1a")}Especialistas</b><small>Cada um dá Chance e Dúvida (0 a 10) por critério, sem ver o parecer dos outros</small></div>
      <div class="step" style="--c:#2fbf71"><b>${ic("sparkles", 20, "#2fbf71")}IntelliC</b><small>A Lógica Paraconsistente calcula viabilidade (GC) e dúvida (GI) sem apagar a divergência</small></div>
      <div class="step" style="--c:#d4a017"><b>${ic("search", 20, "#d4a017")}Analistas</b><small>Leem o resultado e o Quadrado Mágico e traduzem em recomendação</small></div>
    </div></div>
  ${titulo("users", "Equipe BIOTEAM")}
  <div class="grid g4">${pessoas.map(([p, c]) => `<a class="reel-col reel-link" href="#${EQUIPE.facilitadores.includes(p) ? "facilitadores" : "analistas"}-${p.slug}">${reelPessoa(p, c, true)}</a>`).join("")}</div>`;
}
const AVALIA = { helena: "Avalia se o alerta é confiável", raimundo: "Avalia se dá para chegar a tempo",
  marcos: "Avalia custo, orçamento e lei", jaci: "Avalia se o alerta chega à aldeia" };
const NUMEROS = [
  ["137.538", "focos de calor na Amazônia em 2024 (até dezembro). O maior número em 17 anos.", "INPE · Programa Queimadas", "https://portalamazonia.com/meio-ambiente/amazonia-maior-numero-de-queimadas-17-anos/"],
  ["30 mi ha", "queimados no Brasil em 2024, 62% acima da média histórica. Só de floresta, 7,7 milhões de hectares.", "MapBiomas Fogo", "https://brasil.mapbiomas.org/wp-content/uploads/sites/4/2025/06/Fact_Fogo_colecao4.pdf"],
  ["R$ 405 mi", "do Fundo Amazônia para os Corpos de Bombeiros dos nove estados da Amazônia Legal.", "Fundo Amazônia · BNDES", "https://agenciagov.ebc.com.br/noticias/202311/fundo-amazonia-amplia-para-r-405-milhoes-apoio-aos-estados-contra-incendios-florestais"],
];

function paginaAgente(a) {
  const c1 = a.cores[0];
  const media = i => (Object.values(a.notas).reduce((s, v) => s + v[i], 0) / 5).toFixed(1).replace(".", ",");
  const notas = Object.entries(a.notas).map(([k, [c, d, j]]) => {
    const [tag, cor] = leitura(c, d);
    return `<div class="nota" style="--t:${cor}"><div class="cab"><b>${k}</b><span class="tag">${tag}</span></div><p class="desc">${CRIT[k][1]}</p>
      <div class="linha">Chance<div class="trilho"><div style="width:${c * 10}%;background:linear-gradient(90deg,#14804a,#2fbf71)"></div></div><b>${c}</b></div>
      <div class="linha">Dúvida<div class="trilho"><div style="width:${d * 10}%;background:linear-gradient(90deg,#ff7a1a,#ffb347)"></div></div><b>${d}</b></div>
      <p>${esc(j)}</p></div>`;
  }).join("");
  return `<div class="lado">
    <div class="reel-col"><p class="balao" style="--c:${c1}">“${esc(a.frase)}”</p>${reelAgente(a)}
      <a href="assets/agentes/${a.id}.html" target="_blank" rel="noopener" style="color:var(--fogo2);margin-top:12px">Abrir a página completa do agente ↗</a></div>
    <div class="grid" style="gap:14px">
      <div class="kicker">${ic("sparkles", 16, "#ffb347")}Estudo de decisão · Lógica Paraconsistente</div>
      ${perfil(a.handle, a.nome, "Agente de IA", [[media(0), "chance média"], [media(1), "dúvida média"], ["5", "critérios"]],
        [["briefcase", a.funcao], ["graduation-cap", a.formacao], ["award", a.experiencia], ["eye", a.avalia]], c1)}
      <div class="grid duas">
        <div class="card"><h3>${ic("quote", 20, "#ffb347")}Posição no debate</h3><div class="grid" style="gap:10px">${a.posicao.map(t => `<p style="color:#d6e4fa">${esc(t)}</p>`).join("")}</div></div>
        <div class="card"><h3>${ic("messages-square", 20, "#ffb347")}Respostas aos outros agentes</h3>
          ${a.respostas.map(([q, t]) => `<div class="resp">${ic("message-circle", 20, c1)}<div><b>Para ${q}</b><span>${esc(t)}</span></div></div>`).join("")}</div>
      </div>
    </div></div>
  <div class="card" style="margin-top:22px"><h3>${ic("gauge", 20, "#ffb347")}Notas lançadas no IntelliC</h3><div class="notas">${notas}</div></div>
  ${fontesAgente(a)}`;
}
function paginaEspecialistas(sub) {
  const a = ESP.find(x => x.id === sub) || ESP[0];
  return `${titulo("bot", "Especialistas", "Cada agente defende o seu ângulo, responde aos outros e dá as notas que foram lançadas no IntelliC.")}
    <div class="subs" role="tablist">${ESP.map(x => `<button class="sub" role="tab" data-sub="${x.id}" aria-selected="${x.id === a.id}">${ic(x.icone, 16)}${x.curto}</button>`).join("")}</div>
    ${paginaAgente(a)}`;
}

function paginaPessoa(p, grupo) {
  const cores = CORES[grupo];
  return `<div class="lado"><div class="reel-col">${reelPessoa(p, cores)}</div>
    <div class="grid" style="gap:14px">
      <div class="kicker">${ic("users", 16, "#ffb347")}Equipe BIOTEAM · Desafio IntelliC</div>
      ${perfil(p.handle, p.nome, p.papel, STATS[grupo], [["briefcase", `${p.papel} no estudo IntelliC`], ["target", p.bio], ["map-pin", "SEDCITEC · IFSP 2026"]], cores[0])}
      ${titulo("award", `O que ${esc(p.curto)} fez`, "", "p")}
      <div class="grid g2">${(D.INDIVIDUAL[p.slug] ?? []).map(([i, t, d]) => `<div class="tarefa destaque-ind" style="--c:${cores[0]}">${ic(i, 24, cores[0])}<div><b>${t}</b><span>${d}</span></div></div>`).join("")}</div>
      ${titulo("clipboard-list", `Tarefas de ${grupo === "facilitadores" ? "facilitador" : "analista"}`, grupo === "facilitadores" ? "Comuns aos dois facilitadores." : "Comuns às duas analistas.", "p")}
      <div class="grid g2">${TAREFAS[grupo].map(([i, t, d]) => `<div class="tarefa">${ic(i, 24, cores[0])}<div><b>${t}</b><span>${d}</span></div></div>`).join("")}</div>
    </div></div>`;
}
function paginaGrupo(grupo, sub) {
  const lista = EQUIPE[grupo];
  const p = lista.find(x => x.slug === sub) || lista[0];
  const cab = grupo === "facilitadores"
    ? titulo("compass", "Facilitadores", "Organizam a estrutura do estudo para que os especialistas possam opinar. Não dão parecer: garantem que a régua esteja pronta antes de qualquer número.")
    : titulo("search", "Analistas", "Consultam o resultado calculado pelo IntelliC e transformam os números em uma leitura clara: o que indica, o que fazer e o que verificar.");
  return `${cab}<div class="subs" role="tablist">${lista.map(x => `<button class="sub" role="tab" data-sub="${x.slug}" aria-selected="${x.slug === p.slug}">${x.curto}</button>`).join("")}</div>${paginaPessoa(p, grupo)}`;
}

// ---- resultado
function regua(t, pergunta, v, zonas, leit, exp) {
  const larg = [20, 30, 30, 20];
  return `<div class="regua-card"><div class="rc-top"><div><span class="rc-t">${t}</span><b class="rc-p">${pergunta}</b></div><div class="rc-val">${sinal(v)}%</div></div>
    <div class="regua"><div class="faixas">${larg.map((w, i) => `<div style="width:${w}%;background:${zonas[i][0]}"></div>`).join("")}</div>
      <div class="marcador" style="left:${(v + 100) / 2}%"><span>${sinal(v)}%</span></div></div>
    <div class="ticks">${[["−100", 0], ["−60", 20], ["0", 50], ["+60", 80], ["+100", 100]].map(([l, p]) => `<span style="left:${p}%">${l}</span>`).join("")}</div>
    <div class="zonas">${larg.map((w, i) => `<div style="width:${w}%">${zonas[i][1]}</div>`).join("")}</div>
    <div class="rc-leitura">${ic("eye", 18, "#ffb347")}<span>${leit}</span></div><p class="rc-exp">${exp}</p></div>`;
}
function quadradoSVG(destaque, simulado) {
  const X = v => 50 + (v + 100) * 1.9, Y = v => 390 - (v + 100) * 1.9, L = LIMITE;
  const r = (x0, x1, y0, y1, c) => `<rect x="${X(x0)}" y="${Y(y1)}" width="${X(x1) - X(x0)}" height="${Y(y0) - Y(y1)}" fill="${c}" fill-opacity=".3"/>`;
  const off = { EFI: [-16, -8], ESC: [0, -14], CUS: [18, -6], SOC: [-20, 4], CAU: [-20, 4] };
  let s = `<svg viewBox="0 0 440 440" role="img" aria-label="Quadrado Mágico: viabilidade no eixo horizontal, dúvida no vertical">
    ${r(-100, -L, -L, L, "#e55353")}${r(-L, 0, -L, L, "#ff9a3c")}${r(0, L, -L, L, "#f5d547")}${r(L, 100, -L, L, "#2fbf71")}
    ${r(-100, 100, L, 100, "#9aa7b8")}${r(-100, 100, -100, -L, "#9aa7b8")}
    <rect x="${X(-100)}" y="${Y(100)}" width="380" height="380" fill="none" stroke="rgba(255,255,255,.25)"/>
    <line x1="${X(0)}" y1="${Y(100)}" x2="${X(0)}" y2="${Y(-100)}" stroke="rgba(255,255,255,.4)"/>
    <line x1="${X(-100)}" y1="${Y(0)}" x2="${X(100)}" y2="${Y(0)}" stroke="rgba(255,255,255,.4)"/>`;
  [[-80, "Inviável"], [-30, "Tendência"], [30, "Tendência"], [80, "Viável"]].forEach(([x, t]) => s += `<text x="${X(x)}" y="${Y(-48)}" fill="#fff" fill-opacity=".6" font-size="10" text-anchor="middle">${t}</text>`);
  s += `<text x="${X(0)}" y="${Y(82)}" fill="#fff" fill-opacity=".6" font-size="10" text-anchor="middle">Dúvida excessiva</text><text x="${X(0)}" y="${Y(-82)}" fill="#fff" fill-opacity=".6" font-size="10" text-anchor="middle">Dúvida excessiva</text>`;
  [-100, -60, 0, 60, 100].forEach(v => s += `<text x="${X(v)}" y="410" fill="#cfe0f8" font-size="10" text-anchor="middle">${v}</text><text x="40" y="${Y(v) + 3}" fill="#cfe0f8" font-size="10" text-anchor="end">${v}</text>`);
  s += `<text x="${X(0)}" y="432" fill="#cfe0f8" font-size="11" text-anchor="middle">Índice de viabilidade (GC) →</text>`;
  Object.keys(CRIT).forEach(k => {
    const { gc, gi } = CALC[k]; const foco = !destaque || destaque === k;
    s += `<circle cx="${X(gc)}" cy="${Y(gi)}" r="${foco ? 8 : 5}" fill="${COR_ESTADO[classificar(gc, gi)]}" stroke="#07142b" stroke-width="2" opacity="${foco ? 1 : .45}"/>
      <text x="${X(gc) + off[k][0]}" y="${Y(gi) + off[k][1]}" fill="${foco ? "#fff" : "#9db3d1"}" font-size="${foco ? 12 : 10}" font-weight="700" text-anchor="middle">${k}</text>`;
  });
  s += `<circle cx="${X(GC)}" cy="${Y(GI)}" r="9" fill="#ff7a1a" stroke="#07142b" stroke-width="2"/><text x="${X(GC) + 26}" y="${Y(GI) + 18}" fill="#ff7a1a" font-size="12" font-weight="700" text-anchor="middle">GERAL</text>`;
  if (simulado) s += `<circle cx="${X(simulado[0])}" cy="${Y(simulado[1])}" r="10" fill="#fff" stroke="#07142b" stroke-width="2"/><text x="${X(simulado[0])}" y="${Y(simulado[1]) - 16}" fill="#fff" font-size="12" font-weight="700" text-anchor="middle">SIMULADO</text>`;
  return s + `</svg>`;
}
const NOMES_G = ["A", "B", "C"], COR_G = ["#8b5cf6", "#06b6d4", "#ec4899"];
function contaCriterio(k) {
  const { ind, rg, gc, gi } = CALC[k]; const est = classificar(gc, gi);
  const fraco = rg.reduce((m, g, i) => g.gc < rg[m].gc ? i : m, 0);
  return `<p class="lead"><b style="color:#fff">${CRIT[k][0]} (${k})</b> · ${CRIT[k][1]}<br><span style="color:#ffd9b8">Viabilidade ${sinal(gc)}%: ${lerGC(gc)} · Dúvida ${sinal(gi)}%: ${lerGI(gi)}</span></p>
  <div class="grid duas">
    <div class="card tabela-wrap"><table><thead><tr><th>Especialista</th><th>Grupo</th><th>Chance</th><th>Dúvida</th><th>μ</th><th>λ</th><th>GC</th><th>GI</th></tr></thead><tbody>
      ${ind.map(e => { const g = rg[e.grupo]; return `<tr><td><b>${e.nome}</b></td><td><span class="gtag" style="--g:${COR_G[e.grupo]}">${NOMES_G[e.grupo]}</span></td><td>${e.c}</td><td>${e.d}</td><td>${e.mu.toFixed(1).replace(".", ",")}</td><td>${e.la.toFixed(1).replace(".", ",")}</td><td class="${e.gc === g.gc ? "win" : ""}">${sinal(e.gc)}</td><td class="${e.gi === g.gi ? "win2" : ""}">${sinal(e.gi)}</td></tr>`; }).join("")}
    </tbody></table><p class="desc" style="margin-top:10px">Verde = maior GC do grupo (vale dentro do grupo) · Azul = menor GI do grupo</p></div>
    <div class="card"><div class="grid g2">${rg.map((g, i) => `<div class="grupo" style="--g:${COR_G[i]}"><b>Grupo ${NOMES_G[i]}</b><small>${g.membros.map(m => m.nome).join(" + ")}</small><div>maior GC <b>${sinal(g.gc)}</b> · menor GI <b>${sinal(g.gi)}</b></div></div>`).join("")}</div>
      <p style="text-align:center;color:#ffd9b8;margin-top:12px">${ic("scale", 18, "#ffb347")} Entre os grupos: <b>menor GC</b> e <b>maior GI</b></p>
      <div class="final-c" style="--e:${COR_ESTADO[est]}"><div><span>GC</span><b>${sinal(gc)}%</b></div><div><span>GI</span><b>${sinal(gi)}%</b></div>${badge(est)}</div>
      <p class="porque">${ic("eye", 16, "#ffb347")} O resultado é tão forte quanto o grupo mais fraco: o <b>Grupo ${NOMES_G[fraco]}</b> (${rg[fraco].membros.map(m => m.nome).join(" e ")}) chegou só a <b>${sinal(rg[fraco].gc)}</b>, e é esse valor que o IntelliC leva.</p></div>
  </div>`;
}
let critAtual = "ESC";
function paginaResultado() {
  const ks = Object.keys(CRIT);
  const medias = ks.map(k => { const { gc, gi } = CALC[k]; const est = classificar(gc, gi); const larg = Math.abs(gc) / 2;
    return `<div class="media-linha"><div class="ml-nome"><b>${CRIT[k][0]}</b><small>${k} · ${CRIT[k][1]}</small></div>
      <div class="ml-barra"><div class="ml-zero"></div><div class="ml-fill" style="${gc >= 0 ? `left:50%` : `left:${50 - larg}%`};width:${larg}%;background:${COR_ESTADO[est]}"></div></div>
      <div class="ml-num">${sinal(gc)}%</div><div class="ml-gi">dúvida ${sinal(gi)}%</div></div>`; }).join("");
  const passos = [["1", "messages-square", "Cada especialista dá duas notas", "<b>Chance</b> (0 a 10): o quanto acredita que funciona.<br><b>Dúvida</b> (0 a 10): o quanto desconfia da própria resposta.", "Helena, no Alcance: Chance 9, Dúvida 3."],
    ["2", "scale", "O IntelliC transforma em evidências", "A favor: <b>μ = Chance ÷ 10</b>.<br>Contra: <b>λ = Dúvida ÷ 10</b>.", "μ = 0,9 e λ = 0,3."],
    ["3", "gauge", "Calcula a certeza e a dúvida", "<b>Viabilidade = μ − λ</b><br><b>Dúvida = μ + λ − 1</b>", "0,9 − 0,3 = <b>+60%</b> · 0,9 + 0,3 − 1 = <b>+20%</b>."],
    ["4", "users", "Junta as pessoas em grupos", "Dentro do grupo vale o <b>melhor argumento</b>. Entre os grupos vale o <b>mais cauteloso</b>.", "Grupo A (Helena + Marcos) = +60. Grupo B (Raimundo + Jaci) = 0. Fica <b>0</b>."],
    ["5", "target", "Decide", `Faz a média dos 5 critérios e compara com o limite de <b>${LIMITE}%</b>.`, `Média = <b>${sinal(GC)}%</b> → ${ESTADO}.`]];
  return `${titulo("gauge", "Resultado e explicabilidade", "O IntelliC não faz média de opiniões nem votação: ele mede a evidência a favor, a evidência contra e a contradição entre os especialistas.")}
  <section class="resposta1" style="--e:${COR_ESTADO[ESTADO]}"><div class="kicker">${ic("target", 16, "#ffb347")}A resposta do estudo em uma frase</div>
    <p class="frase-grande">Sozinho, o monitoramento por satélite <span>não resolve</span>: os especialistas ficaram no empate, levemente para o lado do “não funciona”.</p>
    <p style="display:flex;gap:14px;flex-wrap:wrap;align-items:center">Classificação do IntelliC: ${badge(ESTADO)}<span class="confere">${ic("shield-check", 16, "#2fbf71")}Recalculado com o mesmo algoritmo do IntelliC v20 R10: confere com o sistema (GC −2%, GI 0%).</span></p>
    <div class="prints-sistema">${[6, 7].map(i => `<button class="foto mini-foto" data-foto="${i}" aria-label="Ampliar print do IntelliC: ${GALERIA[i][1]}"><img src="assets/galeria/${GALERIA[i][0]}.jpg" alt="${GALERIA[i][1]}"><span>Print do IntelliC · ${GALERIA[i][1]}</span></button>`).join("")}</div></section>
  ${titulo("scale", "Por que não fizemos uma votação", "A mesma planilha de notas, lida de dois jeitos.", "p")}
  ${votacaoVsIntellic()}
  ${titulo("gauge", "Os dois números do IntelliC, sem mistério", "", "p")}
  <div class="grid g2">
    ${regua("Índice de viabilidade (GC)", "A estratégia funciona?", GC, [["#e55353", "Não funciona"], ["#ff9a3c", "Pende para não"], ["#f5d547", "Pende para sim"], ["#2fbf71", "Funciona"]], lerGC(GC),
      `Vai de <b>−100%</b> (todos têm certeza de que <b>não</b> funciona) a <b>+100%</b> (todos têm certeza de que <b>funciona</b>). Para o IntelliC dizer “Viável”, precisa chegar a <b>+${LIMITE}%</b>.`)}
    ${regua("Índice de dúvida (GI)", "Quão seguros os especialistas estão?", GI, [["#9aa7b8", "Falta informação demais"], ["#7fb2ff", "Pouca informação"], ["#c39bff", "Alguma contradição"], ["#9aa7b8", "Contradição demais"]], lerGI(GI),
      `<b>Negativo</b> = falta informação (nota baixa na chance <i>e</i> na dúvida). <b>Positivo</b> = contradição (nota alta nas duas). <b>Zero</b> = equilíbrio. Se passar de <b>±${LIMITE}%</b>, o resultado é descartado por dúvida excessiva.`)}
  </div>
  ${titulo("puzzle", `De onde vem o ${sinal(GC)}%`, "Cada critério recebe o seu próprio par de números (viabilidade e dúvida). O resultado geral é a <b>média dos 5 critérios</b>.", "p")}
  <div class="card"><div class="media-cab"><span>Critério</span><span>Viabilidade (← não funciona · funciona →)</span><span>GC</span><span>GI</span></div>${medias}
    <div class="conta-media"><div><span>Viabilidade geral</span><b>(${ks.map(k => sinal(CALC[k].gc)).join(" ")}) ÷ 5 = ${sinal(GC)}%</b></div><div><span>Dúvida geral</span><b>(${ks.map(k => sinal(CALC[k].gi)).join(" ")}) ÷ 5 = ${sinal(GI)}%</b></div></div>
    <p class="porque">${ic("eye", 16, "#ffb347")} Atenção: no critério <b>Causa (CAU)</b> a viabilidade é −10% e a <b>dúvida</b> é −30%. Esse −30% significa <b>falta de informação</b>: ninguém acredita que o alerta ataque a grilagem.</p></div>
  ${titulo("users", "Mapa da divergência", "Onde cada especialista puxou o resultado. A maior briga está no Alcance: a Helena chega a +60 e o Raimundo fica em 0.", "p")}
  ${mapaDivergencia()}
  ${titulo("messages-square", "Como cada número nasce, com um exemplo real", "", "p")}
  <div class="grid g5">${passos.map(([n, i, t, d, ex]) => `<div class="passo"><span class="num">${n}</span>${ic(i, 22, "#ffb347")}<b>${t}</b><span>${d}</span><div class="exemplo">${ic("sparkles", 14, "#2fbf71")}<span>${ex}</span></div></div>`).join("")}</div>
  ${titulo("search", "Abra a conta de um critério", "Escolha um critério para ver a nota de cada especialista e como o IntelliC chegou ao resultado dele.", "p")}
  <div class="seg" role="group" aria-label="Critério">${ks.map(k => `<button data-crit="${k}" aria-pressed="${k === critAtual}">${CRIT[k][0]} (${k})</button>`).join("")}</div>
  <div id="conta">${contaCriterio(critAtual)}</div>
  <div class="grid duas" style="margin-top:26px">
    <div>${titulo("target", "Quadrado Mágico", "<b>Como ler:</b> cada bolinha é um critério. <b>Direita</b> = funciona; <b>esquerda</b> = não funciona. <b>Cima</b> = contradição; <b>baixo</b> = falta de informação. Para ser Viável, a bolinha teria que chegar à faixa verde. <b>Todas ficaram no centro.</b>", "p")}
      <div class="card quadrado" id="quadrado">${quadradoSVG(critAtual)}</div></div>
    <div>${titulo("clipboard-list", "Critério por critério", "", "p")}
      <div class="card">${ks.map(k => { const { gc, gi } = CALC[k]; const e = classificar(gc, gi); return `<div class="crit-linha" style="--e:${COR_ESTADO[e]}"><div class="cl"><b>${CRIT[k][0]} (${k})</b><small>GC ${sinal(gc)} · GI ${sinal(gi)}</small>${badge(e)}</div><p>${LEIT[k]}</p></div>`; }).join("")}</div></div>
  </div>
  <div class="card destaque" style="margin-top:24px"><h3>${ic("award", 22, "#ffb347")}Por que 60% já é um resultado alto</h3>
    <div class="grid g3 tres"><div><b>O grupo mais fraco decide</b><span>Entre os grupos vale o <i>menor</i> GC. Basta um grupo cético para segurar o resultado.</span></div>
      <div><b>A maior dúvida prevalece</b><span>Entre os grupos vale o <i>maior</i> GI. Se a dúvida chega a 60%, o resultado vira “dúvida excessiva”.</span></div>
      <div><b>A média puxa para o centro</b><span>O geral é a média dos 5 critérios: um critério fraco derruba os outros.</span></div></div>
    <p style="color:#d6e4fa;margin-top:12px">Para um critério ser <b>Viável</b>, cada grupo precisa de pelo menos um especialista com <b>Chance − Dúvida ≥ 6</b> (por exemplo, Chance 8 e Dúvida 2), e isso em todos os critérios para o geral passar de 60%. Por isso, na prática, resultados acima de 60–65% são raros.</p></div>
  ${titulo("target", "O que faria a estratégia virar Viável", "Quanto falta, em cada critério, para o grupo mais cético chegar a +60.", "p")}
  ${oQueFariaVirar()}
  <details class="sim"><summary>Simulador: e se os especialistas pensassem diferente?</summary>
    <div class="card" style="margin-top:12px"><div class="seg" role="group" aria-label="Critério do simulador" id="sim-crit">${ks.map(k => `<button data-simcrit="${k}" aria-pressed="${k === "ESC"}">${CRIT[k][0]} (${k})</button>`).join("")}</div>
      <div class="grid g4 sliders" id="sim-sliders"></div>
      <div class="grid duas" style="margin-top:16px;align-items:center"><div id="sim-res"></div><div class="quadrado" id="sim-quad"></div></div></div></details>
  ${titulo("messages-square", "Pareceres dos especialistas (Chance / Dúvida)", "", "p")}
  <div class="card tabela-wrap"><table><thead><tr><th>Especialista</th>${ks.map(k => `<th>${k}</th>`).join("")}</tr></thead><tbody>
    ${ESP.map(a => `<tr><td>${a.nome}</td>${ks.map(k => `<td>${a.notas[k][0]} / ${a.notas[k][1]}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
  ${titulo("file-text", "Leitura em 3 frases", "", "p")}
  <div class="grid g3">${[["#2fbf71", "eye", "Indica", "Sozinho, o monitoramento por satélite não chega ao limite de 60%: o resultado geral fica perto de zero, com tendência a inviável."],
    ["#ff7a1a", "target", "Fazer", "Usar o alerta precoce como peça de uma estratégia integrada, junto com brigadas e combate à grilagem, e não como solução isolada."],
    ["#d4a017", "search", "Verificar", "Como garantir que o alerta chegue às comunidades e quem paga a resposta em campo: só o custo (CUS) ficou positivo."]]
    .map(([c, i, t, x]) => `<div class="leit" style="--c:${c}"><b>${ic(i, 18, c)}${t}</b><p>${x}</p></div>`).join("")}</div>`;
}

// ---- simulador
let simCrit = "ESC"; const simNotas = {};
function montarSimulador() {
  const box = $("#sim-sliders"); if (!box) return;
  box.innerHTML = ESP.map(a => { const [c, d] = simNotas[simCrit]?.[a.id] ?? a.notas[simCrit];
    return `<div><b>${a.curto}</b><label for="sc-${a.id}">Chance<input type="range" id="sc-${a.id}" min="0" max="10" value="${c}" data-a="${a.id}" data-t="0"><output>${c}</output></label>
      <label for="sd-${a.id}">Dúvida<input type="range" id="sd-${a.id}" min="0" max="10" value="${d}" data-a="${a.id}" data-t="1"><output>${d}</output></label></div>`; }).join("");
  atualizarSimulador();
}
function atualizarSimulador() {
  const ent = ESP.map(a => [a.curto, +$(`#sc-${a.id}`).value, +$(`#sd-${a.id}`).value]);
  const { gc, gi } = calcular(ent); const est = classificar(gc, gi); const real = CALC[simCrit];
  $("#sim-res").innerHTML = `<div class="final-c" style="--e:${COR_ESTADO[est]}"><div><span>GC</span><b>${sinal(gc)}%</b></div><div><span>GI</span><b>${sinal(gi)}%</b></div>${badge(est)}</div>
    <p class="porque">Real: GC ${sinal(real.gc)}% · GI ${sinal(real.gi)}%. Mexa nas notas e veja o ponto branco andar. Dica: para chegar a Viável, cada grupo precisa de alguém com Chance − Dúvida ≥ 6.</p>`;
  $("#sim-quad").innerHTML = quadradoSVG(simCrit, [gc, gi]);
}

// ---- o IntelliC por dentro
const GALERIA = [
  ["01_login", "Entrada no sistema", "Login com usuário e senha. Cada pessoa da equipe e cada especialista tem a sua conta."],
  ["02_dashboard", "Visão geral", "O painel mostra quantos problemas existem e em que etapa cada um está."],
  ["03_problema", "Nosso problema cadastrado", "A pergunta, o cenário, o tipo colaborativo e o limite de decisão de 60%."],
  ["04_criterios", "A régua: 5 critérios", "Eficácia, causa, custo, alcance e comunidades, definidos antes de qualquer nota."],
  ["05_participantes", "Um papel por pessoa", "Facilitador, especialista ou analista. O sistema separa quem monta, quem opina e quem lê."],
  ["06_pendencias", "Ninguém fica de fora", "O IntelliC só calcula quando todos responderam tudo. Aqui: 20 de 20."],
  ["07_resultado", "O resultado", "No login da Joseane, analista: viabilidade −2%, dúvida 0%, tendência a ser inviável."],
  ["08_quadrado", "Quadrado Mágico", "Ainda no login da Joseane: o ponto geral no centro, longe da faixa verde que marca o Viável."],
  ["09_criterios_resultado", "Resultado por critério", "No login da Hellen, analista: cada critério com a própria viabilidade, dúvida e classificação."],
  ["11_trilha", "Trilha de aprendizagem", "Os 40 estudos de caso que o sistema traz para ensinar o método."],
  ["10_sobre", "Sobre o IntelliC", "Lógica Paraconsistente Anotada Evidencial Eτ, desenvolvida pelo Prof. Fábio."],
  // 12 em diante: cada participante no próprio login
  ["03_problema", "Wilk · Facilitador", "Cadastrou o problema, a régua e os participantes. Monta o estudo, mas não dá parecer nem interpreta o resultado."],
  ["20_gislene", "Gislene · Facilitadora", "O sistema mostra: “Você participa como Facilitador”. Organiza a estrutura e os participantes."],
  ["21_joseane", "Joseane · Analista", "Acompanha e interpreta o resultado, sem acesso para mudar notas ou critérios."],
  ["22_hellen", "Hellen · Analista", "“Acesso em modo de consulta”: vê tudo, não altera nada. Exatamente o papel de analista."],
  ["23_helena", "Helena · Especialista", "Os pareceres dela no próprio login: Eficácia 7/4, Causa 4/6…"],
  ["24_raimundo", "Raimundo · Especialista", "As notas mais céticas: Eficácia 5/6, Causa 3/4…"],
  ["25_marcos", "Marcos · Especialista", "O olhar do orçamento: Eficácia 7/4, Causa 3/3…"],
  ["26_jaci", "Jaci · Especialista", "A voz do território: Eficácia 6/6, Causa 3/4…"],
];
const N_PASSOS = 11; // os 11 primeiros contam o estudo; os demais mostram cada login
function paginaIntellic() {
  const dif = [
    ["scale", "Mede a contradição em vez de esconder", "Numa votação, quem acha 9 e quem acha 3 viram um 6 morno. O IntelliC guarda a briga e mostra onde ela está."],
    ["shield-check", "Protege a autoria de cada opinião", "Só quem é especialista consegue dar parecer, e ninguém vê o parecer dos outros. Nem o dono do problema."],
    ["clipboard-list", "Não calcula com dado faltando", "Enquanto falta uma resposta, o sistema avisa e espera. Nas palavras da tela de pendências: calcular com dados incompletos contamina a análise."],
    ["target", "Explica o próprio resultado", "Viabilidade, dúvida e o Quadrado Mágico deixam claro por que a resposta saiu daquele jeito."],
  ];
  const stack = [["Linguagem", "Java 21"], ["Framework", "Spring Boot 3.3"], ["Segurança", "Spring Security 6 · senhas com BCrypt · proteção CSRF"],
    ["Telas", "41 páginas em Thymeleaf"], ["Controladores", "23, um por área do sistema"], ["Banco de dados", "MySQL 8 · 19 tabelas · 93 stored procedures"],
    ["Motor de cálculo", "CalculoParaconsistenteService + AgrupamentoService"], ["Versão", "IntelliC v20 R10 · R5"]];
  const recursos = [
    ["users", "Perfis acumuláveis", "IntelliC, Master, Coordenador, Padrão e Visitante. Uma pessoa pode ter mais de um."],
    ["puzzle", "Família de problemas", "Compara análises relacionadas ao longo do tempo, todas com a mesma régua."],
    ["file-text", "Modelo reutilizável", "Uma régua pronta que terceiros aplicam depois, com Grupos de Avaliação."],
    ["gauge", "Pesos", "Peso diferente por critério e por especialista, quando o problema pede."],
    ["traffic-cone", "Prazo para pareceres", "Se o prazo vence, quem não respondeu tudo sai do cálculo."],
    ["graduation-cap", "Trilha EAD", "40 estudos de caso em 4 módulos para aprender o método na prática."],
  ];
  return `${titulo("sparkles", "O IntelliC por dentro", "Antes de usar, a gente quis entender. Rodamos o sistema do zero, lemos como ele é construído e fizemos o estudo inteiro dentro dele.")}
  <section class="resposta1" style="--e:#3a78d8"><div class="kicker">${ic("bookmark", 16, "#ffb347")}O que é</div>
    <p class="frase-grande" style="font-size:clamp(1.3rem,2.2vw,1.9rem)">Um sistema de apoio à decisão em grupo que usa <span>Lógica Paraconsistente Anotada Evidencial Eτ</span> para lidar com evidência a favor, evidência contra e contradição ao mesmo tempo.</p>
    <p style="color:#d6e4fa">Desenvolvido sob a liderança do Prof. Fábio, no IFSP e no SENAC. É o que permitiu ouvir quatro especialistas que discordam sem jogar a discordância fora.</p></section>
  ${titulo("award", "O que ele fez pela nossa análise", "", "p")}
  <div class="grid g4">${dif.map(([i, t, d]) => `<div class="card"><h3>${ic(i, 20, "#ffb347")}${t}</h3><p style="color:#d6e4fa">${d}</p></div>`).join("")}</div>
  ${titulo("clipboard-list", "Nosso passo a passo no sistema", "Prints reais do estudo, na ordem em que fizemos. Clique para ampliar. Nomes completos e e-mails foram ocultados.", "p")}
  <div class="galeria">${GALERIA.slice(0, N_PASSOS).map(([arq, t, d], i) => `<figure><button class="foto" data-foto="${i}" aria-label="Ampliar: ${t}"><img src="assets/galeria/${arq}.jpg" alt="${t}" loading="lazy"><span class="passo-n">${i + 1}</span></button>
    <figcaption><b>${t}</b><span>${d}</span></figcaption></figure>`).join("")}</div>
  ${titulo("users", "Todos participaram: cada um no seu login", "As 8 contas do estudo, cada uma com o papel certo. Quatro pessoas da equipe e quatro especialistas, todos dentro do IntelliC.", "p")}
  <div class="galeria logins">${GALERIA.slice(N_PASSOS).map(([arq, t, d], j) => { const i = j + N_PASSOS; const ag = j >= 4;
    return `<figure class="${ag ? "fig-ag" : "fig-eq"}"><button class="foto" data-foto="${i}" aria-label="Ampliar: ${t}"><img src="assets/galeria/${arq}.jpg" alt="${t}" loading="lazy"><span class="selo-papel">${ag ? "Especialista" : t.split(" · ")[1]}</span></button>
    <figcaption><b>${t.split(" · ")[0]}</b><span>${d}</span></figcaption></figure>`; }).join("")}</div>
  <div class="grid duas" style="margin-top:28px">
    <div>${titulo("puzzle", "Como ele é construído", "Lemos o pacote do sistema para entender a arquitetura.", "p")}
      <div class="card tabela-wrap"><table class="stack"><tbody>${stack.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("")}</tbody></table>
      <p class="porque">${ic("eye", 16, "#ffb347")} O código separa bem as camadas: telas, regras de autorização (acessar, analisar e gerenciar um problema), o motor de cálculo e o banco. Foi lendo o motor que conseguimos reproduzir o cálculo aqui no site e conferir número por número.</p></div></div>
    <div>${titulo("search", "O que mais ele oferece", "Recursos que vimos e que não precisamos neste estudo, mas que mostram até onde ele vai.", "p")}
      <div class="grid g2">${recursos.map(([i, t, d]) => `<div class="tarefa">${ic(i, 24, "#8fb0e0")}<div><b>${t}</b><span>${d}</span></div></div>`).join("")}</div></div>
  </div>`;
}
function abrirFoto(i) {
  const [arq, t, d] = GALERIA[i]; const dlg = $("#lightbox");
  dlg.querySelector("img").src = `assets/galeria/${arq}.jpg`; dlg.querySelector("img").alt = t;
  dlg.querySelector("p").innerHTML = `<b>${i + 1}. ${t}</b> · ${d}`; dlg.showModal();
}

// ---- resultado: peças extras
function mapaDivergencia() {
  const ks = Object.keys(CRIT);
  const cor = v => v >= 40 ? "#1f9d5a" : v >= 10 ? "#5cbf7d" : v > -10 ? "#c9a227" : v > -40 ? "#e07b39" : "#d14343";
  const linhas = ESP.map(a => `<tr><td><b>${a.curto}</b><small>${a.papel}</small></td>${ks.map(k => { const [c, d] = a.notas[k]; const g = arred((c - d) * 10);
    return `<td><span class="cel" style="--h:${cor(g)}" title="Chance ${c} · Dúvida ${d}">${sinal(g)}</span></td>`; }).join("")}</tr>`).join("");
  const amplitude = ks.map(k => { const gs = ESP.map(a => arred((a.notas[k][0] - a.notas[k][1]) * 10)); return Math.max(...gs) - Math.min(...gs); });
  return `<div class="card tabela-wrap"><table class="mapa"><thead><tr><th>Especialista</th>${ks.map(k => `<th>${CRIT[k][0]}<small>${k}</small></th>`).join("")}</tr></thead>
    <tbody>${linhas}</tbody><tfoot><tr><td>Distância entre o mais otimista e o mais cético</td>${amplitude.map(v => `<td><b>${v}</b></td>`).join("")}</tr></tfoot></table>
    <p class="desc" style="margin-top:10px">Cada célula é o grau de certeza da pessoa (Chance − Dúvida). Verde aponta para “funciona”, vermelho para “não funciona”. Passe o mouse para ver as notas.</p></div>`;
}
function votacaoVsIntellic() {
  const todas = ESP.flatMap(a => Object.values(a.notas));
  const mediaC = todas.reduce((s, v) => s + v[0], 0) / todas.length;
  const mediaD = todas.reduce((s, v) => s + v[1], 0) / todas.length;
  const fmt = v => v.toFixed(1).replace(".", ",");
  return `<div class="grid duas vs">
    <div class="card"><div class="kicker">${ic("users", 16, "#9db3d1")}Se fosse uma votação comum</div>
      <p class="vs-num">${fmt(mediaC * 10)}%</p><p class="vs-sub">de “chance média” (${mediaC.toFixed(2).replace(".", ",")} de 10)</p>
      <p style="color:#d6e4fa">A média diria que a estratégia passa raspando. A dúvida média de ${fmt(mediaD)} some no meio da conta, e ninguém vê que no Alcance um especialista deu 9 e outro deu 3.</p></div>
    <div class="card vs-ic"><div class="kicker">${ic("sparkles", 16, "#ffb347")}O que o IntelliC mostrou</div>
      <p class="vs-num" style="color:var(--fogo2)">${sinal(GC)}%</p><p class="vs-sub">de viabilidade · ${ESTADO.toLowerCase()}</p>
      <p style="color:#d6e4fa">Ele separa evidência a favor e contra, junta os especialistas em grupos e respeita o mais cauteloso. Resultado: a estratégia <b>não</b> se sustenta sozinha, e dá para apontar exatamente em que critério ela falha.</p></div>
  </div>`;
}
function oQueFariaVirar() {
  const ks = Object.keys(CRIT);
  return `<div class="grid g5">${ks.map(k => { const { rg, gc } = CALC[k]; const fraco = rg.reduce((m, g, i) => g.gc < rg[m].gc ? i : m, 0); const falta = LIMITE - rg[fraco].gc;
    return `<div class="card falta"><b>${CRIT[k][0]}</b><small>hoje ${sinal(gc)}%</small>
      <div class="trilho-falta"><div style="width:${Math.max(0, (gc + 100) / 2)}%"></div><i style="left:80%"></i></div>
      <p>Faltam <b>${falta} pontos</b> no grupo ${NOMES_G[fraco]} (${rg[fraco].membros.map(m => m.nome).join(" e ")}).</p></div>`; }).join("")}</div>
    <p class="porque">${ic("eye", 16, "#ffb347")} Para chegar a Viável, alguém do grupo mais cético precisaria dar, por exemplo, Chance 8 e Dúvida 2 em <b>todos</b> os critérios. Isso só acontece com outra estratégia, ou com o satélite somado a brigadas e combate à grilagem.</p>`;
}

// ---- fontes de pesquisa
function paginaFontes() {
  const porUrl = new Map();
  for (const a of ESP) for (const [org, txt, url] of (FONTES[a.id]?.itens ?? [])) {
    if (!porUrl.has(url)) porUrl.set(url, { org, txt, url, agentes: [] });
    porUrl.get(url).agentes.push(a);
  }
  const ordem = ["Órgãos públicos", "Legislação", "Pesquisa científica"];
  const grupos = ordem.map(t => [t, [...porUrl.values()].filter(f => (D.TIPO_FONTE[f.org] ?? "Pesquisa científica") === t)]);
  const icone = { "Órgãos públicos": "landmark", "Legislação": "scale", "Pesquisa científica": "search" };
  return `${titulo("bookmark", "Fontes de pesquisa", "Nada do que os agentes dizem saiu da cabeça deles. Cada argumento se apoia em dado público: órgão do governo, lei ou pesquisa. Abaixo está tudo o que usamos, com o link para conferir.")}
  <div class="grid g3" style="margin-bottom:8px">${grupos.map(([t, l]) => `<div class="card stat"><b>${l.length}</b><span>${t.toLowerCase()}</span></div>`).join("")}</div>
  ${grupos.map(([t, lista]) => `${titulo(icone[t], t, "", "p")}
    <ol class="fontes">${lista.map(f => `<li><b>${esc(f.org)}</b><span>${esc(f.txt)}</span>
      <span class="usado">Usado por: ${f.agentes.map(a => `<i style="--c:${a.cores[0]}">${a.curto}</i>`).join(" ")}</span>
      <a href="${f.url}" target="_blank" rel="noopener">Ver a fonte ↗</a></li>`).join("")}</ol>`).join("")}
  <div class="card" style="margin-top:24px"><h3>${ic("eye", 20, "#ffb347")}Como usamos essas fontes</h3>
    <p style="color:#d6e4fa">Cada agente recebeu as fontes da área dele antes de dar as notas. A Helena se apoia no INPE, o Raimundo no Prevfogo e no MapBiomas, o Marcos no Fundo Amazônia, no IPAM e na lei, e a Jaci na lei de manejo do fogo e no trabalho com brigadas indígenas. Por isso as notas divergem: cada um enxerga um pedaço real do problema.</p></div>`;
}

// ============================================================ navegação
const ABAS = ["inicio", "intellic", "especialistas", "resultado", "fontes", "facilitadores", "analistas"];
let estado = { aba: "inicio", sub: null };
function render() {
  document.querySelectorAll(".aba").forEach(b => b.setAttribute("aria-selected", b.dataset.aba === estado.aba));
  const html = { inicio: paginaInicio, intellic: paginaIntellic, especialistas: () => paginaEspecialistas(estado.sub), resultado: paginaResultado, fontes: paginaFontes,
    facilitadores: () => paginaGrupo("facilitadores", estado.sub), analistas: () => paginaGrupo("analistas", estado.sub) }[estado.aba]();
  $("#conteudo").innerHTML = html;
  preencherRobos();
  if (estado.aba === "resultado") montarSimulador();
}
function irPara(aba, sub = null) {
  estado = { aba, sub };
  try { history.replaceState(null, "", "#" + aba + (sub ? "-" + sub : "")); } catch (e) {}
  render(); window.scrollTo({ top: 0 });
}
document.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.dataset.foto) { abrirFoto(+b.dataset.foto); return; }
  if (b.hasAttribute("data-fechar")) { $("#lightbox").close(); return; }
  if (b.dataset.aba) irPara(b.dataset.aba);
  else if (b.dataset.sub) irPara(estado.aba, b.dataset.sub);
  else if (b.dataset.crit) { critAtual = b.dataset.crit; document.querySelectorAll("[data-crit]").forEach(x => x.setAttribute("aria-pressed", x === b)); $("#conta").innerHTML = contaCriterio(critAtual); $("#quadrado").innerHTML = quadradoSVG(critAtual); }
  else if (b.dataset.simcrit) { simCrit = b.dataset.simcrit; document.querySelectorAll("[data-simcrit]").forEach(x => x.setAttribute("aria-pressed", x === b)); montarSimulador(); }
});
document.addEventListener("input", e => {
  const r = e.target; if (!r.matches("#sim-sliders input")) return;
  r.nextElementSibling.textContent = r.value;
  (simNotas[simCrit] ??= {})[r.dataset.a] ??= [...ESP.find(a => a.id === r.dataset.a).notas[simCrit].slice(0, 2)];
  simNotas[simCrit][r.dataset.a][+r.dataset.t] = +r.value;
  atualizarSimulador();
});
function lerHash() {
  const h = (location.hash || "").slice(1).split("-");
  estado = { aba: ABAS.includes(h[0]) ? h[0] : "inicio", sub: h[1] || null };
  render();
}
window.addEventListener("hashchange", lerHash);
lerHash();
