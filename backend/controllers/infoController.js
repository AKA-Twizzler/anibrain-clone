const { mediaModel } = require('../models');
const { AppError } = require('../middleware');

const infoController = {
  async getAnime(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        throw new AppError('Invalid anime ID.', 400);
      }

      const media = await mediaModel.findById(id, 'anime');
      if (!media) {
        throw new AppError('Anime not found.', 404);
      }

      res.json({
        data: media,
        code: 200,
        metadata: { cache: true },
      });
    } catch (err) {
      next(err);
    }
  },

  async getManga(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        throw new AppError('Invalid manga ID.', 400);
      }

      const media = await mediaModel.findById(id, 'manga');
      if (!media) {
        throw new AppError('Manga not found.', 404);
      }

      res.json({
        data: media,
        code: 200,
        metadata: { cache: true },
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = infoController;
