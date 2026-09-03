import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(dir, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(dir, 'app.js'), 'utf8');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(html.includes('<meta charset="utf-8">'), 'Falta charset UTF-8');
check(!/[ÃÂ]|â(?:†|€”|œ)/.test(html + css + js), 'Se detectó mojibake');
check((html.match(/<h1\b/g) || []).length === 1, 'Debe existir exactamente un H1');
check(html.includes('rel="canonical"'), 'Falta URL canonical');
check(html.includes('application/ld+json'), 'Falta JSON-LD');
check(css.includes('prefers-reduced-motion:reduce'), 'Falta soporte reduced-motion');
check(js.includes('visibilitychange'), 'El canvas no declara pausa en background');

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
check(ids.length === new Set(ids).size, 'Existen IDs duplicados');
const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
for (const anchor of anchors) check(ids.includes(anchor), `Anchor sin destino: #${anchor}`);

const caseIds = [...html.matchAll(/data-case="([^"]+)"/g)].map(match => match[1]);
for (const id of caseIds) check(new RegExp(`\\b${id}:\\s*{`).test(js), `Caso sin datos: ${id}`);
check(caseIds.length === 5, 'V2 debe publicar cinco experiencias documentadas');

const localRefs = [...html.matchAll(/(?:href|src)="([^"#]+)"/g)]
  .map(match => match[1].split('?')[0])
  .filter(ref => !/^(?:https?:|mailto:|data:)/.test(ref));
for (const ref of localRefs) check(fs.existsSync(path.resolve(dir, ref)), `Referencia local ausente: ${ref}`);

check((html.match(/aria-pressed=/g) || []).length >= 10, 'Estados de filtros/temas incompletos');
check(html.includes('aria-live="polite"'), 'Falta anuncio accesible de filtrado');
check(html.includes('<dialog') && js.includes("addEventListener('cancel'"), 'Contrato de diálogo incompleto');
check(!/opacity\s*:\s*0[^}]*\.reveal/.test(css.slice(0, css.indexOf('.motion-ready'))), 'El contenido depende de JavaScript para verse');

if (failures.length) {
  console.error(`QA FAILED (${failures.length})`);
  failures.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}
console.log(`QA PASS · ${ids.length} IDs · ${anchors.length} anchors · ${caseIds.length} casos · ${localRefs.length} referencias locales`);
