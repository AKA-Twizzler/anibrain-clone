const db = require('../config/database');

const collectionModel = {
  async create({ userId, title, description, isPublic }) {
    const result = await db.query(
      `INSERT INTO collections (user_id, title, description, is_public)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, title, description || '', isPublic || false]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await db.query(
      `SELECT c.*, u.username AS owner_username
       FROM collections c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async update(id, userId, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return null;

    const setClauses = keys.map((key, i) => `${key} = $${i + 3}`);
    const values = keys.map((k) => fields[k]);

    const result = await db.query(
      `UPDATE collections SET ${setClauses.join(', ')}, updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId, ...values]
    );
    return result.rows[0] || null;
  },

  async delete(id, userId) {
    const result = await db.query(
      'DELETE FROM collections WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.rows[0] || null;
  },

  async list({ page = 1, limit = 20, userId }) {
    let sql = 'SELECT c.*, u.username AS owner_username FROM collections c JOIN users u ON c.user_id = u.id';
    const params = [];

    if (userId) {
      sql += ' WHERE c.user_id = $1';
      params.push(userId);
    } else {
      sql += ' WHERE c.is_public = true';
    }

    const countResult = await db.query(
      `SELECT COUNT(*) FROM (${sql}) AS counted`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const offset = (page - 1) * limit;
    sql += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(sql, params);
    return { rows: result.rows, total };
  },

  async addItem(collectionId, mediaId, mediaType) {
    const result = await db.query(
      `INSERT INTO collection_items (collection_id, media_id, media_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (collection_id, media_id, media_type) DO NOTHING
       RETURNING *`,
      [collectionId, mediaId, mediaType]
    );
    return result.rows[0] || null;
  },

  async getItems(collectionId) {
    const result = await db.query(
      `SELECT ci.*, mc.title, mc.genres, mc.metadata->>'image_url' AS image_url,
              mc.metadata->>'averageScore' AS average_score
       FROM collection_items ci
       LEFT JOIN media_cache mc ON ci.media_id = mc.anilist_id AND ci.media_type = mc.media_type
       WHERE ci.collection_id = $1
       ORDER BY ci.added_at`,
      [collectionId]
    );
    return result.rows;
  },

  async removeItem(collectionId, itemId) {
    const result = await db.query(
      'DELETE FROM collection_items WHERE collection_id = $1 AND id = $2 RETURNING id',
      [collectionId, itemId]
    );
    return result.rows[0] || null;
  },

  async remix(originalId, userId) {
    const original = await db.query('SELECT * FROM collections WHERE id = $1', [originalId]);
    if (!original.rows[0]) return null;

    const orig = original.rows[0];
    const newCollection = await db.query(
      `INSERT INTO collections (user_id, title, description, is_public)
       VALUES ($1, $2, $3, false)
       RETURNING *`,
      [userId, `${orig.title} (Remix)`, orig.description]
    );

    const items = await db.query(
      'SELECT media_id, media_type FROM collection_items WHERE collection_id = $1',
      [originalId]
    );

    for (const item of items.rows) {
      await db.query(
        `INSERT INTO collection_items (collection_id, media_id, media_type) VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING`,
        [newCollection.rows[0].id, item.media_id, item.media_type]
      );
    }

    return newCollection.rows[0];
  },
};

module.exports = collectionModel;
