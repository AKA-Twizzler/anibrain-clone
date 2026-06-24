const db = require('../config/database');

const userModel = {
  async create({ email, username, passwordHash }) {
    const result = await db.query(
      `INSERT INTO users (email, username, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, username, avatar_url, bio, created_at`,
      [email, username, passwordHash]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  },

  async findByUsername(username) {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0] || null;
  },

  async findById(id) {
    const result = await db.query(
      'SELECT id, email, username, avatar_url, bio, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  async update(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return null;

    const setClauses = keys.map((key, i) => `${key} = $${i + 2}`);
    const values = keys.map((k) => fields[k]);

    const result = await db.query(
      `UPDATE users SET ${setClauses.join(', ')}, updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, username, avatar_url, bio, created_at, updated_at`,
      [id, ...values]
    );
    return result.rows[0] || null;
  },
};

module.exports = userModel;
