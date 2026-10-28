# IntelliC · Quem decide como apagar o fogo?

Estudo colaborativo com **Lógica Paraconsistente** (software IntelliC) sobre o monitoramento por satélite com alerta precoce contra os incêndios florestais na Amazônia.

**Desafio IntelliC · SEDCITEC IFSP 2026 · Equipe BIOTEAM**

🌐 **Site:** https://iwiper.github.io/intellic-bioteam/

## A equipe

| Pessoa | Papel no estudo |
|---|---|
| Wilk | Facilitador |
| Gislene | Facilitadora |
| Joseane | Analista |
| Hellen | Analista |

Os quatro especialistas (Helena, Raimundo, Marcos e Jaci) são **agentes de IA fictícios**, cada um representando um saber: sensoriamento remoto, brigada de combate, gestão pública e território indígena.

## O resultado

O IntelliC calculou **índice de viabilidade −2%** e **índice de dúvida 0%**: *tendência a ser inviável*. Sozinho, o monitoramento por satélite não chega ao limite de 60%; ele funciona como peça de uma estratégia integrada (brigadas + combate à grilagem).

## O que tem aqui

- `index.html` — o site da apresentação (estático, hospedado no GitHub Pages): início, especialistas, resultado com explicabilidade do cálculo, simulador e equipe.
- `assets/` — páginas dos agentes, caricaturas da equipe e ícones ([Lucide](https://lucide.dev), licença ISC).
- `streamlit/` — a versão original da apresentação em Streamlit. Para rodar: `pip install -r streamlit/requirements.txt` e `streamlit run streamlit/app.py`.

O cálculo do site segue o mesmo algoritmo do IntelliC v20 R10 (μ = Chance ÷ 10, λ = Dúvida ÷ 10, GC = μ − λ, GI = μ + λ − 1, agrupamento máx/mín) e confere com o resultado do sistema.

> O software IntelliC é de autoria do Prof. Fábio e **não** faz parte deste repositório.
