# Blueprint V2 — Discovery y decisiones

Estado: implementado como V2 oficial local  
Fecha: 2026-08-13

## Problema

La V1 demostraba criterio visual, pero exigía que el visitante reconstruyera por sí mismo tres respuestas: si Jean era relevante para su problema, qué evidencia lo demostraba y cuál era el siguiente paso. La V2 debe permitir una decisión confiable sobre Jean en pocos minutos.

## Usuarios y trabajos por hacer

1. Decisor de transformación: reconocer un problema organizacional, verificar experiencia transferible y abrir una conversación.
2. Hiring manager: confirmar encaje, escala, trayectoria y evidencia para decidir una entrevista.
3. Aliado: entender qué demuestra el trabajo aplicado y cómo colaborar.

## Dirección seleccionada

**Blueprint de capacidad instalada:** interfaz editorial que conecta problema → intervención → evidencia → capacidad → conversación. JeanTwin permanece como interfaz conversacional complementaria; no se reemplaza ni se duplica.

## Principios de producto

- Evidencia antes que narrativa.
- Problemas antes que catálogo de competencias.
- Alcance y atribución visibles en cada cifra.
- Movimiento funcional: de señales dispersas a estructura operable.
- El ecosistema demuestra capacidad; no domina la ruta profesional.
- Vanilla HTML/CSS/JS: explícito, portable y suficiente.

## Selecciones V2

| Decisión | Seleccionado | Rechazado |
|---|---|---|
| Conversión | Tres intenciones: reto, rol, IA | CTA genérico único |
| Arquitectura | Problemas → método → evidencia → capacidades | Capacidades como primera entrada |
| Evidencia | Esquema común con límites | Cifras aisladas y fuentes internas visibles |
| Temas | Cuatro lentes transversales | Menú derecho como duplicado de secciones |
| Movimiento | Caos → estructura, con presupuesto | Partículas y efectos sin significado |
| Tecnología | HTML/CSS/JS modular | Framework sin necesidad |
| Ecosistema | Laboratorio que demuestra capacidades | Explicar toda la cosmología |

## Fuera de alcance

- Métricas no confirmadas (`+20%`, `−30%`, `>1M USD`, ROI).
- Lista nominal de seis países sin fuente aprobada.
- Logos o testimonios sin permiso.
- CMS, backend, autenticación, chat duplicado o analítica invasiva.
- Explicación completa del canon ANKHRA.

## Riesgos y controles

- KI: hechos contrastados contra perfil profesional, CV vigente y fuente profesional del sitio.
- THANATOS: se retira duplicación, ornamentación excesiva y narrativa autorreferencial.
- EREBAS: la amplitud profesional puede diluir foco; se compensa con entradas por problema e intención.
- AUGUSTO: modelo de evidencia y componentes quedan reutilizables y mantenibles.
- NAZ: patrón rector — leer complejidad, diseñar estructura, gobernar, transferir y amplificar.
- VERDUGO QA: no inventar resultados; declarar límites; probar teclado, responsive, movimiento reducido y rutas críticas.

## Criterios de aceptación

- Cero texto corrupto o mojibake.
- La propuesta, audiencia y prueba principal son comprensibles en el primer viewport.
- Cada problema conecta con una intervención, dominio y evidencia.
- Cada caso muestra contexto, rol, intervención, resultado, evidencia y límites.
- Diálogo accesible con foco inicial, Escape y retorno al disparador.
- Filtros con estado accesible y anuncio de resultados.
- Sin scroll horizontal a 320 px; contenido esencial no desaparece.
- `prefers-reduced-motion` muestra estado final y elimina animación continua.
- El canvas se pausa cuando la pestaña no está visible.
- JavaScript válido, enlaces locales existentes y contenido útil sin JavaScript.

## Métricas para validación posterior

- 4/5 usuarios explican qué hace Jean en 30 segundos.
- 4/5 encuentran evidencia relevante en 90 segundos.
- 5/5 encuentran una ruta de contacto.
- Apertura de caso ≥25%, CV/JeanTwin ≥12%, contacto ≥5%, cuando exista analítica consentida.

## Datos pendientes

- Prioridad comercial definitiva entre empleo ejecutivo, consultoría y alianzas.
- Roles objetivo finales.
- Lista exacta de países y evidencia publicable por métrica.
- Resultados cuantificados adicionales con fuente primaria.
- Prueba moderada con usuarios y baseline de conversión.
