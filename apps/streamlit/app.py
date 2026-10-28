"""Apresentação do estudo IntelliC — BIOTEAM · SEDCITEC IFSP 2026.

Rodar:  streamlit run app.py   (ou dois cliques em rodar-apresentacao.bat)
"""
import base64
import math
import re
from functools import lru_cache
from pathlib import Path

import altair as alt
import pandas as pd
import streamlit as st

BASE = Path(__file__).parent
AGENTES_DIR = BASE / "agentes"
ICONES_DIR = BASE / "icons"  # ícones Lucide (lucide-static 0.460.0, licença ISC)
FOTOS_DIR = BASE / "fotos"   # fotos da equipe: joseane.jpg, hellen.jpg, wilk.jpg, gislene.jpg
FOTOS_DIR.mkdir(exist_ok=True)
EXTENSOES = (".jpg", ".jpeg", ".png", ".webp")

st.set_page_config(
    page_title="IntelliC · Quem decide como apagar o fogo?",
    page_icon="🔥",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ======================================================================= dados
PROBLEMA = (
    "O monitoramento por satélite com alerta precoce é eficaz para reduzir "
    "os incêndios florestais na Amazônia?"
)

CRITERIOS = {
    "EFI": "Reduz a área queimada de forma mensurável",
    "CAU": "Ataca a causa (uso criminoso do fogo)",
    "CUS": "Custo sustentável no longo prazo",
    "ESC": "Alcança áreas remotas com a logística que existe",
    "SOC": "Tem adesão das comunidades locais",
}

ESPECIALISTAS = [
    {
        "id": "helena", "icone": "satellite", "aba": ":material/satellite_alt: Helena",
        "nome": "Dra. Helena Monteiro Andrade", "handle": "dra.helena.sat",
        "papel": "Sensoriamento remoto · perfil INPE", "cores": ("#2fbf71", "#3a78d8"),
        "frase": "O satélite enxerga a Amazônia inteira todo dia. Nenhuma outra solução tem esse alcance.",
        "funcao": "Pesquisadora em sensoriamento remoto e geoprocessamento (perfil tipo INPE)",
        "formacao": "Doutora em Sensoriamento Remoto",
        "experiencia": "15 anos analisando focos de calor e área queimada por satélite na Amazônia",
        "avalia": "Se o alerta é confiável: precisão, falsos positivos, atraso do dado, nuvem e fumaça cobrindo a imagem.",
        "posicao": [
            "Eu confio no que é medido. O satélite cobre a Amazônia inteira todos os dias, a um custo por quilômetro quadrado que nenhuma patrulha de campo alcança. Em 2026 já vemos queda nos alertas de desmatamento no Pará e em Mato Grosso e nos focos do Acre. Não afirmo que tudo isso seja mérito do alerta, mas é o único instrumento que permite cruzar focos, risco de fogo e seca para mandar fiscalização e brigada antes do pico do El Niño.",
            "Sou honesta sobre os limites: nuvem e fumaça atrapalham a imagem, há atraso entre a passagem do satélite e o alerta, e existem falsos positivos. O alerta só reduz o fogo se virar ação em campo. Sem resposta, é só um mapa bonito.",
        ],
        "respostas": [
            ("Raimundo", "O risco de fogo e a seca já indicam o perigo antes da chama, então o satélite também antecipa, não só avisa o que já queima."),
            ("Marcos", "Concordo que não ataca a causa sozinho, mas cada alerta vira prova e prioridade para fiscalizar quem usa o fogo ilegalmente."),
            ("Jaci", "O gargalo é de comunicação, não de dado, e o alerta precisa ser levado à aldeia por rádio, celular e agentes locais."),
        ],
        "notas": {
            "EFI": (7, 4, "Há queda de alertas e focos em 2026, mas é difícil provar que o alerta sozinho causou isso, e o El Niño pode reverter."),
            "CAU": (4, 6, "O satélite detecta o fogo, não impede a pecuária e a grilagem; só pesa se virar fiscalização e punição."),
            "CUS": (8, 3, "Dados públicos e cobertura diária por custo baixo; o gasto real está na resposta em campo."),
            "ESC": (9, 3, "Cobre toda a Amazônia todo dia; nuvem, fumaça e logística de chegada ao local são os limites."),
            "SOC": (5, 6, "O alerta ainda não chega à aldeia e há pouca participação local; é o ponto mais fraco da estratégia."),
        },
    },
    {
        "id": "raimundo", "icone": "flame", "aba": ":material/local_fire_department: Raimundo",
        "nome": "Raimundo Tavares Lima", "handle": "raimundo.brigada",
        "papel": "Chefe de brigada · perfil PrevFogo/Ibama", "cores": ("#ff6a1a", "#d62828"),
        "frase": "O satélite me avisa quando já está queimando. Alerta sem gente perto é só um mapa bonito.",
        "funcao": "Chefe de brigada de combate a incêndio florestal (perfil Ibama/PrevFogo)",
        "formacao": "Técnico em meio ambiente, brigadista certificado",
        "experiencia": "18 temporadas de fogo no sul do Amazonas",
        "avalia": "Se dá para agir a tempo depois do alerta: equipe, logística, barco, combustível e acesso ao local.",
        "posicao": [
            "Rapaz, 18 temporadas de fogo no sul do Amazonas me ensinaram: o satélite me avisa quando já está queimando. O sistema é bom, eu não digo que não, ele me mostra onde olhar. Mas alerta sem gente perto é só um mapa bonito.",
            "Entre o aviso chegar e eu ter barco, combustível, brigadista descansado e acesso, na seca o rio baixa, o ramal fecha e o fogo anda mais rápido que a gente. Para funcionar, o alerta tem que vir com base avançada, equipe pré-posicionada antes do pico e fiscalização que alcance quem põe fogo de propósito. Satélite sem brigada é diagnóstico. Com brigada, é tratamento.",
        ],
        "respostas": [
            ("Helena", "Risco de fogo e seca me ajudam a pré-posicionar equipe, concordo. Mas prever o perigo não apaga nada, e o atraso da imagem come a janela de poucas horas em que dá para segurar o fogo."),
            ("Marcos", "Alerta barato sem brigada e sem fiscalização é economia que vira floresta queimada depois."),
            ("Jaci", "Tem razão: se o alerta não chega na aldeia, quem conhece o território e chega primeiro fica de fora. Eu botava brigadista indígena no rádio e na folha de pagamento."),
        ],
        "notas": {
            "EFI": (5, 6, "Quando a brigada chega a tempo, apaga; mas muitas vezes chego com o fogo já grande."),
            "CAU": (3, 4, "O alerta mostra o fogo, não quem pôs; só ataca a causa se virar fiscalização."),
            "CUS": (6, 5, "Satélite é barato, mas brigada, combustível e base custam toda temporada e a verba oscila."),
            "ESC": (3, 3, "Sul do Amazonas na seca: o alerta chega, eu não."),
            "SOC": (4, 6, "A comunidade adere se ganhar rádio e brigada local; hoje o alerta não chega na aldeia."),
        },
    },
    {
        "id": "marcos", "icone": "landmark", "aba": ":material/account_balance: Marcos",
        "nome": "Marcos Albuquerque Ferreira", "handle": "marcos.gestao",
        "papel": "Gestor público · Secretaria de Meio Ambiente", "cores": ("#d4a017", "#13315c"),
        "frase": "O dado é público, o caro é a resposta. E ninguém para de grilar por causa de um ponto no mapa.",
        "funcao": "Secretário-adjunto de Meio Ambiente do Estado (gestor público)",
        "formacao": "Administrador público, com especialização em políticas ambientais",
        "experiencia": "10 anos em gestão de orçamento e de programas entre órgãos",
        "avalia": "Custo, orçamento, base legal, integração entre órgãos e viabilidade política.",
        "posicao": [
            "O satélite é o melhor custo-benefício que o Estado tem: o dado do INPE é público e cobre a Amazônia inteira todo dia. Mas alerta não apaga fogo nem prende grileiro. O que pesa no orçamento é a resposta: brigada pré-posicionada, base avançada, combustível, diárias e fiscalização com respaldo legal.",
            "Eu aprovo a estratégia se o recurso para a resposta vier junto, em convênio entre órgãos e com continuidade além de um mandato. Sem isso, vira painel bonito e floresta queimada. E, com El Niño no segundo semestre, não dá para prometer o que o caixa não cobre.",
        ],
        "respostas": [
            ("Helena", "Concordo que cada alerta vira prova, mas só se houver fiscal e processo para usá-la; sem isso, é arquivo."),
            ("Raimundo", "Você tem razão: alerta barato sem brigada é falsa economia, e por isso proponho amarrar o orçamento da resposta ao do monitoramento."),
            ("Jaci", "Se o alerta não chega na aldeia, o sistema falha de verdade, e levar o dado até lá (rádio, celular, brigada indígena) precisa constar no orçamento."),
        ],
        "notas": {
            "EFI": (7, 4, "Alertas caíram no PA e MT e focos no AC, mas o El Niño pode desfazer o ganho."),
            "CAU": (3, 3, "Alerta sozinho não atinge a grilagem; só vira prova se houver fiscalização."),
            "CUS": (8, 5, "O dado é barato e público; o custo real e incerto está na resposta de campo."),
            "ESC": (7, 5, "O satélite cobre tudo, mas a brigada depende de base, estrada e rio."),
            "SOC": (3, 6, "Alerta não chega à aldeia e não tenho dado sobre a adesão local."),
        },
    },
    {
        "id": "jaci", "icone": "trees", "aba": ":material/forest: Jaci",
        "nome": "Jaci Apurinã da Silva", "handle": "jaci.territorio",
        "papel": "Liderança e brigadista indígena · território", "cores": ("#c0392b", "#2f6b3a"),
        "frase": "Nós vemos a fumaça antes de qualquer satélite. O alerta chega para quem?",
        "funcao": "Liderança e brigadista indígena (território e comunidade)",
        "formacao": "Agente agroflorestal indígena, formada em Manejo Integrado do Fogo",
        "experiencia": "Coordena a brigada comunitária da sua terra indígena no sul do Amazonas",
        "avalia": "A realidade no território: internet para receber o alerta, confiança da comunidade e conhecimento tradicional do fogo.",
        "posicao": [
            "Não sou contra o satélite. Mas ele enxerga o fogo depois que o fogo começou, e nós vemos a fumaça antes. O alerta só vale se chegar à aldeia: aqui a internet falha, e o que funciona é o rádio. Meu povo cuida do fogo há muito tempo, e esse conhecimento não aparece em nenhuma imagem.",
            "Se a estratégia continuar desenhada longe do território, vira mais um relatório bonito. Quero brigadista indígena com salário, rádio e energia solar na aldeia, e a comunidade decidindo junto como o alerta circula. E lembro: o fogo grande vem da grilagem e da pecuária. Alerta não prende ninguém.",
        ],
        "respostas": [
            ("Helena", "Concordo que o gargalo é comunicação; então o primeiro investimento é rádio e energia na aldeia, e não mais um satélite."),
            ("Raimundo", "Brigadista indígena no rádio só funciona se o salário vier todo ano, e não só quando sai edital."),
            ("Marcos", "Me mostre onde a comunidade senta à mesa de decisão e de onde vem o dinheiro para o alerta chegar à aldeia; sem isso, é plano de gabinete."),
        ],
        "notas": {
            "EFI": (6, 6, "O alerta ajuda a chegar antes do pico, mas só reduz área queimada se houver brigada no local para agir."),
            "CAU": (3, 4, "O satélite mostra onde queima, não quem ateou; a grilagem e a pecuária seguem intactas."),
            "CUS": (5, 7, "O dado é barato, mas manter brigada paga e rádio no território depende de decisão política."),
            "ESC": (4, 5, "O satélite cobre tudo, mas o alerta não chega onde não há sinal, energia nem estrada."),
            "SOC": (3, 3, "Sem incluir a comunidade e seu conhecimento do fogo, não há adesão; hoje ela mal é consultada."),
        },
    },
]

EQUIPE = {
    "facilitadores": [
        {"slug": "wilk", "nome": "Wilk", "iniciais": "WM", "handle": "wilk.bioteam",
         "papeis": ["Facilitador"], "bio": "Organiza a estrutura do estudo para que os especialistas possam opinar."},
        {"slug": "gislene", "nome": "Gislene", "iniciais": "GP", "handle": "gislene.bioteam",
         "papeis": ["Facilitadora"], "bio": "Organiza a estrutura do estudo para que os especialistas possam opinar."},
    ],
    "analistas": [
        {"slug": "joseane", "nome": "Joseane", "iniciais": "JL", "handle": "joseane.bioteam",
         "papeis": ["Analista"], "bio": "Interpreta o resultado do IntelliC e traduz os números em recomendação."},
        {"slug": "hellen", "nome": "Hellen", "iniciais": "HS", "handle": "hellen.bioteam",
         "papeis": ["Analista"], "bio": "Interpreta o resultado do IntelliC e traduz os números em recomendação."},
    ],
}
CORES_FAC = ("#3a78d8", "#2fbf71")
CORES_ANA = ("#d4a017", "#ff7a1a")

TAREFAS = {
    "facilitadores": [
        ("file-text", "Monta o Problema", "Título, descrição, tipo colaborativo e limite de decisão de 60%."),
        ("ruler", "Define a régua", "Cadastra os 5 critérios (EFI, CAU, CUS, ESC, SOC) antes de ver qualquer nota."),
        ("user-plus", "Convida os participantes", "Marca quem é Especialista, Analista e Facilitador."),
        ("traffic-cone", "Libera e acompanha", "Libera o Problema para pareceres e acompanha as pendências até todos responderem."),
    ],
    "titular": ("crown", "Titular do Problema", "Conduz o estudo e é quem pode encerrar a coleta de pareceres."),
    "analistas": [
        ("gauge", "Lê o resultado geral", "Índice de viabilidade (GC), índice de dúvida (GI) e o estado final do Problema."),
        ("puzzle", "Interpreta o Quadrado Mágico", "Mostra onde cada critério caiu: viável, inviável, tendência ou dúvida excessiva."),
        ("scale", "Encontra a divergência", "Aponta em quais critérios os especialistas mais discordam e por quê."),
        ("messages-square", "Traduz em recomendação", "O IntelliC compara e indica; quem decide é a pessoa: seguir, ajustar, esperar ou parar."),
    ],
}
STATS = {
    "facilitadores": [("1", "problema"), ("5", "critérios"), ("8", "participantes")],
    "analistas": [("20", "pareceres"), ("5", "critérios"), ("1", "resultado")],
}

# Resultado calculado pelo IntelliC (Problema 1, limite 60%)
RESULTADO_GERAL = {"gc": -2, "gi": 0, "estado": "Tendência a ser inviável"}
RESULTADO_CRITERIOS = {
    "EFI": (0, 10, "Tendência a ser inviável"),
    "CAU": (-10, -30, "Tendência a ser inviável"),
    "CUS": (10, 10, "Tendência a ser viável"),
    "ESC": (0, 20, "Tendência a ser inviável"),
    "SOC": (-10, -10, "Tendência a ser inviável"),
}
LIMITE = 60


# ===================================================================== helpers
def html(s: str) -> None:
    st.markdown(s, unsafe_allow_html=True)


@lru_cache(maxsize=None)
def _svg_icone(nome: str) -> str:
    svg = (ICONES_DIR / f"{nome}.svg").read_text(encoding="utf-8")
    svg = re.sub(r"<!--.*?-->", "", svg, flags=re.S).strip()
    svg = re.sub(r"\s+", " ", svg)  # uma linha só, para o Markdown não quebrar o HTML
    return re.sub(r'\s(width|height)="24"', "", svg)


def icone(nome: str, tam: int = 20, cor: str = "currentColor") -> str:
    svg = _svg_icone(nome)
    return svg.replace("<svg", f'<svg width="{tam}" height="{tam}" style="color:{cor};flex:none;vertical-align:-4px"', 1)


def leitura(c: int, d: int):
    if c >= 5 and d < 5:
        return "Convicção", "#2fbf71"
    if c >= 5:
        return "Contradição", "#ff7a1a"
    if d < 5:
        return "Falta de informação", "#8fb0e0"
    return "Incerteza", "#d4a017"


def foto_arquivo(slug: str):
    for ext in EXTENSOES:
        f = FOTOS_DIR / f"{slug}{ext}"
        if f.exists():
            return f
    return None


@lru_cache(maxsize=None)
def robo_agente(agent_id: str):
    """Extrai só o robozinho (SVG animado + CSS) do HTML que o agente gerou."""
    fonte = (AGENTES_DIR / f"{agent_id}.html").read_text(encoding="utf-8")
    css = re.search(r"<style>(.*?)</style>", fonte, re.S).group(1)
    svg = re.search(r"<svg.*?</svg>", fonte, re.S).group(0)
    return css, svg


REEL_CSS = """
html,body{height:100%;margin:0!important;padding:0!important;background:transparent!important;overflow:hidden}
body{display:flex;align-items:center;justify-content:center;font-family:'Inter',system-ui,sans-serif}
.reel{position:relative;height:calc(100% - 44px);aspect-ratio:9/16;border-radius:30px;padding:4px;
  background:linear-gradient(160deg,var(--c1),var(--c2),#ff7a1a);
  animation:balanca 5s ease-in-out infinite,brilho 3.2s ease-in-out infinite}
.tela{position:relative;width:100%;height:100%;border-radius:26px;overflow:hidden;
  background:radial-gradient(circle at 50% 38%,color-mix(in srgb,var(--c1) 45%,transparent),transparent 62%),
             linear-gradient(180deg,#0e2a52,#07142b)}
.tela>img{width:100%;height:100%;object-fit:cover;display:block;animation:zoom 9s ease-in-out infinite}
.robo{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:16% 0 34%}
.robo svg{height:100%!important;width:auto!important;max-width:90%!important;margin:0!important;overflow:visible;
  filter:drop-shadow(0 14px 22px rgba(0,0,0,.45))}
.vazio{position:absolute;inset:0;display:grid;place-items:center;text-align:center;
  background:radial-gradient(circle at 30% 20%,rgba(255,255,255,.2),transparent 50%),linear-gradient(160deg,var(--c1),var(--c2))}
.vazio b{font-family:'Space Grotesk',sans-serif;font-size:min(26vw,5.4rem);color:#fff;display:block;line-height:1}
.vazio small{color:rgba(255,255,255,.88);font-size:.9rem}
.barras{position:absolute;top:12px;left:12px;right:12px;display:flex;gap:5px;z-index:3}
.barras i{flex:1;height:4px;border-radius:99px;background:rgba(255,255,255,.35);overflow:hidden}
.barras i.on::after{content:"";display:block;height:100%;background:#fff;animation:progresso 6s linear infinite}
.topo{position:absolute;top:26px;left:14px;z-index:3;display:flex;align-items:center;gap:8px;color:#fff;
  font-weight:700;font-size:.82rem;text-shadow:0 1px 4px rgba(0,0,0,.6)}
.topo span{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:.68rem;
  background:linear-gradient(135deg,#ff7a1a,#d62828)}
.legenda{position:absolute;left:0;right:0;bottom:0;z-index:3;padding:70px 18px 20px;
  background:linear-gradient(0deg,rgba(0,0,0,.88),transparent)}
.legenda b{display:block;font-family:'Space Grotesk',sans-serif;font-size:clamp(1rem,5.5vw,1.45rem);color:#fff;line-height:1.15}
.legenda em{display:inline-block;margin-top:8px;font-style:normal;font-size:.7rem;font-weight:700;letter-spacing:.1em;
  text-transform:uppercase;padding:4px 10px;border-radius:99px;background:var(--c1);color:#fff}
@keyframes balanca{0%,100%{transform:translateY(0) rotate(-1.4deg)}50%{transform:translateY(-10px) rotate(1.4deg)}}
@keyframes brilho{0%,100%{box-shadow:0 18px 40px rgba(0,0,0,.45)}50%{box-shadow:0 0 0 8px rgba(255,179,71,.18),0 26px 50px rgba(0,0,0,.5)}}
@keyframes zoom{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes progresso{from{width:0}to{width:100%}}
@media(prefers-reduced-motion:reduce){*{animation:none!important}}
"""


def reel(miolo: str, nome: str, papel: str, cores, altura: int, css_extra: str = "") -> None:
    """Quadro no formato Reels (9:16) balançando. O mesmo quadro serve para os agentes e para a equipe."""
    doc = f"""<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;700&display=swap" rel="stylesheet">
<style>{css_extra}</style><style>{REEL_CSS}</style></head>
<body><div class="reel" style="--c1:{cores[0]};--c2:{cores[1]}"><div class="tela">
<div class="barras"><i class="on"></i><i></i><i></i></div>
<div class="topo"><span>iC</span>IntelliC · BIOTEAM</div>
{miolo}
<div class="legenda"><b>{nome}</b><em>{papel}</em></div>
</div></div></body></html>"""
    url = "data:text/html;base64," + base64.b64encode(doc.encode("utf-8")).decode()
    st.iframe(url, height=altura)


def reel_agente(a: dict, altura: int) -> None:
    css, svg = robo_agente(a["id"])
    reel(f'<div class="robo">{svg}</div>', a["nome"], a["papel"].split(" · ")[0], a["cores"], altura, css)


@lru_cache(maxsize=32)
def foto_leve(caminho: str, modificado: float) -> str:
    """Reduz a foto (no máximo 900 px de altura, JPEG) para caber no quadro: fotos grandes não carregam no iframe."""
    from io import BytesIO

    from PIL import Image, ImageOps

    img = ImageOps.exif_transpose(Image.open(caminho)).convert("RGB")
    img.thumbnail((900, 1200))
    buf = BytesIO()
    img.save(buf, "JPEG", quality=85)
    return base64.b64encode(buf.getvalue()).decode()


def reel_pessoa(p: dict, papel: str, cores, altura: int) -> None:
    f = foto_arquivo(p["slug"])
    if f:
        miolo = f'<img src="data:image/jpeg;base64,{foto_leve(str(f), f.stat().st_mtime)}" alt="">'
    else:
        miolo = f'<div class="vazio"><div><b>{p["iniciais"]}</b><small>📷 adicione a foto</small></div></div>'
    reel(miolo, p["nome"], papel, cores, altura)


def trocar_foto(slug: str, nome: str) -> None:
    with st.expander(f"Adicionar ou trocar a foto de {nome.split()[0]}", icon=":material/photo_camera:"):
        envio = st.file_uploader("Foto em pé (vertical) fica melhor · JPG, PNG ou WEBP",
                                 type=["jpg", "jpeg", "png", "webp"], key=f"up_{slug}")
        if envio is not None:
            ext = Path(envio.name).suffix.lower().replace(".jpeg", ".jpg")
            destino = FOTOS_DIR / f"{slug}{ext}"
            dados = envio.getvalue()
            if not destino.exists() or destino.read_bytes() != dados:
                for antiga in FOTOS_DIR.glob(f"{slug}.*"):
                    antiga.unlink()
                destino.write_bytes(dados)
                st.rerun()
        if foto_arquivo(slug) and st.button("Remover foto", key=f"rm_{slug}"):
            for antiga in FOTOS_DIR.glob(f"{slug}.*"):
                antiga.unlink()
            st.rerun()


def cabecalho_perfil(handle: str, nome: str, selo: str, stats, bio_linhas, cor: str) -> str:
    """Cabeçalho no estilo perfil do Instagram."""
    st_html = "".join(f'<div><b>{n}</b><span>{rotulo}</span></div>' for n, rotulo in stats)
    bio = "".join(f'<li>{icone(ic, 18, cor)}<span>{t}</span></li>' for ic, t in bio_linhas)
    return f"""
<div class="perfil" style="--c:{cor}">
  <div class="perfil-topo">
    <span class="handle">@{handle}</span>{icone("badge-check", 22, "#3897f0")}
    <span class="selo">{selo}</span>
  </div>
  <div class="stats">{st_html}</div>
  <h2>{nome}</h2>
  <ul class="bio">{bio}</ul>
  <div class="acoes-ig"><span>{icone("heart", 18)} Seguir</span><span>{icone("send", 18)} Mensagem</span><span>{icone("bookmark", 18)}</span></div>
</div>"""


# ====================================================================== estilo
st.markdown(
    """
<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;600;700&display=swap');
html, body, [class*="css"], .stMarkdown, p, li { font-family: 'Inter', system-ui, sans-serif; }
h1, h2, h3, .hero-title, .titulo { font-family: 'Space Grotesk', system-ui, sans-serif !important; }
header[data-testid="stHeader"], footer, #MainMenu { display: none !important; }
.block-container { padding: 1.2rem 2.5rem 2rem !important; max-width: 100% !important; }
.stApp {
  background:
    radial-gradient(circle at 10% 6%, rgba(47,191,113,.16), transparent 36%),
    radial-gradient(circle at 92% 14%, rgba(255,122,26,.14), transparent 40%),
    linear-gradient(180deg, #07142b 0%, #0b1f3d 55%, #0a2a28 100%);
  background-attachment: fixed;
}
iframe { border: none !important; background: transparent !important; }

/* abas */
.stTabs [data-baseweb="tab-list"] { gap: 8px; flex-wrap: wrap; }
.stTabs [data-baseweb="tab"] { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.12);
  border-radius: 12px; padding: 10px 18px; height: auto; }
.stTabs [data-baseweb="tab"] p { font-size: 1.02rem; font-weight: 600; }
.stTabs [aria-selected="true"] { background: linear-gradient(135deg,#ff7a1a,#d62828) !important; border-color: transparent; }
.stTabs [aria-selected="true"] p { color: #fff !important; }
.stTabs [data-baseweb="tab-highlight"], .stTabs [data-baseweb="tab-border"] { display: none; }

.titulo { display: flex; align-items: center; gap: 12px; font-size: 2rem; font-weight: 700; color: #fff; margin: 6px 0 4px; }
.lead { color: #b9cbe6; font-size: 1.02rem; margin-bottom: 14px; }
.kicker { letter-spacing: .2em; text-transform: uppercase; font-size: .76rem; color: #ffb347; display: flex; gap: 8px; align-items: center; }

.hero { border-radius: 28px; padding: 46px 44px; position: relative; overflow: hidden;
  background: linear-gradient(135deg, rgba(12,35,71,.95), rgba(10,42,40,.95));
  border: 1px solid rgba(255,255,255,.12); box-shadow: 0 20px 60px rgba(0,0,0,.35); height: 100%; }
.hero::after { content: ""; position: absolute; right: -90px; top: -90px; width: 360px; height: 360px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,122,26,.35), transparent 65%); }
.hero-title { font-size: clamp(3.2rem, 7vw, 6rem); font-weight: 700; line-height: 1; margin: 10px 0 6px;
  background: linear-gradient(90deg, #ffffff, #8fe3b0 55%, #ffb347); -webkit-background-clip: text; color: transparent; }
.hero .sub { font-size: 1.25rem; color: #cfe0f8; }
.hero .q { margin-top: 24px; font-family: 'Space Grotesk'; font-size: clamp(1.5rem, 2.6vw, 2.3rem); font-weight: 700; color: #fff; }
.hero .q span { color: #ff7a1a; }

.card { background: rgba(255,255,255,.055); border: 1px solid rgba(255,255,255,.12); border-radius: 22px;
  padding: 22px 24px; height: 100%; backdrop-filter: blur(6px); }
.card h3 { margin: 0 0 12px; font-size: 1.12rem; color: #ffb347; display: flex; gap: 10px; align-items: center; }
.card h3 svg, .titulo svg, .kicker svg, .step b svg, .leit b svg { margin-right: 6px; }
.card p { color: #d6e4fa; }
.stat { text-align: center; }
.stat .n { font-family: 'Space Grotesk'; font-size: 2.8rem; font-weight: 700; color: #fff; line-height: 1; }
.stat .l { color: #9db3d1; font-size: .9rem; margin-top: 6px; }
.problema { font-family: 'Space Grotesk'; font-size: 1.4rem; font-weight: 600; color: #fff; }

.flow { display: flex; flex-wrap: wrap; gap: 10px; align-items: stretch; }
.step { flex: 1 1 200px; background: rgba(0,0,0,.22); border-radius: 16px; padding: 16px; border-top: 4px solid var(--c); }
.step b { display: flex; gap: 8px; align-items: center; font-family: 'Space Grotesk'; font-size: 1.05rem; color: #fff; }
.step small { color: #b9cbe6; }
.seta { align-self: center; color: #ffb347; font-size: 1.5rem; }

/* balão em cima do quadro */
.balao { position: relative; background: #fff; color: #10223f; border-radius: 20px; padding: 16px 20px; margin: 4px auto 6px;
  max-width: 420px; text-align: center; font-weight: 600; font-size: 1.02rem; line-height: 1.4;
  box-shadow: 0 10px 26px rgba(0,0,0,.35); border-bottom: 5px solid var(--c); }
.balao::after { content: ""; position: absolute; left: 50%; bottom: -16px; margin-left: -12px;
  border: 12px solid transparent; border-top-color: var(--c); border-bottom: 0; }
.balao.mini { font-size: .9rem; padding: 12px 14px; }

/* perfil estilo Instagram */
.perfil { padding: 4px 0 6px; }
.perfil-topo { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.handle { font-family: 'Space Grotesk'; font-size: 1.5rem; font-weight: 700; color: #fff; }
.selo { margin-left: 6px; font-size: .74rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  padding: 4px 12px; border-radius: 99px; background: var(--c); color: #fff; }
.stats { display: flex; gap: 34px; margin: 16px 0 10px; }
.stats b { display: block; font-family: 'Space Grotesk'; font-size: 1.5rem; color: #fff; line-height: 1.1; }
.stats span { color: #9db3d1; font-size: .88rem; }
.perfil h2 { margin: 6px 0 8px !important; font-size: 1.9rem !important; color: #fff; }
.bio { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
.bio li { display: flex; gap: 10px; align-items: flex-start; color: #d6e4fa; font-size: .98rem; margin: 0; }
.acoes-ig { display: flex; gap: 10px; margin-top: 16px; }
.acoes-ig span { display: inline-flex; gap: 8px; align-items: center; padding: 8px 16px; border-radius: 10px;
  background: rgba(255,255,255,.08); color: #fff; font-weight: 600; font-size: .9rem; }
.acoes-ig span:first-child { background: #3897f0; }

.resposta { display: flex; gap: 12px; padding: 12px 14px; border-radius: 14px; background: rgba(0,0,0,.22); margin-bottom: 10px; }
.resposta b { color: #fff; display: block; margin-bottom: 2px; }
.resposta span { color: #cfe0f8; font-size: .94rem; }
.tarefa { display: flex; gap: 14px; padding: 14px 16px; border-radius: 16px; background: rgba(0,0,0,.22); height: 100%; }
.tarefa b { color: #fff; display: block; margin-bottom: 2px; }
.tarefa span { color: #b9cbe6; font-size: .93rem; }

.notas { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; }
.nota { background: rgba(0,0,0,.22); border-radius: 16px; padding: 14px 16px; border-left: 4px solid var(--t); }
.nota .cab { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.nota .cab b { color: #fff; font-family: 'Space Grotesk'; font-size: 1.05rem; }
.nota .tag { font-size: .7rem; font-weight: 700; padding: 3px 9px; border-radius: 99px; background: var(--t); color: #07142b; }
.nota .desc { color: #9db3d1; font-size: .8rem; margin: 2px 0 8px; }
.nota .linha { display: grid; grid-template-columns: 56px 1fr 22px; gap: 8px; align-items: center; font-size: .8rem; color: #b9cbe6; margin-top: 4px; }
.nota .trilho { height: 10px; border-radius: 99px; background: rgba(255,255,255,.1); overflow: hidden; }
.nota .trilho div { height: 100%; border-radius: 99px; }
.nota .linha b { color: #fff; text-align: right; }
.nota p { color: #d6e4fa; font-size: .88rem; margin: 8px 0 0; }

.mini-agente { text-align: center; padding: 0 4px; }
.mini-agente b { display: block; font-family: 'Space Grotesk'; color: #fff; font-size: 1.05rem; margin-top: 4px; }
.mini-agente small { color: #9db3d1; }

.veredito { border-radius: 22px; padding: 26px; text-align: center;
  background: linear-gradient(135deg, rgba(214,40,40,.25), rgba(255,122,26,.18)); border: 1px solid rgba(255,122,26,.45); }
.veredito .big { font-family: 'Space Grotesk'; font-size: 2rem; font-weight: 700; color: #fff; }
.veredito .nums { margin-top: 8px; color: #ffd9b8; font-size: 1.05rem; }
.leit { border-radius: 16px; padding: 16px 18px; background: rgba(0,0,0,.22); border-left: 5px solid var(--c); height: 100%; }
.leit b { font-family: 'Space Grotesk'; color: var(--c); text-transform: uppercase; letter-spacing: .08em; font-size: .85rem;
  display: flex; gap: 8px; align-items: center; }
.leit p { color: #e2ecfb; margin: 6px 0 0; }
/* explicabilidade em linguagem simples */
.resposta-1 { border-radius: 26px; padding: 30px 34px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--e) 24%, transparent), rgba(255,255,255,.04));
  border: 1px solid color-mix(in srgb, var(--e) 60%, transparent); }
.frase-grande { font-family: 'Space Grotesk'; font-size: clamp(1.6rem, 2.8vw, 2.5rem); font-weight: 700; color: #fff; line-height: 1.2; margin: 10px 0 16px; }
.frase-grande span { color: var(--e); }
.linha-estado { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; color: #cfe0f8; }
.regua-card { background: rgba(255,255,255,.055); border: 1px solid rgba(255,255,255,.12); border-radius: 24px; padding: 24px 26px; height: 100%; }
.rc-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.rc-t { display: block; color: #9db3d1; font-size: .85rem; letter-spacing: .06em; text-transform: uppercase; }
.rc-p { display: block; font-family: 'Space Grotesk'; font-size: 1.5rem; color: #fff; margin-top: 2px; }
.rc-val { font-family: 'Space Grotesk'; font-size: 2.6rem; font-weight: 700; color: #ffb347; line-height: 1; }
.regua { position: relative; margin: 34px 0 6px; }
.regua .faixas { display: flex; height: 22px; border-radius: 99px; overflow: hidden; opacity: .9; }
.marcador { position: absolute; top: -12px; transform: translateX(-50%); width: 6px; height: 46px; border-radius: 4px;
  background: #fff; box-shadow: 0 0 0 3px #07142b, 0 0 18px rgba(255,255,255,.7); }
.marcador span { position: absolute; top: -30px; left: 50%; transform: translateX(-50%); background: #fff; color: #07142b;
  font-weight: 700; font-size: .85rem; padding: 2px 8px; border-radius: 8px; white-space: nowrap; }
.ticks { position: relative; height: 18px; margin-top: 10px; }
.ticks span { position: absolute; transform: translateX(-50%); color: #9db3d1; font-size: .78rem; }
.zonas-lbl { display: flex; margin-top: 4px; }
.zonas-lbl div { text-align: center; color: #cfe0f8; font-size: .8rem; font-weight: 600; padding: 0 4px; }
.rc-leitura { display: flex; gap: 10px; align-items: flex-start; margin-top: 16px; padding: 12px 14px; border-radius: 14px;
  background: rgba(255,179,71,.1); color: #fff; font-weight: 600; }
.rc-exp { color: #b9cbe6; font-size: .92rem; margin: 12px 0 0; }
.media-cab, .media-linha { display: grid; grid-template-columns: 1.4fr 2.2fr 70px 110px; gap: 14px; align-items: center; }
.media-cab { color: #9db3d1; font-size: .8rem; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,.1); }
.media-linha { padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,.06); }
.ml-nome b { color: #fff; font-family: 'Space Grotesk'; display: block; }
.ml-nome small { color: #9db3d1; font-size: .78rem; }
.ml-barra { position: relative; height: 16px; background: rgba(255,255,255,.07); border-radius: 99px; }
.ml-zero { position: absolute; left: 50%; top: -4px; bottom: -4px; width: 2px; background: rgba(255,255,255,.5); }
.ml-fill { position: absolute; top: 0; bottom: 0; border-radius: 99px; min-width: 4px; }
.ml-num { font-family: 'Space Grotesk'; font-size: 1.25rem; font-weight: 700; color: #fff; text-align: right; }
.ml-gi { color: #9db3d1; font-size: .85rem; }
.conta-media { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; }
.conta-media div { background: rgba(255,179,71,.1); border-radius: 14px; padding: 12px 16px; }
.conta-media span { display: block; color: #9db3d1; font-size: .82rem; }
.conta-media b { font-family: 'Space Grotesk'; font-size: 1.2rem; color: #fff; }
.exemplo { display: flex; gap: 6px; align-items: flex-start; margin-top: auto; padding-top: 10px; border-top: 1px dashed rgba(255,255,255,.15); }
.exemplo span { color: #b9f0cf !important; font-size: .86rem !important; }

/* explicabilidade */
.veredito2 { border-radius: 24px; padding: 26px 28px; height: 100%;
  background: linear-gradient(135deg, color-mix(in srgb, var(--e) 26%, transparent), rgba(255,255,255,.04));
  border: 1px solid color-mix(in srgb, var(--e) 60%, transparent); }
.veredito2 .big { font-family: 'Space Grotesk'; font-size: 2.4rem; font-weight: 700; color: #fff; margin: 6px 0 8px; }
.veredito2 p { color: #e2ecfb; font-size: 1.02rem; }
.conf { display: flex; gap: 8px; align-items: center; color: #b9f0cf; font-size: .88rem; margin-top: 6px; }
.anel-box { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; height: 100%;
  background: rgba(255,255,255,.055); border: 1px solid rgba(255,255,255,.12); border-radius: 24px; padding: 22px; }
.anel { width: 170px; height: 170px; border-radius: 50%; display: grid; place-items: center; }
.anel-miolo { width: 132px; height: 132px; border-radius: 50%; background: #0b1f3d; display: grid; place-items: center; }
.anel-miolo b { font-family: 'Space Grotesk'; font-size: 2.3rem; color: #fff; }
.anel-box span { color: #b9cbe6; font-weight: 600; }
.estado { display: inline-block; padding: 5px 12px; border-radius: 99px; font-size: .78rem; font-weight: 700;
  background: var(--e); color: #07142b; white-space: nowrap; }
.passos { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
@media (max-width: 1100px) { .passos { grid-template-columns: repeat(2, 1fr); } }
.passo { position: relative; background: rgba(255,255,255,.055); border: 1px solid rgba(255,255,255,.12); border-radius: 20px;
  padding: 20px 18px 18px; display: flex; flex-direction: column; gap: 8px; }
.passo .num { position: absolute; top: 14px; right: 16px; font-family: 'Space Grotesk'; font-size: 2rem; font-weight: 700; color: rgba(255,179,71,.35); }
.passo b { font-family: 'Space Grotesk'; color: #fff; font-size: 1.1rem; }
.passo span { color: #c6d6ee; font-size: .92rem; }
.passo span b { font-size: .92rem; color: #ffd9b8; }
table.conta { width: 100%; border-collapse: collapse; font-size: .98rem; }
table.conta th { text-align: center; color: #9db3d1; font-weight: 600; font-size: .82rem; padding: 8px; border-bottom: 1px solid rgba(255,255,255,.15); }
table.conta th:first-child, table.conta td:first-child { text-align: left; }
table.conta td { text-align: center; color: #e2ecfb; padding: 12px 8px; border-bottom: 1px solid rgba(255,255,255,.07); }
table.conta td.win { background: rgba(47,191,113,.22); color: #fff; font-weight: 700; border-radius: 8px; }
table.conta td.win2 { background: rgba(58,120,216,.28); color: #fff; font-weight: 700; border-radius: 8px; }
.legenda-conta { color: #9db3d1; font-size: .82rem; margin-top: 10px; }
.legenda-conta .win { color: #2fbf71; font-weight: 700; } .legenda-conta .win2 { color: #6fa8ff; font-weight: 700; }
.gtag { display: inline-grid; place-items: center; width: 28px; height: 28px; border-radius: 8px; font-weight: 700; color: #fff; }
.gtag.g0, .grupo.g0 { --g: #8b5cf6; } .gtag.g1, .grupo.g1 { --g: #06b6d4; } .gtag.g2, .grupo.g2 { --g: #ec4899; }
.gtag { background: var(--g); }
.grupos { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.grupo { border-radius: 16px; padding: 14px; background: rgba(0,0,0,.25); border-top: 4px solid var(--g); }
.grupo > b { color: #fff; font-family: 'Space Grotesk'; display: block; }
.grupo div b { color: #fff; font-family: 'Space Grotesk'; font-size: 1.05rem; }
.grupo small { color: #9db3d1; display: block; margin-bottom: 6px; }
.grupo div { color: #e2ecfb; font-size: .9rem; }
.entre { text-align: center; color: #ffd9b8; margin: 12px 0; display: flex; gap: 8px; justify-content: center; align-items: center; }
.final-c { display: flex; gap: 18px; align-items: center; justify-content: center; flex-wrap: wrap; padding: 16px; border-radius: 18px;
  background: color-mix(in srgb, var(--e) 18%, rgba(0,0,0,.25)); border: 1px solid color-mix(in srgb, var(--e) 55%, transparent); }
.final-c div { text-align: center; } .final-c div span { display: block; color: #9db3d1; font-size: .8rem; }
.final-c .estado { font-size: .9rem; padding: 7px 14px; }
.final-c b { font-family: 'Space Grotesk'; font-size: 1.8rem; color: #fff; }
.porque { color: #d6e4fa; font-size: .93rem; margin-top: 12px; }
.crit-linha { padding: 10px 0 10px 14px; border-left: 4px solid var(--e); margin-bottom: 8px; }
.crit-linha .cl-top { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.crit-linha .cl-top b { font-family: 'Space Grotesk'; color: #fff; font-size: 1.1rem; }
.crit-linha .cl-top span:not(.estado) { color: #9db3d1; font-size: .85rem; }
.crit-linha p { color: #d6e4fa; font-size: .9rem; margin: 4px 0 0; }
.card.destaque { background: linear-gradient(135deg, rgba(255,122,26,.14), rgba(47,191,113,.08)); border-color: rgba(255,179,71,.35); }
.tres { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 6px 0 12px; }
.tres div { background: rgba(0,0,0,.22); border-radius: 14px; padding: 14px; }
.tres b { color: #fff; display: block; font-family: 'Space Grotesk'; margin-bottom: 4px; }
.tres span { color: #c6d6ee; font-size: .92rem; }
.rodape { text-align: center; color: #7f97b8; font-size: .82rem; margin-top: 34px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,.1); }
</style>
""",
    unsafe_allow_html=True,
)


def titulo(ic: str, texto: str, lead: str = "") -> None:
    html(f'<div class="titulo">{icone(ic, 32, "#ffb347")}{texto}</div>')
    if lead:
        html(f'<div class="lead">{lead}</div>')


def espaco(px: int = 16) -> None:
    html(f'<div style="height:{px}px"></div>')


# ================================================================ página: perfis
def pagina_agente(a: dict) -> None:
    c1 = a["cores"][0]
    esq, dir_ = st.columns([1, 2.1], gap="large")
    with esq:
        html(f'<div class="balao" style="--c:{c1}">“{a["frase"]}”</div>')
        reel_agente(a, 700)
    with dir_:
        html(f'<div class="kicker">{icone("sparkles", 16, "#ffb347")}Estudo de decisão · Lógica Paraconsistente</div>')
        chance = sum(v[0] for v in a["notas"].values()) / 5
        duvida = sum(v[1] for v in a["notas"].values()) / 5
        html(cabecalho_perfil(
            a["handle"], a["nome"], "Agente de IA",
            [(f"{chance:.1f}", "chance média"), (f"{duvida:.1f}", "dúvida média"), ("5", "critérios")],
            [("briefcase", a["funcao"]), ("graduation-cap", a["formacao"]), ("award", a["experiencia"]), ("eye", a["avalia"])],
            c1,
        ))
        espaco(14)
        p1, p2 = st.columns([1.25, 1], gap="medium")
        with p1:
            paragrafos = "".join(f"<p>{t}</p>" for t in a["posicao"])
            html(f'<div class="card"><h3>{icone("quote", 20, "#ffb347")}Posição no debate</h3>{paragrafos}</div>')
        with p2:
            resp = "".join(
                f'<div class="resposta">{icone("message-circle", 20, c1)}<div><b>Para {quem}</b><span>{txt}</span></div></div>'
                for quem, txt in a["respostas"]
            )
            html(f'<div class="card"><h3>{icone("messages-square", 20, "#ffb347")}Respostas aos outros agentes</h3>{resp}</div>')
    espaco(18)
    notas = ""
    for k, (c, d, j) in a["notas"].items():
        tag, cor = leitura(c, d)
        notas += (
            f'<div class="nota" style="--t:{cor}"><div class="cab"><b>{k}</b><span class="tag">{tag}</span></div>'
            f'<div class="desc">{CRITERIOS[k]}</div>'
            f'<div class="linha">Chance<div class="trilho"><div style="width:{c*10}%;background:linear-gradient(90deg,#14804a,#2fbf71)"></div></div><b>{c}</b></div>'
            f'<div class="linha">Dúvida<div class="trilho"><div style="width:{d*10}%;background:linear-gradient(90deg,#ff7a1a,#ffb347)"></div></div><b>{d}</b></div>'
            f'<p>{j}</p></div>'
        )
    html(f'<div class="card"><h3>{icone("gauge", 20, "#ffb347")}Notas lançadas no IntelliC</h3><div class="notas">{notas}</div></div>')


def pagina_pessoa(p: dict, grupo: str) -> None:
    cores = CORES_FAC if grupo == "facilitadores" else CORES_ANA
    papel = " · ".join(p["papeis"])
    esq, dir_ = st.columns([1, 2.1], gap="large")
    with esq:
        reel_pessoa(p, papel, cores, 700)
        trocar_foto(p["slug"], p["nome"])
    with dir_:
        html(f'<div class="kicker">{icone("users", 16, "#ffb347")}Equipe BIOTEAM · Desafio IntelliC</div>')
        bio = [("briefcase", f"{papel} no estudo IntelliC"), ("target", p["bio"]),
               ("map-pin", "SEDCITEC · IFSP 2026")]
        html(cabecalho_perfil(p["handle"], p["nome"], papel, STATS[grupo], bio, cores[0]))
        espaco(16)
        tarefas = list(TAREFAS[grupo])
        if "Titular" in p["papeis"]:
            tarefas.append(TAREFAS["titular"])
        html(f'<div class="titulo" style="font-size:1.3rem">{icone("clipboard-list", 24, "#ffb347")}O que faz no estudo</div>')
        espaco(10)
        for i in range(0, len(tarefas), 2):
            cols = st.columns(2, gap="medium")
            for col, (ic, t, d) in zip(cols, tarefas[i:i + 2]):
                with col:
                    html(f'<div class="tarefa">{icone(ic, 24, cores[0])}<div><b>{t}</b><span>{d}</span></div></div>')
            espaco(10)


# ========================================================================= abas
aba_inicio, aba_esp, aba_res, aba_fac, aba_ana = st.tabs([
    ":material/home: Início",
    ":material/smart_toy: Especialistas",
    ":material/insights: Resultado",
    ":material/explore: Facilitadores",
    ":material/manage_search: Analistas",
])

# ---------------------------------------------------------------------- Início
with aba_inicio:
    h1, h2 = st.columns([1.6, 1], gap="large")
    with h1:
        html(f"""
<div class="hero">
  <div class="kicker">{icone("flame", 16, "#ffb347")}Desafio IntelliC · SEDCITEC IFSP 2026 · BIOTEAM</div>
  <div class="hero-title">IntelliC</div>
  <div class="sub">Inteligência Colaborativa com Lógica Paraconsistente</div>
  <div class="q">Quem decide como <span>apagar o fogo?</span></div>
</div>""")
    with h2:
        html(f'<div class="card"><h3>{icone("target", 20, "#ffb347")}Problema em análise</h3><div class="problema">{PROBLEMA}</div></div>')
        espaco(12)
        s = st.columns(2)
        for col, (n, rotulo) in zip(s * 2, [("4", "especialistas"), ("5", "critérios"), ("20", "pareceres"), ("60%", "limite")]):
            with col:
                html(f'<div class="card stat"><div class="n">{n}</div><div class="l">{rotulo}</div></div>')
                espaco(10)

    espaco(26)
    titulo("bot", "Os especialistas", "Quatro agentes de IA, quatro saberes diferentes sobre o mesmo problema. A divergência entre eles é o que a Lógica Paraconsistente mede.")
    cols = st.columns(4, gap="medium")
    for col, a in zip(cols, ESPECIALISTAS):
        with col:
            html(f'<div class="balao mini" style="--c:{a["cores"][0]}">“{a["frase"]}”</div>')
            reel_agente(a, 520)

    espaco(20)
    html(f"""
<div class="card"><h3>{icone("compass", 20, "#ffb347")}Fluxo de governança</h3>
<div class="flow">
  <div class="step" style="--c:#3a78d8"><b>{icone("compass", 20, "#8fb0e0")}Facilitadores</b><small>Montam o Problema, os critérios e os participantes</small></div>
  <div class="seta">→</div>
  <div class="step" style="--c:#ff7a1a"><b>{icone("bot", 20, "#ff7a1a")}Especialistas</b><small>Cada um dá Chance e Dúvida (0 a 10) por critério, sem ver o parecer dos outros</small></div>
  <div class="seta">→</div>
  <div class="step" style="--c:#2fbf71"><b>{icone("sparkles", 20, "#2fbf71")}IntelliC</b><small>A Lógica Paraconsistente calcula viabilidade (GC) e dúvida (GI) sem apagar a divergência</small></div>
  <div class="seta">→</div>
  <div class="step" style="--c:#d4a017"><b>{icone("search", 20, "#d4a017")}Analistas</b><small>Leem o resultado e o Quadrado Mágico e traduzem em recomendação</small></div>
</div></div>""")

    espaco(26)
    titulo("users", "Equipe BIOTEAM")
    cols = st.columns(4, gap="medium")
    pessoas = [(p, "facilitadores") for p in EQUIPE["facilitadores"]] + [(p, "analistas") for p in EQUIPE["analistas"]]
    for col, (p, g) in zip(cols, pessoas):
        with col:
            reel_pessoa(p, " · ".join(p["papeis"]), CORES_FAC if g == "facilitadores" else CORES_ANA, 520)

# ---------------------------------------------------------------- Especialistas
with aba_esp:
    titulo("bot", "Especialistas", "Cada agente defende o seu ângulo, responde aos outros e dá as notas que foram lançadas no IntelliC.")
    sub = st.tabs([a["aba"] for a in ESPECIALISTAS])
    for t, a in zip(sub, ESPECIALISTAS):
        with t:
            pagina_agente(a)

# -------------------------------------------------------------------- Resultado
# Mesmo algoritmo do IntelliC v20 R10 (CalculoParaconsistenteService + AgrupamentoService):
#   μ = Chance/10, λ = Dúvida/10, GC = μ − λ, GI = μ + λ − 1 (×100)
#   grupos de até 3 (mínimo 2 grupos), distribuídos em rodízio pela ordem de cadastro
#   dentro do grupo: maior GC e menor GI · entre grupos: menor GC e maior GI
#   resultado geral: média dos critérios
CORES_ESTADO = {
    "Viável": "#2fbf71",
    "Tendência a ser viável": "#f5d547",
    "Tendência a ser inviável": "#ff9a3c",
    "Inviável": "#e55353",
    "Inviável por dúvida excessiva": "#9aa7b8",
    "Indefinido": "#8fb0e0",
}
NOMES_GRUPO = ["Grupo A", "Grupo B", "Grupo C", "Grupo D"]


def arred(x: float) -> int:
    return math.floor(x + 0.5)  # igual ao Math.round do Java


def classificar(gc: int, gi: int, lim: int = LIMITE) -> str:
    if gc == 0 and gi == 0:
        return "Indefinido"
    if abs(gi) >= lim:
        return "Inviável por dúvida excessiva"
    if gc >= lim:
        return "Viável"
    if gc <= -lim:
        return "Inviável"
    return "Tendência a ser viável" if gc > 0 else "Tendência a ser inviável"


def calcular_criterio(entradas):
    """entradas: lista [(nome, chance, dúvida)] na ordem de cadastro dos especialistas."""
    indiv = []
    for nome, c, d in entradas:
        mu, la = c / 10, d / 10
        indiv.append({"nome": nome, "c": c, "d": d, "mu": mu, "la": la,
                      "gc": arred((mu - la) * 100), "gi": arred((mu + la - 1) * 100)})
    qtd = max(2, math.ceil(len(indiv) / 3))
    grupos = [[] for _ in range(qtd)]
    for i, e in enumerate(indiv):
        e["grupo"] = i % qtd
        grupos[i % qtd].append(e)
    res_grupos = [{"gc": max(e["gc"] for e in g), "gi": min(e["gi"] for e in g), "membros": g} for g in grupos]
    gc = min(r["gc"] for r in res_grupos)
    gi = max(r["gi"] for r in res_grupos)
    return indiv, res_grupos, gc, gi


def entradas_reais(k: str):
    return [(a["nome"].replace("Dra. ", "").split()[0], a["notas"][k][0], a["notas"][k][1]) for a in ESPECIALISTAS]


CALC = {k: calcular_criterio(entradas_reais(k)) for k in CRITERIOS}
GC_GERAL = arred(sum(v[2] for v in CALC.values()) / len(CALC))
GI_GERAL = arred(sum(v[3] for v in CALC.values()) / len(CALC))
CONFERE = (GC_GERAL, GI_GERAL) == (RESULTADO_GERAL["gc"], RESULTADO_GERAL["gi"]) and all(
    (CALC[k][2], CALC[k][3]) == RESULTADO_CRITERIOS[k][:2] for k in CRITERIOS)


def anel(valor: int, rotulo: str, cor: str) -> str:
    graus = abs(valor) / 100 * 360
    return f"""
<div class="anel-box">
  <div class="anel" style="background:conic-gradient({cor} {graus}deg, rgba(255,255,255,.08) 0)">
    <div class="anel-miolo"><b>{valor:+d}%</b></div>
  </div>
  <span>{rotulo}</span>
</div>"""


def badge_estado(estado: str) -> str:
    return f'<span class="estado" style="--e:{CORES_ESTADO[estado]}">{estado}</span>'


NOME_CURTO = {"EFI": "Eficácia", "CAU": "Causa", "CUS": "Custo", "ESC": "Alcance", "SOC": "Comunidades"}


def ler_gc(v: int) -> str:
    if v >= LIMITE:
        return "Funciona: os especialistas têm evidência forte a favor."
    if v > 0:
        return "Pende para “funciona”, mas sem força para chegar ao limite."
    if v == 0:
        return "Empate: o argumento a favor e o contra se anulam."
    if v > -LIMITE:
        return f"Praticamente empate, levemente para o lado do “não funciona” ({v:+d}%)."
    return "Não funciona: evidência forte contra."


def ler_gi(v: int) -> str:
    if v >= LIMITE:
        return "Contradição demais: resultado descartado."
    if v > 0:
        return "Um pouco de contradição: há notas altas a favor e contra ao mesmo tempo."
    if v == 0:
        return "Equilíbrio: nem contradição, nem falta de informação. Os especialistas se compensam."
    if v > -LIMITE:
        return "Um pouco de falta de informação: notas baixas a favor e contra."
    return "Falta de informação demais: resultado descartado."


def regua(titulo_r: str, pergunta: str, valor: int, zonas, leitura_r: str, explicacao: str) -> str:
    """Régua de −100 a +100 com as faixas do IntelliC e um marcador no valor."""
    larguras = [20, 30, 30, 20]  # −100..−60, −60..0, 0..60, 60..100
    faixas = "".join(f'<div style="width:{w}%;background:{c}"></div>' for w, (c, _) in zip(larguras, zonas))
    rotulos = "".join(f'<div style="width:{w}%">{t}</div>' for w, (_, t) in zip(larguras, zonas))
    pos = (valor + 100) / 2
    return f"""
<div class="regua-card">
  <div class="rc-top"><div><span class="rc-t">{titulo_r}</span><b class="rc-p">{pergunta}</b></div><div class="rc-val">{valor:+d}%</div></div>
  <div class="regua"><div class="faixas">{faixas}</div><div class="marcador" style="left:{pos}%"><span>{valor:+d}%</span></div></div>
  <div class="ticks"><span style="left:0">−100</span><span style="left:20%">−60</span><span style="left:50%">0</span><span style="left:80%">+60</span><span style="left:100%">+100</span></div>
  <div class="zonas-lbl">{rotulos}</div>
  <div class="rc-leitura">{icone("eye", 18, "#ffb347")}<span>{leitura_r}</span></div>
  <p class="rc-exp">{explicacao}</p>
</div>"""


def quadrado_magico(pontos: pd.DataFrame, destaque: str | None = None, altura: int = 470):
    """Quadrado Mágico com as mesmas regiões do IntelliC."""
    L = LIMITE
    regioes = pd.DataFrame([
        {"x": -100, "x2": -L, "y": -L, "y2": L, "cor": "#e55353"},
        {"x": -L, "x2": 0, "y": -L, "y2": L, "cor": "#ff9a3c"},
        {"x": 0, "x2": L, "y": -L, "y2": L, "cor": "#f5d547"},
        {"x": L, "x2": 100, "y": -L, "y2": L, "cor": "#2fbf71"},
        {"x": -100, "x2": 100, "y": L, "y2": 100, "cor": "#9aa7b8"},
        {"x": -100, "x2": 100, "y": -100, "y2": -L, "cor": "#9aa7b8"},
    ])
    eixo = alt.Scale(domain=[-100, 100], nice=False)
    fundo = alt.Chart(regioes).mark_rect(opacity=.28).encode(
        x=alt.X("x:Q", scale=eixo, title="Índice de viabilidade (GC) →"), x2="x2:Q",
        y=alt.Y("y:Q", scale=eixo, title="Índice de dúvida (GI) ↑"), y2="y2:Q",
        color=alt.Color("cor:N", scale=None))
    zero = alt.Chart(pd.DataFrame({"z": [0]}))
    linhas = (zero.mark_rule(color="#ffffff", opacity=.35).encode(x="z:Q")
              + zero.mark_rule(color="#ffffff", opacity=.35).encode(y="z:Q"))
    textos = alt.Chart(pd.DataFrame([
        {"x": -80, "y": -50, "t": "Inviável"}, {"x": -30, "y": -50, "t": "Tendência inviável"},
        {"x": 30, "y": -50, "t": "Tendência viável"}, {"x": 80, "y": -50, "t": "Viável"},
        {"x": 0, "y": 80, "t": "Dúvida excessiva"}, {"x": 0, "y": -80, "t": "Dúvida excessiva"},
    ])).mark_text(color="#ffffff", opacity=.6, fontSize=12).encode(x="x:Q", y="y:Q", text="t:N")
    pontos = pontos.copy()
    pontos["foco"] = pontos["rotulo"].apply(lambda r: destaque is None or r == destaque)
    base = alt.Chart(pontos)
    bolas = base.mark_circle(stroke="#07142b", strokeWidth=2).encode(
        x="gc:Q", y="gi:Q",
        size=alt.condition("datum.foco", alt.value(420), alt.value(160)),
        opacity=alt.condition("datum.foco", alt.value(1), alt.value(.35)),
        color=alt.Color("cor:N", scale=None),
        tooltip=[alt.Tooltip("rotulo:N", title=""), alt.Tooltip("gc:Q", title="GC"), alt.Tooltip("gi:Q", title="GI")])
    rotulos = None
    for _, p in pontos.iterrows():
        dx, dy = p["dx"], p["dy"]
        camada = alt.Chart(pd.DataFrame([p])).mark_text(
            dx=dx, dy=dy, fontSize=14 if p["foco"] else 11, fontWeight="bold",
            color="#ffffff" if p["foco"] else "#9db3d1").encode(x="gc:Q", y="gi:Q", text="rotulo:N")
        rotulos = camada if rotulos is None else rotulos + camada
    return (fundo + linhas + textos + bolas + rotulos).properties(height=altura).configure(
        background="transparent").configure_axis(
        gridColor="#ffffff10", labelColor="#cfe0f8", titleColor="#cfe0f8", values=[-100, -60, 0, 60, 100]
    ).configure_view(stroke="#ffffff30")


def pontos_resultado(simulado=None):
    offsets = {"EFI": (-26, -6), "ESC": (0, -18), "CUS": (28, -6), "SOC": (-30, 0), "CAU": (-30, 0), "GERAL": (30, 16)}
    linhas = []
    for k in CRITERIOS:
        gc, gi = CALC[k][2], CALC[k][3]
        linhas.append({"rotulo": k, "gc": gc, "gi": gi, "cor": CORES_ESTADO[classificar(gc, gi)],
                       "dx": offsets[k][0], "dy": offsets[k][1]})
    linhas.append({"rotulo": "GERAL", "gc": GC_GERAL, "gi": GI_GERAL, "cor": "#ff7a1a",
                   "dx": offsets["GERAL"][0], "dy": offsets["GERAL"][1]})
    if simulado:
        linhas.append({"rotulo": "SIMULADO", "gc": simulado[0], "gi": simulado[1], "cor": "#ffffff", "dx": 0, "dy": -20})
    return pd.DataFrame(linhas)


with aba_res:
    estado_geral = classificar(GC_GERAL, GI_GERAL)
    titulo("gauge", "Resultado e explicabilidade",
           "O IntelliC não faz média de opiniões nem votação: ele mede a evidência a favor, a evidência contra e a contradição entre os especialistas.")

    # ---- 1. a resposta em uma frase
    html(f"""
<div class="resposta-1" style="--e:{CORES_ESTADO[estado_geral]}">
  <div class="kicker">{icone("target", 16, "#ffb347")}A resposta do estudo em uma frase</div>
  <div class="frase-grande">Sozinho, o monitoramento por satélite <span>não resolve</span>:
  os especialistas ficaram no empate, levemente para o lado do “não funciona”.</div>
  <div class="linha-estado">Classificação do IntelliC: {badge_estado(estado_geral)}
  <span class="conf">{icone("shield-check", 16, "#2fbf71" if CONFERE else "#e55353")}
  {"Recalculado aqui com o mesmo algoritmo do IntelliC: confere com o sistema." if CONFERE else "Atenção: o recálculo não bateu com o IntelliC."}</span></div>
</div>""")

    # ---- 2. os dois números, explicados
    espaco(22)
    html(f'<div class="titulo" style="font-size:1.45rem">{icone("gauge", 26, "#ffb347")}Os dois números do IntelliC, sem mistério</div>')
    n1, n2 = st.columns(2, gap="large")
    with n1:
        html(regua(
            "Índice de viabilidade (GC)", "A estratégia funciona?", GC_GERAL,
            [("#e55353", "Não funciona"), ("#ff9a3c", "Pende para não"), ("#f5d547", "Pende para sim"), ("#2fbf71", "Funciona")],
            ler_gc(GC_GERAL),
            "Vai de <b>−100%</b> (todos têm certeza de que <b>não</b> funciona) a <b>+100%</b> (todos têm certeza de que <b>funciona</b>). "
            f"Para o IntelliC dizer “Viável”, precisa chegar a <b>+{LIMITE}%</b>.",
        ))
    with n2:
        html(regua(
            "Índice de dúvida (GI)", "Quão seguros os especialistas estão?", GI_GERAL,
            [("#9aa7b8", "Falta informação demais"), ("#7fb2ff", "Pouca informação"), ("#c39bff", "Alguma contradição"), ("#9aa7b8", "Contradição demais")],
            ler_gi(GI_GERAL),
            "<b>Negativo</b> = falta informação (deram nota baixa para a chance <i>e</i> para a dúvida). "
            "<b>Positivo</b> = contradição (nota alta nas duas). <b>Zero</b> = equilíbrio. "
            f"Se passar de <b>±{LIMITE}%</b>, o resultado é descartado por dúvida excessiva.",
        ))

    # ---- 3. de onde vem o −2%
    espaco(22)
    html(f'<div class="titulo" style="font-size:1.45rem">{icone("puzzle", 26, "#ffb347")}De onde vem o {GC_GERAL:+d}%</div>')
    html('<div class="lead">Cada critério recebe o seu próprio par de números (viabilidade e dúvida). O resultado geral é a <b>média dos 5 critérios</b>.</div>')
    linhas_media = ""
    for k in CRITERIOS:
        gc, gi = CALC[k][2], CALC[k][3]
        est = classificar(gc, gi)
        largura = abs(gc) / 100 * 50
        lado = f"left:50%;width:{largura}%" if gc >= 0 else f"left:{50 - largura}%;width:{largura}%"
        linhas_media += f"""
<div class="media-linha">
  <div class="ml-nome"><b>{NOME_CURTO[k]}</b><small>{k} · {CRITERIOS[k]}</small></div>
  <div class="ml-barra"><div class="ml-zero"></div><div class="ml-fill" style="{lado};background:{CORES_ESTADO[est]}"></div></div>
  <div class="ml-num">{gc:+d}%</div>
  <div class="ml-gi">dúvida {gi:+d}%</div>
</div>"""
    soma_gc = " ".join(f"{CALC[k][2]:+d}" for k in CRITERIOS)
    soma_gi = " ".join(f"{CALC[k][3]:+d}" for k in CRITERIOS)
    html(f"""
<div class="card">
  <div class="media-cab"><span>Critério</span><span>Viabilidade (← não funciona · funciona →)</span><span>GC</span><span>GI</span></div>
  {linhas_media}
  <div class="conta-media">
    <div><span>Viabilidade geral</span><b>({soma_gc}) ÷ 5 = {GC_GERAL:+d}%</b></div>
    <div><span>Dúvida geral</span><b>({soma_gi}) ÷ 5 = {GI_GERAL:+d}%</b></div>
  </div>
  <p class="porque">{icone("eye", 16, "#ffb347")} Atenção para não confundir: no critério <b>Causa (CAU)</b> a viabilidade é −10%
  e a <b>dúvida</b> é −30%. Esse −30% significa que <b>faltou informação</b>: os especialistas deram notas baixas tanto para a chance quanto
  para a dúvida. Ou seja, ninguém acredita que o alerta ataque a grilagem.</p>
</div>""")

    # ---- 4. como cada número nasce
    espaco(22)
    html(f'<div class="titulo" style="font-size:1.45rem">{icone("messages-square", 26, "#ffb347")}Como cada número nasce, com um exemplo real</div>')
    passos = [
        ("1", "messages-square", "Cada especialista dá duas notas",
         "<b>Chance</b> (0 a 10): o quanto acredita que funciona.<br><b>Dúvida</b> (0 a 10): o quanto desconfia da própria resposta.",
         "Helena, no Alcance: Chance 9, Dúvida 3."),
        ("2", "scale", "O IntelliC transforma em evidências",
         "A favor: <b>μ = Chance ÷ 10</b>.<br>Contra: <b>λ = Dúvida ÷ 10</b>.",
         "μ = 0,9 e λ = 0,3."),
        ("3", "gauge", "Calcula a certeza e a dúvida da pessoa",
         "<b>Viabilidade = μ − λ</b><br><b>Dúvida = μ + λ − 1</b>",
         "0,9 − 0,3 = <b>+60%</b> · 0,9 + 0,3 − 1 = <b>+20%</b>."),
        ("4", "users", "Junta as pessoas em grupos",
         "Dentro do grupo vale o <b>melhor argumento</b>. Entre os grupos vale o <b>mais cauteloso</b>.",
         "Grupo A (Helena + Marcos) = +60. Grupo B (Raimundo + Jaci) = 0. Fica <b>0</b>."),
        ("5", "target", "Decide",
         f"Faz a média dos 5 critérios e compara com o limite de <b>{LIMITE}%</b>.",
         f"Média = <b>{GC_GERAL:+d}%</b> → {estado_geral}."),
    ]
    html('<div class="passos">' + "".join(
        f'<div class="passo"><div class="num">{n}</div>{icone(ic, 22, "#ffb347")}<b>{t}</b><span>{d}</span>'
        f'<div class="exemplo">{icone("sparkles", 14, "#2fbf71")}<span>{ex}</span></div></div>'
        for n, ic, t, d, ex in passos) + "</div>")

    # ---- 3. explorador por critério
    espaco(26)
    html(f'<div class="titulo" style="font-size:1.45rem">{icone("search", 26, "#ffb347")}Abra a conta de um critério</div>')
    html('<div class="lead">Escolha um critério para ver a nota de cada especialista e como o IntelliC chegou ao resultado dele.</div>')
    escolha = st.segmented_control("Critério", list(CRITERIOS), default="ESC", key="crit_explorar",
                                   format_func=lambda k: f"{NOME_CURTO[k]} ({k})",
                                   label_visibility="collapsed") or "ESC"
    indiv, grupos, gc_c, gi_c = CALC[escolha]
    estado_c = classificar(gc_c, gi_c)
    html(f'<div class="lead"><b style="color:#fff">{NOME_CURTO[escolha]} ({escolha})</b> · {CRITERIOS[escolha]}<br>'
         f'<span style="color:#ffd9b8">Viabilidade {gc_c:+d}%: {ler_gc(gc_c)} · Dúvida {gi_c:+d}%: {ler_gi(gi_c)}</span></div>')
    e1, e2 = st.columns([1.3, 1], gap="large")
    with e1:
        linhas = ""
        for e in indiv:
            g = grupos[e["grupo"]]
            ganha_gc = e["gc"] == g["gc"]
            ganha_gi = e["gi"] == g["gi"]
            linhas += (
                f'<tr><td><b>{e["nome"]}</b></td><td><span class="gtag g{e["grupo"]}">{NOMES_GRUPO[e["grupo"]][-1]}</span></td>'
                f'<td>{e["c"]}</td><td>{e["d"]}</td><td>{e["mu"]:.1f}</td><td>{e["la"]:.1f}</td>'
                f'<td class="{"win" if ganha_gc else ""}">{e["gc"]:+d}</td><td class="{"win2" if ganha_gi else ""}">{e["gi"]:+d}</td></tr>'
            )
        html(f"""
<div class="card"><table class="conta">
<thead><tr><th>Especialista</th><th>Grupo</th><th>Chance</th><th>Dúvida</th><th>μ</th><th>λ</th><th>GC</th><th>GI</th></tr></thead>
<tbody>{linhas}</tbody></table>
<div class="legenda-conta"><span class="win">verde</span> = maior GC do grupo (o que vale dentro do grupo) ·
<span class="win2">azul</span> = menor GI do grupo</div></div>""")
    with e2:
        caixas = ""
        for i, g in enumerate(grupos):
            nomes = " + ".join(m["nome"] for m in g["membros"])
            caixas += (f'<div class="grupo g{i}"><b>{NOMES_GRUPO[i]}</b><small>{nomes}</small>'
                       f'<div>maior GC <b>{g["gc"]:+d}</b> · menor GI <b>{g["gi"]:+d}</b></div></div>')
        fraco = min(range(len(grupos)), key=lambda i: grupos[i]["gc"])
        html(f"""
<div class="card">
  <div class="grupos">{caixas}</div>
  <div class="entre">{icone("scale", 18, "#ffb347")} Entre os grupos: <b>menor GC</b> e <b>maior GI</b></div>
  <div class="final-c" style="--e:{CORES_ESTADO[estado_c]}">
    <div><span>GC</span><b>{gc_c:+d}%</b></div><div><span>GI</span><b>{gi_c:+d}%</b></div>{badge_estado(estado_c)}
  </div>
  <p class="porque">{icone("eye", 16, "#ffb347")} O resultado é tão forte quanto o grupo mais fraco:
  o <b>{NOMES_GRUPO[fraco]}</b> ({" e ".join(m["nome"] for m in grupos[fraco]["membros"])}) chegou só a <b>{grupos[fraco]["gc"]:+d}</b>,
  e é esse valor que o IntelliC leva.</p>
</div>""")

    # ---- 4. quadrado mágico + leitura por critério
    espaco(26)
    q1, q2 = st.columns([1.35, 1], gap="large")
    with q1:
        html(f'<div class="titulo" style="font-size:1.45rem">{icone("target", 26, "#ffb347")}Quadrado Mágico</div>')
        html('<div class="lead"><b>Como ler:</b> cada bolinha é um critério. <b>Para a direita</b> = funciona; <b>para a esquerda</b> = não funciona. '
             '<b>Para cima</b> = contradição; <b>para baixo</b> = falta de informação. Para ser Viável, a bolinha teria que chegar à faixa verde. '
             '<b>Todas ficaram no centro</b>: nenhum critério teve evidência forte o bastante.</div>')
        st.altair_chart(quadrado_magico(pontos_resultado(), destaque=escolha), width="stretch")
        html('<div class="lead" style="font-size:.88rem">Mesmas regiões do IntelliC: vermelho inviável · laranja tendência a inviável · amarelo tendência a viável · verde viável · cinza dúvida excessiva (|GI| ≥ 60%). O critério escolhido acima fica em destaque.</div>')
    with q2:
        html(f'<div class="titulo" style="font-size:1.45rem">{icone("clipboard-list", 26, "#ffb347")}Critério por critério</div>')
        leit = {
            "EFI": "Helena e Marcos acreditam; Raimundo e Jaci duvidam que a brigada chegue a tempo.",
            "CAU": "Todos concordam: alerta não ataca a grilagem. É o critério mais fraco.",
            "CUS": "Único positivo: o dado é barato. O custo incerto está na resposta em campo.",
            "ESC": "A maior briga: Helena dá 9, Raimundo dá 3. O satélite enxerga, a brigada nem sempre chega.",
            "SOC": "O alerta ainda não chega à aldeia: baixa adesão das comunidades.",
        }
        cards = ""
        for k in CRITERIOS:
            gc, gi = CALC[k][2], CALC[k][3]
            est = classificar(gc, gi)
            cards += (f'<div class="crit-linha" style="--e:{CORES_ESTADO[est]}"><div class="cl-top"><b>{NOME_CURTO[k]} ({k})</b>'
                      f'<span>GC {gc:+d} · GI {gi:+d}</span>{badge_estado(est)}</div><p>{leit[k]}</p></div>')
        html(f'<div class="card">{cards}</div>')

    # ---- 5. por que 60% é exigente
    espaco(22)
    html(f"""
<div class="card destaque">
  <h3>{icone("award", 22, "#ffb347")}Por que 60% já é um resultado alto</h3>
  <div class="tres">
    <div><b>O grupo mais fraco decide</b><span>Entre os grupos vale o <i>menor</i> GC. Basta um grupo cético para segurar o resultado.</span></div>
    <div><b>A maior dúvida prevalece</b><span>Entre os grupos vale o <i>maior</i> GI. Se a dúvida chega a 60%, o resultado vira “dúvida excessiva”.</span></div>
    <div><b>A média puxa para o centro</b><span>O geral é a média dos 5 critérios: um critério fraco derruba os outros.</span></div>
  </div>
  <p>Para um critério ser <b>Viável</b>, cada grupo precisa ter pelo menos um especialista com <b>Chance − Dúvida ≥ 6</b>
  (por exemplo, Chance 8 e Dúvida 2) — e isso em todos os critérios para o geral passar de 60%. Por isso, na prática,
  resultados acima de 60–65% são raros: quando aparecem, o grupo inteiro tem evidência forte e pouca contradição.</p>
</div>""")

    # ---- 6. simulador
    espaco(22)
    with st.expander("Simulador: e se os especialistas pensassem diferente?", icon=":material/tune:"):
        k_sim = st.selectbox("Critério", list(CRITERIOS), index=list(CRITERIOS).index("ESC"),
                             format_func=lambda k: f"{k} · {CRITERIOS[k]}", key="sim_crit")
        cols = st.columns(4, gap="medium")
        entradas = []
        for col, a in zip(cols, ESPECIALISTAS):
            nome = a["nome"].replace("Dra. ", "").split()[0]
            c0, d0, _ = a["notas"][k_sim]
            with col:
                html(f'<b style="color:#fff">{nome}</b>')
                c = st.slider("Chance", 0, 10, c0, key=f"sim_c_{k_sim}_{a['id']}")
                d = st.slider("Dúvida", 0, 10, d0, key=f"sim_d_{k_sim}_{a['id']}")
                entradas.append((nome, c, d))
        _, gs, gc_s, gi_s = calcular_criterio(entradas)
        est_s = classificar(gc_s, gi_s)
        real_gc, real_gi = CALC[k_sim][2], CALC[k_sim][3]
        s1, s2 = st.columns([1, 1.3], gap="large")
        with s1:
            html(f"""
<div class="final-c" style="--e:{CORES_ESTADO[est_s]}">
  <div><span>GC</span><b>{gc_s:+d}%</b></div><div><span>GI</span><b>{gi_s:+d}%</b></div>{badge_estado(est_s)}
</div>
<p class="porque">Real: GC {real_gc:+d}% · GI {real_gi:+d}%. Mexa nas notas e veja o ponto branco andar no Quadrado.
Dica: para chegar a Viável, cada grupo precisa de alguém com Chance − Dúvida ≥ 6.</p>""")
        with s2:
            st.altair_chart(quadrado_magico(pontos_resultado((gc_s, gi_s)), destaque="SIMULADO", altura=360), width="stretch")

    # ---- 7. pareceres e leitura final
    espaco(10)
    html(f'<div class="titulo" style="font-size:1.45rem">{icone("messages-square", 26, "#ffb347")}Pareceres dos especialistas (Chance / Dúvida)</div>')
    linhas_tab = []
    for a in ESPECIALISTAS:
        linha = {"Especialista": a["nome"]}
        for k in CRITERIOS:
            c, d, _ = a["notas"][k]
            linha[k] = f"{c} / {d}"
        linhas_tab.append(linha)
    st.dataframe(pd.DataFrame(linhas_tab), hide_index=True, width="stretch")

    espaco(10)
    html(f'<div class="titulo" style="font-size:1.45rem">{icone("file-text", 26, "#ffb347")}Leitura em 3 frases</div>')
    r = st.columns(3, gap="medium")
    leituras = [
        ("#2fbf71", "eye", "Indica", "Sozinho, o monitoramento por satélite não chega ao limite de 60%: o resultado geral fica perto de zero, com tendência a inviável."),
        ("#ff7a1a", "target", "Fazer", "Usar o alerta precoce como peça de uma estratégia integrada, junto com brigadas e combate à grilagem, e não como solução isolada."),
        ("#d4a017", "search", "Verificar", "Como garantir que o alerta chegue às comunidades e quem paga a resposta em campo: só o custo (CUS) ficou positivo."),
    ]
    for col, (c, ic, t, txt) in zip(r, leituras):
        with col:
            html(f'<div class="leit" style="--c:{c}"><b>{icone(ic, 18, c)}{t}</b><p>{txt}</p></div>')

# --------------------------------------------------------- Facilitadores/Analistas
with aba_fac:
    titulo("compass", "Facilitadores", "Organizam a estrutura do estudo para que os especialistas possam opinar. Não dão parecer: garantem que a régua esteja pronta antes de qualquer número.")
    sub = st.tabs([f':material/explore: {p["nome"].split()[0]}' for p in EQUIPE["facilitadores"]])
    for t, p in zip(sub, EQUIPE["facilitadores"]):
        with t:
            pagina_pessoa(p, "facilitadores")

with aba_ana:
    titulo("search", "Analistas", "Consultam o resultado calculado pelo IntelliC e transformam os números em uma leitura clara: o que indica, o que fazer e o que verificar.")
    sub = st.tabs([f':material/manage_search: {p["nome"].split()[0]}' for p in EQUIPE["analistas"]])
    for t, p in zip(sub, EQUIPE["analistas"]):
        with t:
            pagina_pessoa(p, "analistas")

html('<div class="rodape">IntelliC · Inteligência Colaborativa · BIOTEAM · SEDCITEC IFSP 2026 · Especialistas são agentes de IA fictícios · Ícones: Lucide</div>')
