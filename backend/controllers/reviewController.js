const { reviewModel } = require('../models');
const { AppError } = require('../middleware');

const reviewController = {
  async create(req, res, next) {
    try {
      const { mediaId, mediaType, content, rating } = req.body;

      if (!mediaId || !content) {
        throw new AppError('mediaId and content are required.', 400);
      }

      if (rating !== undefined && rating !== null) {
        const ratingNum = parseInt(rating, 10);
        if (Number.isNaN(ratingNum) || ratingNum < 1 || ratingNum > 10) {
          throw new AppError('Rating must be an integer between 1 and 10.', 400);
        }
      }

      if (!['anime', 'manga'].includes(mediaType)) {
        throw new AppError('mediaType must be "anime" or "manga".', 400);
      }

      const review = await reviewModel.create({
        userId: req.user.id,
        mediaId: parseInt(mediaId, 10),
        mediaType,
        content,
        rating: rating ? parseInt(rating, 10) : null,
      });

      res.status(201).json({
        data: review,
        code: 201,
        metadata: { cache: false },
      });
    } catch (err) {
      next(err);
    }
  },

  async getByMedia(req, res, next) {
    try {
      const { mediaId } = req.params;
      const { mediaType = 'anime', page = 1 } = req.query;

      const id = parseInt(mediaId, 10);
      if (Number.isNaN(id)) {
        throw new AppError('Invalid media ID.', 400);
      }

      const result = await reviewModel.findByMedia(id, mediaType, {
        page: parseInt(page, 10),
        limit: 20,
      });

      res.json({
        data: {
          items: result.rows,
          total: result.total,
          page: parseInt(page, 10),
        },
        code: 200,
        metadata: { cache: true },
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = reviewController;
