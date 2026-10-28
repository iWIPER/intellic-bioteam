import * as D from "./dados.js";
import * as K from "./calculo.js";

const { LIMITE, PROBLEMA, CRIT, ESP, EQUIPE, CORES, TAREFAS, STATS, LEIT } = D;
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
function reel({ miolo, nome, papel, cores, mini = false }) {
  return `<div class="reel${mini ? " mini" : ""}" style="--c1:${cores[0]};--c2:${cores[1]}"><div class="tela">
    <div class="barras"><i class="on"></i><i></i><i></i></div>
    <div class="topo"><span>iC</span>IntelliC · BIOTEAM</div>${miolo}
    <div class="legenda"><b>${esc(nome)}</b><em>${esc(papel)}</em></div></div></div>`;
}
const reelAgente = (a, mini) => reel({ miolo: `<iframe title="Robô de ${esc(a.curto)}" data-robo="${a.id}" sandbox="allow-same-origin" loading="lazy"></iframe>`, nome: a.nome, papel: a.papel, cores: a.cores, mini });
const reelPessoa = (p, cores, mini) => reel({ miolo: `<img src="assets/caricaturas/${p.slug}.jpg" alt="Caricatura de ${esc(p.nome)}">`, nome: p.nome, papel: p.papel, cores, mini });
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
    </section>
    <div class="grid">
      <div class="card"><h3>${ic("target", 20, "#ffb347")}Problema em análise</h3><p class="problema">${PROBLEMA}</p></div>
      <div class="grid g2">${[["4", "especialistas"], ["5", "critérios"], ["20", "pareceres"], ["60%", "limite"]].map(([n, l]) => `<div class="card stat"><b>${n}</b><span>${l}</span></div>`).join("")}</div>
    </div>
  </div>
  ${titulo("bot", "Os especialistas", "Quatro agentes de IA, quatro saberes diferentes sobre o mesmo problema. A divergência entre eles é o que a Lógica Paraconsistente mede.")}
  <div class="grid g4">${ESP.map(a => `<div class="reel-col"><p class="balao mini" style="--c:${a.cores[0]}">“${esc(a.frase)}”</p>${reelAgente(a, true)}</div>`).join("")}</div>
  <div class="card" style="margin-top:24px"><h3>${ic("compass", 20, "#ffb347")}Fluxo de governança</h3>
    <div class="flow">
      <div class="step" style="--c:#3a78d8"><b>${ic("compass", 20, "#8fb0e0")}Facilitadores</b><small>Montam o Problema, os critérios e os participantes</small></div>
      <div class="step" style="--c:#ff7a1a"><b>${ic("bot", 20, "#ff7a1a")}Especialistas</b><small>Cada um dá Chance e Dúvida (0 a 10) por critério, sem ver o parecer dos outros</small></div>
      <div class="step" style="--c:#2fbf71"><b>${ic("sparkles", 20, "#2fbf71")}IntelliC</b><small>A Lógica Paraconsistente calcula viabilidade (GC) e dúvida (GI) sem apagar a divergência</small></div>
      <div class="step" style="--c:#d4a017"><b>${ic("search", 20, "#d4a017")}Analistas</b><small>Leem o resultado e o Quadrado Mágico e traduzem em recomendação</small></div>
    </div></div>
  ${titulo("users", "Equipe BIOTEAM")}
  <div class="grid g4">${pessoas.map(([p, c]) => `<div class="reel-col">${reelPessoa(p, c, true)}</div>`).join("")}</div>`;
}

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
  <div class="card" style="margin-top:22px"><h3>${ic("gauge", 20, "#ffb347")}Notas lançadas no IntelliC</h3><div class="notas">${notas}</div></div>`;
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
      ${titulo("clipboard-list", "O que faz no estudo", "", "p")}
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
    <p style="display:flex;gap:14px;flex-wrap:wrap;align-items:center">Classificação do IntelliC: ${badge(ESTADO)}<span class="confere">${ic("shield-check", 16, "#2fbf71")}Recalculado com o mesmo algoritmo do IntelliC v20 R10: confere com o sistema (GC −2%, GI 0%).</span></p></section>
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

// ============================================================ navegação
const ABAS = ["inicio", "especialistas", "resultado", "facilitadores", "analistas"];
let estado = { aba: "inicio", sub: null };
function render() {
  document.querySelectorAll(".aba").forEach(b => b.setAttribute("aria-selected", b.dataset.aba === estado.aba));
  const html = { inicio: paginaInicio, especialistas: () => paginaEspecialistas(estado.sub), resultado: paginaResultado,
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
