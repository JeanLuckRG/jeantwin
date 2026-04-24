'use strict';

const { GoogleGenAI } = require('@google/genai');
const { JEAN_SYSTEM_PROMPT, getFallbackResponse } = require('../config/assistant');

const MODEL = 'gemini-1.5-flash-8b';

// Basic in-memory rate limiting per IP
// Resets on cold start — sufficient for personal-site traffic
const rateLimitStore = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const WINDOW_MS = 60_000;
  const MAX_REQUESTS = 15;
  const record = rateLimitStore.get(ip) || { count: 0, resetAt: now + WINDOW_MS };
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + WINDOW_MS;
  }
  record.count++;
  rateLimitStore.set(ip, record);
  return record.count > MAX_REQUESTS;
}

function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

function validateMessage(message) {
  if (!message || typeof message !== 'string') return 'Mensaje inválido';
  if (message.trim().length === 0) return 'Mensaje vacío';
  if (message.length > 800) return 'Mensaje demasiado largo (máx 800 caracteres)';
  return null;
}

// Build contents array: history turns + current user message
function buildContents(history, message) {
  const turns = (Array.isArray(history) ? history : [])
    .slice(-10)
    .filter(t => t && t.role && t.content)
    .map(turn => ({
      role: turn.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(turn.content).slice(0, 1000) }]
    }));
  turns.push({ role: 'user', parts: [{ text: message.trim() }] });
  return turns;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = getClientIp(req);
  if (checkRateLimit(ip)) {
    return res.status(429).json({
      error: 'Demasiadas solicitudes. Espera un momento antes de continuar.'
    });
  }

  const { message, history = [] } = req.body || {};

  const validationError = validateMessage(message);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log('[JeanTwin] GEMINI_API_KEY not set — serving fallback mode');
    return res.status(200).json({
      response: getFallbackResponse(message),
      mode: 'fallback'
    });
  }

  console.log(`[JeanTwin] Key present (${apiKey.slice(0, 6)}…), calling ${MODEL}`);

  try {
    const ai = new GoogleGenAI({ apiKey });

    const result = await ai.models.generateContent({
      model: MODEL,
      contents: buildContents(history, message),
      config: {
        systemInstruction: JEAN_SYSTEM_PROMPT,
        maxOutputTokens: 500,
        temperature: 0.7,
        topP: 0.85,
      }
    });

    const response = result.text;

    if (!response) {
      console.warn('[JeanTwin] Empty response from Gemini — using fallback');
      return res.status(200).json({
        response: getFallbackResponse(message),
        mode: 'fallback'
      });
    }

    console.log('[JeanTwin] Gemini responded OK');
    return res.status(200).json({ response, mode: 'gemini' });

  } catch (err) {
    const httpStatus = err?.status ?? err?.httpStatus ?? 0;
    const errMsg     = String(err?.message || '').toLowerCase();
    const is429      = httpStatus === 429
      || errMsg.includes('quota')
      || errMsg.includes('exhausted')
      || errMsg.includes('429');

    console.error('[JeanTwin] Gemini API error:', {
      name:    err?.name,
      message: err?.message,
      status:  httpStatus,
      code:    err?.code,
      is429,
    });

    if (is429) {
      return res.status(200).json({
        response: 'Jean Twin está recibiendo muchas consultas en este momento. Intenta de nuevo en unos minutos, o contacta a Jean directamente:\n→ WhatsApp: https://wa.me/573003646376\n→ Correo: injeanluck@gmail.com',
        mode: 'quota'
      });
    }

    return res.status(200).json({
      response: getFallbackResponse(message),
      mode: 'fallback'
    });
  }
};
