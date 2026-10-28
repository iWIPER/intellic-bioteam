# IntelliC · Quem decide como apagar o fogo?

[![CI](https://github.com/iWIPER/intellic-bioteam/actions/workflows/ci.yml/badge.svg)](https://github.com/iWIPER/intellic-bioteam/actions/workflows/ci.yml)
[![Deploy](https://github.com/iWIPER/intellic-bioteam/actions/workflows/pages.yml/badge.svg)](https://github.com/iWIPER/intellic-bioteam/actions/workflows/pages.yml)
[![Site](https://img.shields.io/badge/site-GitHub%20Pages-0b1f3d)](https://iwiper.github.io/intellic-bioteam/)
[![Licença: MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-blue.svg)](LICENSE)

Estudo de decisão colaborativa com **Lógica Paraconsistente Anotada Evidencial Eτ**, feito no software **IntelliC**, sobre a pergunta:

> *O monitoramento por satélite com alerta precoce é eficaz para reduzir os incêndios florestais na Amazônia?*

**Desafio IntelliC · SEDCITEC IFSP 2026 · Equipe BIOTEAM**

🌐 **Acesse:** https://iwiper.github.io/intellic-bioteam/

---

## Sumário

- [Resultado](#resultado)
- [Equipe e governança](#equipe-e-governança)
- [Arquitetura](#arquitetura)
- [Como rodar localmente](#como-rodar-localmente)
- [Testes e qualidade](#testes-e-qualidade)
- [Documentação](#documentação)
- [Licença e créditos](#licença-e-créditos)

## Resultado

| Indicador | Valor | Leitura |
|---|---|---|
| Índice de viabilidade (GC) | **−2%** | Empate, levemente para o lado do “não funciona” |
| Índice de dúvida (GI) | **0%** | Otimistas e céticos se equilibram |
| Classificação | **Tendência a ser inviável** | Longe do limite de decisão (+60%) |

Sozinho, o monitoramento por satélite não chega ao limite; ele funciona como peça de uma estratégia integrada (brigadas + combate à grilagem). Um **teste de robustez** mostra que, trocando a composição dos grupos, o resultado oscila para +12%, ainda longe dos 60%.

## Equipe e governança

O estudo aplica o **princípio do menor privilégio**: cada participante tem apenas o papel de que precisa.

| Pessoa | Papel | Permissões no IntelliC |
|---|---|---|
| Wilk | Facilitador | Monta problema, critérios e participantes; não opina |
| Gislene | Facilitadora | Monta problema, critérios e participantes; não opina |
| Joseane | Analista | Lê e interpreta o resultado; não altera notas |
| Hellen | Analista | Lê e interpreta o resultado; não altera notas |
| Helena · Raimundo · Marcos · Jaci | Especialistas (agentes de IA fictícios) | Só dão parecer, com login próprio, sem ver os outros |

Os quatro especialistas cobrem os quatro gargalos do alerta: **detectar** (sensoriamento remoto), **agir** (brigada), **sustentar** (gestão pública) e **chegar a quem está perto do fogo** (território indígena).

## Arquitetura

```text
.
├── site/                    # Site estático publicado no GitHub Pages
│   ├── index.html
│   └── assets/
│       ├── css/styles.css
│       ├── js/
│       │   ├── dados.js     # Pareceres, critérios e perfis (fonte única dos dados)
│       │   ├── calculo.js   # Algoritmo paraconsistente (puro, testável)
│       │   └── app.js       # Interface: abas, quadros, Quadrado Mágico, simulador
│       ├── agentes/         # Páginas animadas de cada agente
│       ├── caricaturas/     # Equipe em caricatura
│       └── icons/           # Ícones Lucide (ISC)
├── apps/streamlit/          # Versão original da apresentação em Streamlit
├── tests/                   # Testes do algoritmo (node:test)
├── docs/                    # Metodologia e decisões de arquitetura
└── .github/                 # CI, deploy do Pages, Dependabot e templates
```

Sem build e sem dependências em tempo de execução: o site usa HTML, CSS e módulos ES nativos. Detalhes em [docs/arquitetura.md](docs/arquitetura.md).

## Como rodar localmente

**Site estático** (requer Python 3 ou qualquer servidor HTTP; módulos ES não abrem via `file://`):

```bash
npm start            # equivale a: python -m http.server 8000 --directory site
# abra http://localhost:8000
```

**Versão Streamlit:**

```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r apps/streamlit/requirements.txt
streamlit run apps/streamlit/app.py
```

## Testes e qualidade

```bash
npm test             # node:test — confere o algoritmo com os valores do IntelliC
```

| Verificação | Ferramenta | Onde roda |
|---|---|---|
| Algoritmo confere com o IntelliC (GC −2%, GI 0%, cada critério) | `node:test` | CI e antes de cada deploy |
| Lint do app Streamlit | Ruff | CI |
| Atualização de dependências | Dependabot | Mensal |

O deploy no GitHub Pages só acontece se os testes passarem.

## Documentação

- [docs/metodologia.md](docs/metodologia.md): como o IntelliC calcula GC e GI, com exemplo passo a passo
- [docs/arquitetura.md](docs/arquitetura.md): estrutura do código e decisões técnicas
- [CONTRIBUTING.md](CONTRIBUTING.md): fluxo de trabalho, padrão de commits e checklist
- [CHANGELOG.md](CHANGELOG.md): histórico de versões

## Licença e créditos

- Código: [MIT](LICENSE). Ícones: [Lucide](https://lucide.dev) (ISC).
- O software **IntelliC** é de autoria do **Prof. Fábio** e **não** faz parte deste repositório.
- Fontes dos dados de contexto: INPE (BD Queimadas), MapBiomas, InfoAmazonia, A Crítica.
