const db = require('../config/database');

const mediaModel = {
  async findById(anilistId, mediaType) {
    const result = await db.query(
      'SELECT * FROM media_cache WHERE anilist_id = $1 AND media_type = $2',
      [anilistId, mediaType]
    );
    return result.rows[0] || null;
  },

  async search(query, mediaType, limit = 20) {
    let sql = `SELECT * FROM media_cache WHERE media_type = $1`;
    const params = [mediaType];

    if (query?.trim()) {
      sql += ` AND (title->>'english' ILIKE $2 OR title->>'romaji' ILIKE $2)`;
      params.push(`%${query}%`);
    }

    sql += ` ORDER BY metadata->>'averageScore' DESC NULLS LAST LIMIT ${params.length + 1}`;
    params.push(limit);

    const result = await db.query(sql, params);
    return result.rows;
  },

  async getFiltered({ mediaType, genres, format, releaseYear, minScore, excludeIds, page = 1, limit: _limit = 20 }) {
    let sql = 'SELECT * FROM media_cache WHERE media_type = $1';
    const params = [mediaType];
    let paramIndex = 2;

    if (genres && genres.length > 0) {
      const genreConditions = genres.map((g) => {
        params.push(g);
        return `$${paramIndex++} = ANY(genres)`;
      });
      sql += ` AND (${genreConditions.join(' OR ')})`;
    }

    if (format) {
      params.push(format);
      sql += ` AND metadata->>'format' = $${paramIndex++}`;
    }

    if (releaseYear) {
      params.push(releaseYear);
      sql += ` AND metadata->>'seasonYear' = $${paramIndex++}`;
    }

    if (minScore) {
      params.push(parseInt(minScore, 10));
      sql += ` AND (metadata->>'averageScore')::int >= $${paramIndex++}`;
    }

    if (excludeIds && excludeIds.length > 0) {
      const exclusions = excludeIds.map((id) => {
        params.push(id);
        return `$${paramIndex++}`;
      });
      sql += ` AND anilist_id NOT IN (${exclusions.join(',')})`;
    }

    const countResult = await db.query(
      `SELECT COUNT(*) FROM (${sql}) AS filtered`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const offset = (page - 1) * limit;
    sql += ` ORDER BY id ASC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const result = await db.query(sql, params);
    return { rows: result.rows, total };
  },

  async getRandom({ mediaType, genres, format, releaseYear, minScore, seed: _seed, limit = 20 }) {
    let sql = 'SELECT * FROM media_cache WHERE media_type = $1';
    const params = [mediaType];
    let paramIndex = 2;

    if (genres && genres.length > 0) {
      const genreConditions = genres.map((g) => {
        params.push(g);
        return `$${paramIndex++} = ANY(genres)`;
      });
      sql += ` AND (${genreConditions.join(' OR ')})`;
    }

    if (format) {
      params.push(format);
      sql += ` AND metadata->>'format' = $${paramIndex++}`;
    }

    if (releaseYear) {
      params.push(releaseYear);
      sql += ` AND metadata->>'seasonYear' = $${paramIndex++}`;
    }

    if (minScore) {
      params.push(parseInt(minScore, 10));
      sql += ` AND (metadata->>'averageScore')::int >= $${paramIndex++}`;
    }

    sql += ` ORDER BY RANDOM() LIMIT $${paramIndex++}`;
    params.push(limit);

    const result = await db.query(sql, params);
    return result.rows;
  },

  async getCount({ mediaType, genres, format, releaseYear, minScore }) {
    let sql = 'SELECT COUNT(*) FROM media_cache WHERE media_type = $1';
    const params = [mediaType];
    let paramIndex = 2;

    if (genres && genres.length > 0) {
      const genreConditions = genres.map((g) => {
        params.push(g);
        return `$${paramIndex++} = ANY(genres)`;
      });
      sql += ` AND (${genreConditions.join(' OR ')})`;
    }

    if (format) {
      params.push(format);
      sql += ` AND metadata->>'format' = $${paramIndex++}`;
    }

    if (releaseYear) {
      params.push(releaseYear);
      sql += ` AND metadata->>'seasonYear' = $${paramIndex++}`;
    }

    if (minScore) {
      params.push(parseInt(minScore, 10));
      sql += ` AND (metadata->>'averageScore')::int >= $${paramIndex++}`;
    }

    const result = await db.query(sql, params);
    return parseInt(result.rows[0].count, 10);
  },
};

module.exports = mediaModel;
