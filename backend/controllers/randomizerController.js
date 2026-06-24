const { mediaModel } = require('../models');
const { AppError } = require('../middleware');

function formatMediaItem(item) {
  return {
    id: item.anilist_id,
    title: item.title,
    synopsis: item.synopsis,
    genres: item.genres,
    tags: item.tags,
    image_url: item.metadata ? item.metadata.image_url : null,
    metadata: item.metadata,
  };
}

const randomizerController = {
  async getRandomRecs(req, res, next) {
    try {
      const { mediaType } = req.params;
      if (!['anime', 'manga'].includes(mediaType)) {
        throw new AppError('Invalid media type. Use "anime" or "manga".', 400);
      }

      const {
        seed,
        filterFormat,
        filterGenre,
        filterRelease,
        filterScore,
        adult: _adult,
        page = 1,
      } = req.query;

      const genres = filterGenre ? filterGenre.split(',') : [];
      const releaseYear = filterRelease || null;
      const format = filterFormat || null;
      const minScore = filterScore || null;

      // Get total count first
      const total = await mediaModel.getCount({
        mediaType,
        genres,
        format,
        releaseYear,
        minScore,
      });

      const limit = 20;
      const results = await mediaModel.getRandom({
        mediaType,
        genres,
        format,
        releaseYear,
        minScore,
        seed: seed || Date.now().toString(),
        limit,
      });

      res.json({
        data: {
          items: results.map(formatMediaItem),
          total,
          page: parseInt(page, 10),
          seed: seed || null,
        },
        code: 200,
        metadata: { cache: false },
      });
    } catch (err) {
      next(err);
    }
  },

  async getCount(req, res, next) {
    try {
      const { mediaType } = req.params;
      if (!['anime', 'manga'].includes(mediaType)) {
        throw new AppError('Invalid media type. Use "anime" or "manga".', 400);
      }

      const {
        filterFormat,
        filterGenre,
        filterRelease,
        filterScore,
      } = req.query;

      const genres = filterGenre ? filterGenre.split(',') : [];
      const releaseYear = filterRelease || null;
      const format = filterFormat || null;
      const minScore = filterScore || null;

      const total = await mediaModel.getCount({
        mediaType,
        genres,
        format,
        releaseYear,
        minScore,
      });

      res.json({
        data: { count: total },
        code: 200,
        metadata: { cache: false },
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = randomizerController;
