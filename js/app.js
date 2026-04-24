'use strict';

/* ── NAV ─────────────────────────────────────────────────────── */
const nav    = document.getElementById('nav');
const burger = document.getElementById('nav-burger');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Mobile menu — built from HTML nav links
const mobileMenu = document.createElement('div');
mobileMenu.className = 'nav-mobile';
mobileMenu.setAttribute('role', 'dialog');
mobileMenu.setAttribute('aria-modal', 'true');
mobileMenu.setAttribute('aria-label', 'Menú de navegación');
mobileMenu.innerHTML = `
  <button class="nav-close" id="nav-close" aria-label="Cerrar menú">✕</button>
  <a href="#sobre"      onclick="closeMobileMenu()">Visión</a>
  <a href="#servicios"  onclick="closeMobileMenu()">Servicios</a>
  <a href="#perfil"     onclick="closeMobileMenu()">Perfil</a>
  <a href="#casos"      onclick="closeMobileMenu()">Casos</a>
  <a href="#jeantwin"   onclick="closeMobileMenu()">Jean Twin</a>
  <a href="#contacto"   onclick="closeMobileMenu()" class="mobile-cta">Hablemos</a>
`;
document.body.appendChild(mobileMenu);

burger.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  burger.setAttribute('aria-expanded', 'true');
});
function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}
document.getElementById('nav-close').addEventListener('click', closeMobileMenu);
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
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

/* ── CONTACT FORM ────────────────────────────────────────────── */
// COMPLETAR: reemplaza YOUR_FORM_ID con tu ID de Formspree
const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID';

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
