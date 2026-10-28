import { test } from "node:test";
import assert from "node:assert/strict";

import { ESP, CRIT } from "../site/assets/js/dados.js";
import { arred, calcular, classificar, CALC, GC, GI, ESTADO } from "../site/assets/js/calculo.js";

// Valores conferidos na tela de resultado do IntelliC v20 R10 (Problema 1, limite 60%).
const ESPERADO_IntelliC = {
  EFI: [0, 10],
  CAU: [-10, -30],
  CUS: [10, 10],
  ESC: [0, 20],
  SOC: [-10, -10],
};

test("arred replica o Math.round do Java (meio para cima)", () => {
  assert.equal(arred(-0.5), 0);
  assert.equal(arred(0.5), 1);
  assert.equal(arred(-2.4), -2);
});

test("cada critério confere com o IntelliC", () => {
  for (const [k, [gc, gi]] of Object.entries(ESPERADO_IntelliC)) {
    assert.deepEqual([CALC[k].gc, CALC[k].gi], [gc, gi], `critério ${k}`);
  }
});

test("resultado geral confere com o IntelliC: GC −2%, GI 0%, tendência a inviável", () => {
  assert.equal(GC, -2);
  assert.equal(GI, 0);
  assert.equal(ESTADO, "Tendência a ser inviável");
});

test("agrupa em 2 grupos por rodízio da ordem de cadastro (A = Helena + Marcos)", () => {
  const { rg } = CALC.ESC;
  assert.equal(rg.length, 2);
  assert.deepEqual(rg[0].membros.map((m) => m.nome), ["Helena", "Marcos"]);
  assert.deepEqual(rg[1].membros.map((m) => m.nome), ["Raimundo", "Jaci"]);
});

test("teste de robustez: trocando os grupos o geral vai a +12%, ainda longe do limite", () => {
  const ordem = [ESP[0], ESP[2], ESP[1], ESP[3]]; // Helena+Raimundo e Marcos+Jaci
  const ks = Object.keys(CRIT);
  const gcs = ks.map((k) => calcular(ordem.map((a) => [a.curto, a.notas[k][0], a.notas[k][1]])).gc);
  assert.equal(arred(gcs.reduce((s, v) => s + v, 0) / ks.length), 12);
});

test("classificação segue a ordem de checagem do IntelliC", () => {
  assert.equal(classificar(0, 0), "Indefinido");
  assert.equal(classificar(70, 65), "Inviável por dúvida excessiva");
  assert.equal(classificar(60, 0), "Viável");
  assert.equal(classificar(-60, 0), "Inviável");
  assert.equal(classificar(10, 0), "Tendência a ser viável");
  assert.equal(classificar(-10, 0), "Tendência a ser inviável");
});
