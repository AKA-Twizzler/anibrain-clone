const config = require('../config');

async function proxyToMLEngine(endpoint, body = {}) {
  const url = `${config.mlEngine.url}${endpoint}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`ML Engine returned status ${response.status}`);
  }

  return response.json();
}

async function getMLEngineHealth() {
  try {
    const url = `${config.mlEngine.url}/health`;
    const response = await fetch(url);
    if (response.ok) {
      return { status: 'ok' };
    }
    return { status: 'unavailable' };
  } catch {
    return { status: 'unavailable' };
  }
}

module.exports = { proxyToMLEngine, getMLEngineHealth };
