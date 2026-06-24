const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config');
const db = require('../config/database');

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function isTokenInvalidated(tokenHash) {
  const result = await db.query(
    'SELECT id FROM invalidated_tokens WHERE token_hash = $1 AND expires_at > NOW()',
    [tokenHash]
  );
  return result.rows.length > 0;
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      data: null,
      code: 401,
      error: 'Authentication required. Provide a valid Bearer token.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        data: null,
        code: 401,
        error: 'Token has expired.',
      });
    }
    return res.status(401).json({
      data: null,
      code: 401,
      error: 'Invalid token.',
    });
  }
}

async function authenticateOptional(req, _res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    req.token = null;
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    req.token = token;
  } catch (_err) {
    req.user = null;
    req.token = null;
  }
  next();
}

module.exports = { authenticate, authenticateOptional, isTokenInvalidated, hashToken };
