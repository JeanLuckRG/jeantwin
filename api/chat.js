'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { JEAN_SYSTEM_PROMPT, getFallbackResponse } = require('../config/assistant');

// Basic in-memory rate limiting per IP
// Note: resets across cold starts — sufficient for personal-site traffic
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

function formatHistoryForGemini(history) {
  if (!Array.isArray(history)) return [];
  return history
    .slice(-10) // last 10 turns for context window efficiency
    .filter(t => t && t.role && t.content)
    .map(turn => ({
      role: turn.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(turn.content).slice(0, 1000) }]
    }));
}

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const ip = getClientIp(req);
  if (checkRateLimit(ip)) {
    return res.status(429).json({
      error: 'Demasiadas solicitudes. Espera un momento antes de continuar.'
    });
  }

  const { message, history = [] } = req.body || {};

  // Input validation
  const validationError = validateMessage(message);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback mode — no API key configured
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return res.status(200).json({
      response: getFallbackResponse(message),
      mode: 'fallback'
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: JEAN_SYSTEM_PROMPT,
    });

    const chat = model.startChat({
      history: formatHistoryForGemini(history),
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
        topP: 0.85,
        topK: 40,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    });

    const result = await chat.sendMessage(message.trim());
    const response = result.response.text();

    return res.status(200).json({ response, mode: 'gemini' });
  } catch (err) {
    console.error('[Jean Twin API] Gemini error:', err?.message || err);
    // Graceful degradation to fallback KB
    return res.status(200).json({
      response: getFallbackResponse(message),
      mode: 'fallback'
    });
  }
};
