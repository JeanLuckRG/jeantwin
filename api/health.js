'use strict';

module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const key = process.env.GEMINI_API_KEY;
  const configured = !!(key && key !== 'your_gemini_api_key_here');

  return res.status(200).json({
    status:            'ok',
    gemini_configured: configured,
    key_prefix:        configured ? key.slice(0, 6) + '…' : null,
    model:             'gemini-2.0-flash-lite',
    ts:                new Date().toISOString()
  });
};
