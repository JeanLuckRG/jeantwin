'use strict';
// Local-only test harness for sanitizeVoice (single source: config/assistant.js).
// Run: node test-sanitize.js   — not deployed/served.

const { sanitizeVoice } = require('./config/assistant');

const cases = [
  "Jean no solo lidera la adopción de IA, sino que también construye los sistemas que la hacen funcionar.",
  "AI Enablement no es solo comprar herramientas, es asegurar que se adopten y generen valor.",
  "No solo tiene experiencia operativa, sino que ha construido agentes reales.",
  "Su diferencial no es únicamente la teoría, sino la ejecución.",
  "Trae resultados operativos y sistemas que funcionan, no solo marcos y tableros.",
  "Jean no solo entiende la estrategia, también baja al detalle operativo.",
  "No sólo dirige equipos, sino también diseña la operación.",
  "Esto es importante y no tiene relación con la muletilla.",
  "El plan no funcionó, pero lo ajustamos."
];

let hits = 0;
for (const c of cases) {
  const out = sanitizeVoice(c);
  const residual = /\bno s[oó]lo\b|\bno es s[oó]lo\b/i.test(out);
  if (residual) hits++;
  console.log("IN : " + c);
  console.log("OUT: " + out + (residual ? "   <-- RESIDUAL" : ""));
  console.log("");
}
console.log("Residuals: " + hits + "/" + cases.length);
module.exports = { sanitizeVoice };
