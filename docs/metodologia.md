# Metodologia: como o IntelliC calcula o resultado

Implementação de referência: [`site/assets/js/calculo.js`](../site/assets/js/calculo.js), validada por [`tests/calculo.test.js`](../tests/calculo.test.js) contra os valores exibidos pelo IntelliC v20 R10.

## 1. Entrada

Cada especialista dá, para cada critério, duas notas de 0 a 10:

- **Chance**: o quanto acredita que a estratégia atende ao critério.
- **Dúvida**: o quanto desconfia da própria resposta.

## 2. Evidências e graus

| Símbolo | Fórmula | Significado |
|---|---|---|
| μ | Chance ÷ 10 | Evidência favorável |
| λ | Dúvida ÷ 10 | Evidência contrária |
| GC | (μ − λ) × 100 | Grau de certeza: para onde aponta (−100 a +100) |
| GI | (μ + λ − 1) × 100 | Grau de incerteza: contradição (+) ou falta de informação (−) |

Arredondamento igual ao `Math.round` do Java (meio para cima).

## 3. Agrupamento

- Quantidade de grupos: `max(2, ceil(n / 3))`.
- Distribuição em rodízio pela **ordem de cadastro** dos especialistas.
- **Dentro** de cada grupo: maior GC e menor GI (vale o melhor argumento).
- **Entre** os grupos: menor GC e maior GI (vale o mais cauteloso).

## 4. Resultado geral

Média simples de GC e de GI dos critérios, arredondada.

## 5. Classificação (ordem de checagem)

1. GC = 0 e GI = 0 → Indefinido
2. |GI| ≥ limite → Inviável por dúvida excessiva
3. GC ≥ limite → Viável
4. GC ≤ −limite → Inviável
5. GC > 0 → Tendência a ser viável; senão → Tendência a ser inviável

## Exemplo: critério Alcance (ESC)

| Especialista | Grupo | Chance | Dúvida | GC | GI |
|---|---|---|---|---|---|
| Helena | A | 9 | 3 | +60 | +20 |
| Raimundo | B | 3 | 3 | 0 | −40 |
| Marcos | A | 7 | 5 | +20 | +20 |
| Jaci | B | 4 | 5 | −10 | −10 |

Grupo A: GC +60, GI +20 · Grupo B: GC 0, GI −40 → **Alcance: GC 0, GI +20**.

## Resultado do estudo

| Critério | GC | GI |
|---|---|---|
| EFI | 0 | +10 |
| CAU | −10 | −30 |
| CUS | +10 | +10 |
| ESC | 0 | +20 |
| SOC | −10 | −10 |
| **Geral** | **−2** | **0** |

## Teste de robustez

Como os grupos dependem da ordem de cadastro, recalculamos com Helena + Raimundo e Marcos + Jaci: o geral vai a **+12%** (tendência a viável). A direção oscila, mas nenhum cenário se aproxima do limite de 60%.
