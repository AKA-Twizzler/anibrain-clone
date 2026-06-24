const { voteModel } = require('../models');
const { AppError } = require('../middleware');

const voteController = {
  async create(req, res, next) {
    try {
      const { sourceMediaId, targetMediaId, voteType } = req.body;

      if (!sourceMediaId || !targetMediaId || !voteType) {
        throw new AppError('sourceMediaId, targetMediaId, and voteType are required.', 400);
      }

      if (!['up', 'down'].includes(voteType)) {
        throw new AppError('voteType must be "up" or "down".', 400);
      }

      const vote = await voteModel.create({
        userId: req.user ? req.user.id : null,
        sourceMediaId: parseInt(sourceMediaId, 10),
        targetMediaId: parseInt(targetMediaId, 10),
        voteType,
      });

      res.status(201).json({
        data: vote,
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
      const id = parseInt(mediaId, 10);

      if (Number.isNaN(id)) {
        throw new AppError('Invalid media ID.', 400);
      }

      const votes = await voteModel.findByTarget(id);

      res.json({
        data: votes,
        code: 200,
        metadata: { cache: true },
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = voteController;
