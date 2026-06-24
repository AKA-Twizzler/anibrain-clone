const db = require('../config/database');

const voteModel = {
  async create({ userId, sourceMediaId, targetMediaId, voteType }) {
    const result = await db.query(
      `INSERT INTO votes (user_id, source_media_id, target_media_id, vote_type)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, sourceMediaId, targetMediaId, voteType]
    );
    return result.rows[0];
  },

  async findByTarget(targetMediaId) {
    const result = await db.query(
      `SELECT
         vote_type,
         COUNT(*) FILTER (WHERE vote_type = 'up') AS upvotes,
         COUNT(*) FILTER (WHERE vote_type = 'down') AS downvotes
       FROM votes
       WHERE target_media_id = $1
       GROUP BY vote_type`,
      [targetMediaId]
    );

    let upvotes = 0;
    let downvotes = 0;
    result.rows.forEach((row) => {
      if (row.vote_type === 'up') upvotes = parseInt(row.upvotes, 10);
      if (row.vote_type === 'down') downvotes = parseInt(row.downvotes, 10);
    });

    return { upvotes, downvotes, total: upvotes + downvotes };
  },
};

module.exports = voteModel;
