const { mediaModel } = require('../models');
const { proxyToMLEngine, getMLEngineHealth, AppError } = require('../middleware');

function formatMediaItem(item) {
  return {
    id: item.anilist_id,
    title: item.title,
    synopsis: item.synopsis,
    genres: item.genres,
    tags: item.tags,
    similarity_score: null,
    image_url: item.metadata ? item.metadata.image_url : null,
    metadata: item.metadata,
  };
}

const recommenderController = {
  async autosuggest(req, res, next) {
    try {
      const { q, type } = req.query;
      const mediaType = type || 'anime';

      if (!q || q.trim().length < 2) {
        return res.json({
          data: [],
          code: 200,
          metadata: { cache: false },
        });
      }

      const results = await mediaModel.search(q, mediaType, 10);
      const suggestions = results.map(formatMediaItem);

      res.json({
        data: suggestions,
        code: 200,
        metadata: { cache: true },
      });
    } catch (err) {
      next(err);
    }
  },

  async getRecs(req, res, next) {
    try {
      const { mediaType, id } = req.params;
      if (!['anime', 'manga'].includes(mediaType)) {
        throw new AppError('Invalid media type. Use "anime" or "manga".', 400);
      }

      const mediaId = parseInt(id, 10);
      if (Number.isNaN(mediaId)) {
        throw new AppError('Invalid media ID.', 400);
      }

      // Try ML Engine first
      const health = await getMLEngineHealth();
      if (health.status === 'ok') {
        try {
          const sourceMedia = await mediaModel.findById(mediaId, mediaType);
          const mlResult = await proxyToMLEngine('/recommend', {
            title: sourceMedia ? (sourceMedia.title.english || sourceMedia.title.romaji) : `id:${mediaId}`,
          });

          return res.json({
            data: mlResult.data || [],
            code: 200,
            metadata: { cache: false, source: 'ml-engine' },
          });
        } catch (mlErr) {
          console.warn('ML Engine call failed, falling back to mock data:', mlErr.message);
        }
      }

      // Fallback: return random recommendations from sample data
      const sourceMedia = await mediaModel.findById(mediaId, mediaType);
      const excludeIds = sourceMedia ? [sourceMedia.anilist_id] : [mediaId];
      const results = await mediaModel.getFiltered({
        mediaType,
        excludeIds,
        limit: 20,
      });

      res.json({
        data: results.rows.map(formatMediaItem),
        code: 200,
        metadata: { cache: true, source: 'fallback' },
      });
    } catch (err) {
      next(err);
    }
  },

  async getRecsFromList(req, res, next) {
    try {
      const {
        externalListProvider,
        externalListProfileName,
        page = 1,
        filterFormat,
        filterGenre,
        filterRelease,
        filterScore,
        mediaType = 'anime',
        adult: _adult,
      } = req.query;

      // Build filter params
      const genres = filterGenre ? filterGenre.split(',') : [];
      const releaseYear = filterRelease || null;
      const format = filterFormat || null;
      const minScore = filterScore || null;

      const results = await mediaModel.getFiltered({
        mediaType,
        genres,
        format,
        releaseYear,
        minScore,
        page: parseInt(page, 10),
        limit: 20,
      });

      res.json({
        data: {
          items: results.rows.map(formatMediaItem),
          total: results.total,
          page: parseInt(page, 10),
          provider: externalListProvider || null,
          profileName: externalListProfileName || null,
        },
        code: 200,
        metadata: { cache: false },
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = recommenderController;
