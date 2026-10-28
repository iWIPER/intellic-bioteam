# Arquitetura

## Visão geral

O site é **estático** (HTML + CSS + módulos ES), publicado no GitHub Pages por GitHub Actions. Não há etapa de build nem dependências em tempo de execução, o que reduz a superfície de falha e mantém o deploy reproduzível.

```text
dados.js ──► calculo.js ──► app.js ──► index.html
(pareceres)  (algoritmo)    (interface)
```

| Módulo | Responsabilidade | Observação |
|---|---|---|
| `dados.js` | Pareceres, critérios, perfis e textos | Fonte única dos dados; sem lógica |
| `calculo.js` | Algoritmo paraconsistente | Funções puras, cobertas por testes |
| `app.js` | Renderização e interação | Abas com âncoras (`#resultado`, `#especialistas-jaci`), Quadrado Mágico em SVG, simulador |

## Decisões

| Decisão | Motivo |
|---|---|
| Site estático em vez de Streamlit no Pages | GitHub Pages não executa Python; o app Streamlit continua em `apps/streamlit/` para uso local |
| Algoritmo reimplementado em JS e testado contra o IntelliC | Garante que o site mostra os mesmos números do sistema oficial |
| Ícones via `mask-image` de SVGs locais | Coloridos por CSS, sem dependência externa |
| Robôs dos agentes extraídos das páginas originais em `iframe srcdoc` | Reaproveita as animações sem duplicar código |
| Deploy condicionado aos testes | Evita publicar um site com cálculo divergente |
| Caricaturas no lugar de fotos | Privacidade da equipe em repositório público |

## Acessibilidade e responsividade

- Navegação por teclado com foco visível; `aria-selected`/`aria-pressed` nas abas e filtros.
- Respeita `prefers-reduced-motion`.
- Layout em grade que colapsa para uma coluna abaixo de 1000 px.
