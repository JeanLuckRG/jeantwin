# Sitio JeanTwin — pendientes (universo "búsqueda de empleo", baja prioridad)

> Estado: **PARKED** el 2026-06-04. El sitio está ~90% y es la versión canónica.
> Las otras dos versiones se movieron a `../_superseded/` (site/ y el HTML de 2MB).
> Jean lo considera otro universo respecto al objetivo real (SO para gestionar negocios).
> Esta lista es para cuando se retome la búsqueda de empleo / posicionamiento personal.

## Factuales (decidir antes de publicar)
- [x] **Años de experiencia:** RESUELTO 2026-07-20 → **10+** en sitio, Twin y CV.
      Nota: `8f8af1d` (11-jun) ya había estandarizado a 10+, pero el pivot `2b4edef`
      (17-jun) lo revirtió a 11+ en los tres artefactos. Si se vuelve a reescribir el
      copy, verificar que no regrese: `grep -c "11+ años" config/assistant.js index.html`
- [ ] **Margen >30%:** aparece en hero (línea 77), métrica (103), caso (411/414). Jean confirmó que el logro es real pero la cifra puede no ser precisa. Suavizar a cualitativo ("márgenes sostenibles/saludables") o sustentar con número exacto.
- [ ] **6 países LATAM:** línea 483 nombra "Colombia, México, Guatemala, Honduras". El CV solo dice "6 países". Confirmar la lista exacta o dejar genérico.

## Deploy (requiere cuentas de Jean)
- [ ] Formspree ID en `js/app.js` (reemplazar `YOUR_FORM_ID`)
- [ ] `GEMINI_API_KEY` en Vercel → Environment Variables
- [ ] Dominio real (reemplazar `jeantwin.vercel.app` si aplica)
- [ ] `assets/og-image.jpg` (1200×630)
- [ ] `assets/cv-jean-luck-ruiz-granda.pdf` (CV real en PDF)

## Marca
- [ ] El sitio NO tiene refs a MetodologIA (limpio). Si se rebrandea a **Ankhra/Unión**, definir tokens visuales primero. Estética actual: negro #080808 + brass #9E7B3C.
