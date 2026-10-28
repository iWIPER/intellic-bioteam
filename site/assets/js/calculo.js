import { LIMITE, CRIT, ESP } from "./dados.js";

/**
 * Lógica Paraconsistente Anotada Evidencial Eτ — mesmo algoritmo do IntelliC v20 R10
 * (CalculoParaconsistenteService + AgrupamentoService). Ver docs/metodologia.md.
 */
export const arred = x => Math.floor(x + 0.5);
export function classificar(gc, gi) {
  if (gc === 0 && gi === 0) return "Indefinido";
  if (Math.abs(gi) >= LIMITE) return "Inviável por dúvida excessiva";
  if (gc >= LIMITE) return "Viável";
  if (gc <= -LIMITE) return "Inviável";
  return gc > 0 ? "Tendência a ser viável" : "Tendência a ser inviável";
}
export const COR_ESTADO = { "Viável": "#2fbf71", "Tendência a ser viável": "#f5d547", "Tendência a ser inviável": "#ff9a3c",
  "Inviável": "#e55353", "Inviável por dúvida excessiva": "#9aa7b8", "Indefinido": "#8fb0e0" };
export function calcular(entradas) { // [[nome, chance, dúvida], ...] na ordem de cadastro
  const ind = entradas.map(([nome, c, d]) => ({ nome, c, d, mu: c / 10, la: d / 10, gc: arred((c - d) * 10), gi: arred((c + d - 10) * 10) }));
  const qtd = Math.max(2, Math.ceil(ind.length / 3));
  const grupos = Array.from({ length: qtd }, () => []);
  ind.forEach((e, i) => { e.grupo = i % qtd; grupos[i % qtd].push(e); });
  const rg = grupos.map(g => ({ gc: Math.max(...g.map(e => e.gc)), gi: Math.min(...g.map(e => e.gi)), membros: g }));
  return { ind, rg, gc: Math.min(...rg.map(r => r.gc)), gi: Math.max(...rg.map(r => r.gi)) };
}
export const entradasReais = k => ESP.map(a => [a.curto, a.notas[k][0], a.notas[k][1]]);
export const CALC = Object.fromEntries(Object.keys(CRIT).map(k => [k, calcular(entradasReais(k))]));
export const GC = arred(Object.values(CALC).reduce((s, v) => s + v.gc, 0) / 5);
export const GI = arred(Object.values(CALC).reduce((s, v) => s + v.gi, 0) / 5);
export const ESTADO = classificar(GC, GI);

