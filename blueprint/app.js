const cases = {
  coe: {
    tag: 'Arquitectura organizacional · Documentado', title: 'Management CoE como sistema regional',
    context: 'Un Centro de Excelencia que creció desde un grupo cercano a nueve gestores hasta una estructura ampliada de aproximadamente 105–106 profesionales.',
    role: 'Enterprise Coach; cofundador y arquitecto operativo del Management CoE. Alcance matricial sobre la estructura ampliada; máximo seis reportes directos.',
    intervention: 'Propósito, modelo operativo, estructura, perfiles, responsabilidades, metas, desarrollo, evaluación, riesgos, cumplimiento y cadencias de gobierno.',
    result: 'Una arquitectura compartida para coordinar capacidad, demanda y evolución organizacional en varios territorios.',
    evidence: 'Trayectoria y alcance documentados en el perfil profesional y CV vigente de Jean.',
    limits: 'La cifra de 105–106 no representa reportes directos. No se atribuyen resultados financieros sin fuente primaria.'
  },
  account: {
    tag: 'Gobierno de portafolio · Documentado', title: 'Account Coach para ampliar control',
    context: 'La amplitud de control alcanzó aproximadamente 30 profesionales y más de 30 proyectos simultáneos.',
    role: 'Jean diseñó, sustentó ante alta dirección, contrató y lideró directamente esta capa de liderazgo.',
    intervention: 'Creación del rol Account Coach, combinando Delivery Management con Program & Portfolio Coaching, con una meta de hasta 25 profesionales por Account Coach.',
    result: 'Seis Account Coaches como reportes directos y una capa explícita para acompañar la estructura ampliada.',
    evidence: 'Rol, escala y relación de reporte documentados en la fuente profesional vigente.',
    limits: 'La meta de capacidad por Account Coach describe el diseño; no implica ocupación constante al máximo.'
  },
  sura: {
    tag: 'Transformación y adopción · Documentado', title: 'Liderazgo consciente en Sura',
    context: 'Proceso de liderazgo consciente para aproximadamente 16 líderes, organizados en ocho duplas y basado en Fred Kofman.',
    role: 'Participación en diagnóstico, diseño, facilitación, implementación, validación y gobierno; facilitación directa de cuatro duplas.',
    intervention: 'Acompañamiento estructurado para convertir principios de liderazgo en práctica observada y conversaciones aplicadas.',
    result: 'Proceso ejecutado con alcance y contribución de Jean documentados.',
    evidence: 'Caso confirmado en la fuente profesional del sitio.',
    limits: 'No se publican métricas de negocio o comportamiento que no estén verificadas.'
  },
  ai: {
    tag: 'IA aplicada · Evidencia cualitativa', title: 'IA incorporada al flujo operativo',
    context: 'La consolidación del Listado Maestro y de información operativa demandaba trabajo manual y limitaba el seguimiento.',
    role: 'Jean impulsó la incorporación de IA dentro del flujo y los activos operativos del CoE.',
    intervention: 'Uso de IA para apoyar consolidación, organización de información y capacidad de observación.',
    result: 'Reducción cualitativa de carga manual y ampliación de la capacidad de seguimiento.',
    evidence: 'Intervención confirmada; efecto descrito cualitativamente.',
    limits: 'No se afirma automatización total, porcentaje de ahorro, ROI ni productividad sin medición aprobada.'
  },
  method: {
    tag: 'Transferencia · Documentado', title: 'Conocimiento convertido en activos',
    context: 'Colaboración activa con MetodologIA desde mayo de 2026 en una iniciativa empresarial y de impacto en consolidación.',
    role: 'Embajador de la marca MetodologIA y colaborador activo.',
    intervention: 'Ciclo intensivo de contenidos, metodologías, evidencias y activos aplicados a desarrollo profesional y transformación.',
    result: 'Dieciséis entregables completados y aprendizaje convertido en producción documentada.',
    evidence: 'Entregables y periodo documentados en las fuentes vigentes del proyecto.',
    limits: 'Jean no se presenta como fundador, propietario, representante legal ni autor del portafolio completo.'
  }
};

const root = document.documentElement;
const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
if (!reduceQuery.matches) root.classList.add('motion-ready');

function initTheme() {
  const button = document.querySelector('#themeToggle');
  const saved = localStorage.getItem('blueprint-theme');
  root.dataset.theme = saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  const sync = () => { const dark = root.dataset.theme === 'dark'; button.setAttribute('aria-label', `Cambiar a tema ${dark ? 'claro' : 'oscuro'}`); button.title = button.getAttribute('aria-label'); };
  button.addEventListener('click', () => { root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('blueprint-theme', root.dataset.theme); sync(); });
  sync();
}

function initMenu() {
  const rail = document.querySelector('#topicRail'); const open = document.querySelector('#menuToggle'); const close = document.querySelector('#menuClose'); const scrim = document.querySelector('#scrim');
  const set = value => { rail.classList.toggle('open', value); open.setAttribute('aria-expanded', String(value)); scrim.hidden = !value; if (value) close.focus(); else open.focus(); };
  open.addEventListener('click', () => set(true)); close.addEventListener('click', () => set(false)); scrim.addEventListener('click', () => set(false));
  addEventListener('keydown', event => { if (event.key === 'Escape' && rail.classList.contains('open')) set(false); });
}

function initNavigation() {
  const links = [...document.querySelectorAll('.profile-rail nav a')]; const sections = links.map(link => document.querySelector(link.hash)).filter(Boolean);
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) return; links.forEach(link => link.toggleAttribute('aria-current', link.hash === `#${entry.target.id}` ? 'location' : false)); }), { rootMargin:'-30% 0px -58%' });
  sections.forEach(section => observer.observe(section));
  const progress = () => { const max = document.documentElement.scrollHeight - innerHeight; root.style.setProperty('--progress', `${max > 0 ? scrollY / max * 100 : 0}%`); };
  addEventListener('scroll', progress, { passive:true }); progress();
}

function initTopics() {
  const buttons = [...document.querySelectorAll('[data-topic]')]; const pieces = [...document.querySelectorAll('[data-topics]')];
  const activate = topic => {
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === topic)));
    pieces.forEach(piece => { const match = topic === 'all' || piece.dataset.topics.split(' ').includes(topic); piece.classList.toggle('is-dimmed', !match); piece.classList.toggle('topic-match', match && topic !== 'all'); });
  };
  buttons.forEach(button => button.addEventListener('click', () => activate(button.dataset.topic)));
}

function initFilters() {
  const buttons = [...document.querySelectorAll('[data-filter]')]; const cards = [...document.querySelectorAll('[data-domain]')]; const status = document.querySelector('#filterStatus');
  buttons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter; buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let visible = 0; cards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.domain !== filter; if (!card.hidden) visible++; }); status.textContent = `${visible} capacidades visibles.`;
  }));
}

function initDialog() {
  const dialog = document.querySelector('#caseDialog'); const close = dialog.querySelector('.dialog-close'); let trigger = null;
  const labels = { context:'Contexto', role:'Rol de Jean', intervention:'Intervención', result:'Resultado y alcance', evidence:'Evidencia', limits:'Límites de atribución' };
  document.querySelectorAll('[data-case]').forEach(button => button.addEventListener('click', () => {
    const item = cases[button.dataset.case]; if (!item) return;
    trigger = button; document.querySelector('#caseTag').textContent = item.tag; document.querySelector('#caseTitle').textContent = item.title;
    document.querySelector('#caseBody').innerHTML = Object.entries(labels).map(([key,label]) => `<section><h3>${label}</h3><p>${item[key]}</p></section>`).join(''); dialog.showModal(); close.focus();
  }));
  const shut = () => { dialog.close(); trigger?.focus(); };
  close.addEventListener('click', shut); dialog.addEventListener('click', event => { if (event.target === dialog) shut(); }); dialog.addEventListener('cancel', event => { event.preventDefault(); shut(); });
}

function initReveals() {
  const items = [...document.querySelectorAll('.reveal')]; if (reduceQuery.matches) { items.forEach(item => item.classList.add('is-visible')); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) return; entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }), { threshold:.1, rootMargin:'0px 0px -6%' }); items.forEach(item => observer.observe(item));
}

function initAmbientField() {
  const canvas = document.querySelector('#systemField'); if (reduceQuery.matches || !canvas.getContext) return;
  const ctx = canvas.getContext('2d'); let nodes=[]; let frame=0; let running=true; let last=0;
  const resize = () => { const dpr=Math.min(devicePixelRatio||1,1.5); const height=innerHeight-62; canvas.width=innerWidth*dpr; canvas.height=height*dpr; canvas.style.width=`${innerWidth}px`; canvas.style.height=`${height}px`; ctx.setTransform(dpr,0,0,dpr,0,0); const count=Math.max(14,Math.min(30,Math.floor(innerWidth/55))); nodes=Array.from({length:count},(_,i)=>({x:(i*137)%innerWidth,y:(i*83)%height,vx:(Math.random()-.5)*.1,vy:(Math.random()-.5)*.1})); };
  const draw = time => { if (!running) return; frame=requestAnimationFrame(draw); if (time-last<33) return; last=time; const h=innerHeight-62; ctx.clearRect(0,0,innerWidth,h); nodes.forEach((n,i)=>{ n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>innerWidth)n.vx*=-1;if(n.y<0||n.y>h)n.vy*=-1; nodes.slice(i+1).forEach(o=>{const d=Math.hypot(n.x-o.x,n.y-o.y);if(d<125){ctx.strokeStyle=`rgba(118,165,143,${(1-d/125)*.12})`;ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(o.x,o.y);ctx.stroke();}});ctx.fillStyle=i%6?'rgba(118,165,143,.32)':'rgba(213,169,79,.5)';ctx.beginPath();ctx.arc(n.x,n.y,1.3,0,Math.PI*2);ctx.fill();}); };
  const visibility = () => { running=!document.hidden; cancelAnimationFrame(frame); if(running) frame=requestAnimationFrame(draw); };
  resize(); addEventListener('resize',resize,{passive:true}); document.addEventListener('visibilitychange',visibility); frame=requestAnimationFrame(draw);
}

function initTracking() { document.querySelectorAll('[data-track],[data-intent]').forEach(element => element.addEventListener('click', () => { try { const events=JSON.parse(sessionStorage.getItem('blueprint-events')||'[]'); events.push({event:element.dataset.track||'intent',value:element.dataset.intent||'',at:Date.now()}); sessionStorage.setItem('blueprint-events',JSON.stringify(events.slice(-30))); } catch {} })); }

initTheme(); initMenu(); initNavigation(); initTopics(); initFilters(); initDialog(); initReveals(); initAmbientField(); initTracking();
