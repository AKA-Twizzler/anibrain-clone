const { Pool } = require('pg');
const config = require('./index');

const pool = new Pool({
  connectionString: config.database.url,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
