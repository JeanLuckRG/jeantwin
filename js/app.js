'use strict';

/* ── NAV ─────────────────────────────────────────────────────── */
const nav    = document.getElementById('nav');
const burger = document.getElementById('nav-burger');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Persistent section context: keeps long-form navigation oriented.
const sectionContext = document.getElementById('section-context');
const sectionContextName = document.getElementById('section-context-name');
const sectionContextCount = document.getElementById('section-context-count');
const readingProgressBar = document.getElementById('reading-progress-bar');
const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const trackedSections = [...document.querySelectorAll('section[id]')]
  .filter(section => section.id !== 'inicio');

const sectionLabel = section => {
  const heading = section.querySelector('h2');
  return heading ? heading.textContent.replace(/\s+/g, ' ').trim() : section.id;
};

const setCurrentSection = section => {
  const index = trackedSections.indexOf(section);
  if (index < 0) return;
  sectionContextName.textContent = sectionLabel(section);
  sectionContextCount.textContent = `${String(index + 1).padStart(2, '0')} / ${String(trackedSections.length).padStart(2, '0')}`;
  navAnchors.forEach(anchor => {
    const isCurrent = anchor.getAttribute('href') === `#${section.id}`;
    if (isCurrent) anchor.setAttribute('aria-current', 'location');
    else anchor.removeAttribute('aria-current');
  });
};

const updateReadingProgress = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100)) : 0;
  readingProgressBar.style.width = `${progress}%`;
  sectionContext.classList.toggle('visible', window.scrollY > window.innerHeight * 0.55);
  sectionContext.setAttribute('aria-hidden', window.scrollY > window.innerHeight * 0.55 ? 'false' : 'true');
  const marker = window.scrollY + parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) + 96;
  const current = [...trackedSections].reverse().find(section => section.offsetTop <= marker) || trackedSections[0];
  if (current) setCurrentSection(current);
};
window.addEventListener('scroll', updateReadingProgress, { passive: true });
updateReadingProgress();

// Mobile menu — built from HTML nav links
const mobileMenu = document.createElement('div');
mobileMenu.className = 'nav-mobile';
mobileMenu.setAttribute('role', 'dialog');
mobileMenu.setAttribute('aria-modal', 'true');
mobileMenu.setAttribute('aria-label', 'Menú de navegación');
mobileMenu.innerHTML = `
  <button class="nav-close" id="nav-close" aria-label="Cerrar menú">✕</button>
  <a href="#servicios">Servicios</a>
  <a href="#casos">Casos</a>
  <a href="#perfil">Perfil</a>
  <a href="#reclutadores">Reclutadores</a>
  <a href="#jeantwin">Jean Twin</a>
  <a href="#cv" class="mobile-cv">Dos CV profesionales</a>
  <a href="#contacto" class="mobile-cta">Hablemos</a>
`;
document.body.appendChild(mobileMenu);

burger.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  burger.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
  document.getElementById('nav-close').focus();
});
function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}
document.getElementById('nav-close').addEventListener('click', closeMobileMenu);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobileMenu.classList.contains('open')) {
    closeMobileMenu();
    burger.focus();
  }
});
window.closeMobileMenu = closeMobileMenu;

/* ── SCROLL REVEAL ───────────────────────────────────────────── */
const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-right]');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.children].filter(
      el => el.hasAttribute('data-reveal') || el.hasAttribute('data-reveal-right')
    );
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('visible'), idx * 80);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObs.observe(el));

/* ── SMOOTH ANCHOR SCROLL ────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navigate = () => {
        const distance = Math.abs(target.getBoundingClientRect().top);
        target.scrollIntoView({ behavior: distance > window.innerHeight * 1.75 ? 'auto' : 'smooth', block: 'start' });
        if (target.matches('section[id]') && target.id !== 'inicio') setCurrentSection(target);
        history.replaceState(null, '', a.getAttribute('href'));
      };
      if (mobileMenu.classList.contains('open')) {
        closeMobileMenu();
        requestAnimationFrame(navigate);
      } else {
        navigate();
      }
    }
  });
});

/* ── JEAN TWIN CHAT ──────────────────────────────────────────── */
const chatEndpoint  = '/api/chat';
const chatMessages  = document.getElementById('chat-messages');
const chatInput     = document.getElementById('chat-input');
const chatSend      = document.getElementById('chat-send');
const chatSuggests  = document.getElementById('chat-suggestions');

// Conversation history for context (last N turns)
const conversationHistory = [];

function addMessage(html, role) {
  const wrapper = document.createElement('div');
  wrapper.className = `msg msg-${role}`;
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  if (role === 'bot') {
    // Convert newlines to <br> and preserve links
    bubble.innerHTML = html
      .replace(/\n/g, '<br>')
      .replace(/https?:\/\/[^\s<]+/g, url => `<a href="${url}" target="_blank" rel="noopener">${url}</a>`);
  } else {
    bubble.textContent = html;
  }
  wrapper.appendChild(bubble);
  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return wrapper;
}

function showTyping() {
  const el = document.createElement('div');
  el.className = 'msg msg-bot msg-typing';
  el.innerHTML = `<div class="msg-bubble">
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  </div>`;
  chatMessages.appendChild(el);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return el;
}

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  chatInput.value = '';
  chatSend.disabled = true;
  if (chatSuggests) chatSuggests.style.display = 'none';

  addMessage(text, 'user');
  const typing = showTyping();

  try {
    const res = await fetch(chatEndpoint, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        message: text,
        history: conversationHistory.slice(-10)
      })
    });

    typing.remove();

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const msg = errData.error || 'Hubo un problema. Intenta de nuevo.';
      addMessage(msg, 'bot');
      return;
    }

    const data = await res.json();
    const reply = data.response || 'No pude generar una respuesta. Intenta de nuevo.';
    addMessage(reply, 'bot');

    // Update history
    conversationHistory.push({ role: 'user', content: text });
    conversationHistory.push({ role: 'assistant', content: reply });
    if (conversationHistory.length > 20) conversationHistory.splice(0, 2);

  } catch {
    typing.remove();
    addMessage(
      'Problema de conexión. Escríbele directamente a Jean:\n→ WhatsApp: https://wa.me/573003646376',
      'bot'
    );
  } finally {
    chatSend.disabled = false;
    chatInput.focus();
  }
}

window.sendSuggestion = function(btn) {
  chatInput.value = btn.textContent;
  if (chatSuggests) chatSuggests.style.display = 'none';
  sendMessage();
};

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

/* ── JEAN TWIN: OPEN + HERO LIVE-ASK + FLOATING LAUNCHER ─────── */
const jeantwinSection = document.getElementById('jeantwin');

// Scroll to the chat, optionally seed a question and fire it.
function openJeanTwin(seedText) {
  if (jeantwinSection) {
    jeantwinSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  const text = (seedText || '').trim();
  if (text) {
    chatInput.value = text;
    // Wait for the smooth scroll to settle before sending.
    setTimeout(sendMessage, 600);
  } else {
    setTimeout(() => chatInput.focus(), 500);
  }
}
window.openJeanTwin = openJeanTwin;

// Hero live-ask: type a question at the top, conversation starts below.
window.askFromHero = function(e) {
  e.preventDefault();
  const heroInput = document.getElementById('hero-ask-input');
  if (!heroInput) return;
  const text = heroInput.value.trim();
  if (!text) { openJeanTwin(); return; }
  heroInput.value = '';
  openJeanTwin(text);
};

// Floating launcher: visible whenever neither the hero (with its own ask box)
// nor the chat section itself is on screen — so it's always reachable in between.
const jtFab = document.getElementById('jt-fab');
if (jtFab) {
  jtFab.addEventListener('click', () => openJeanTwin());
  const heroEl = document.getElementById('inicio');
  let heroVisible = true;
  let chatVisible = false;
  const updateFab = () => jtFab.classList.toggle('show', !heroVisible && !chatVisible);

  if ('IntersectionObserver' in window && heroEl) {
    new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; updateFab(); },
      { threshold: 0.15 }).observe(heroEl);
    if (jeantwinSection) {
      new IntersectionObserver(([e]) => { chatVisible = e.isIntersecting; updateFab(); },
        { threshold: 0.25 }).observe(jeantwinSection);
    }
  } else {
    jtFab.classList.add('show');
  }
}

/* ── CONTACT FORM ────────────────────────────────────────────── */
const FORMSPREE_URL = 'https://formspree.io/f/mjgjlrwz';

window.handleFormSubmit = async function(e) {
  e.preventDefault();
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const error   = document.getElementById('form-error');
  const btn     = form.querySelector('button[type="submit"]');
  const span    = btn.querySelector('span');

  btn.disabled  = true;
  span.textContent = 'Enviando...';
  error.style.display = 'none';

  try {
    const res = await fetch(FORMSPREE_URL, {
      method:  'POST',
      body:    new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      form.style.display    = 'none';
      success.style.display = 'block';
    } else {
      throw new Error('server');
    }
  } catch {
    error.style.display  = 'block';
    btn.disabled         = false;
    span.textContent     = 'Enviar mensaje';
  }
};
