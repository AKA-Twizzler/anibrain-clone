const db = require('../config/database');

const reviewModel = {
  async create({ userId, mediaId, mediaType, content, rating }) {
    const result = await db.query(
      `INSERT INTO reviews (user_id, media_id, media_type, content, rating)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, mediaId, mediaType, content, rating || null]
    );
    return result.rows[0];
  },

  async findByMedia(mediaId, mediaType, { page = 1, limit = 20 } = {}) {
    const countResult = await db.query(
      'SELECT COUNT(*) FROM reviews WHERE media_id = $1 AND media_type = $2',
      [mediaId, mediaType]
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const offset = (page - 1) * limit;
    const result = await db.query(
      `SELECT r.*, u.username, u.avatar_url
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.media_id = $1 AND r.media_type = $2
       ORDER BY r.created_at DESC
       LIMIT $3 OFFSET $4`,
      [mediaId, mediaType, limit, offset]
    );

    return { rows: result.rows, total };
  },
};

module.exports = reviewModel;
