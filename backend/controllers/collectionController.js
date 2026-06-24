const { collectionModel } = require('../models');
const { AppError } = require('../middleware');

const collectionController = {
  async create(req, res, next) {
    try {
      const { title, description, isPublic, items } = req.body;
      if (!title || !title.trim()) {
        throw new AppError('Title is required.', 400);
      }

      const collection = await collectionModel.create({
        userId: req.user.id,
        title: title.trim(),
        description: description || '',
        isPublic: isPublic || false,
      });

      if (items && Array.isArray(items)) {
        for (const item of items) {
          await collectionModel.addItem(collection.id, item.mediaId, item.mediaType || 'anime');
        }
      }

      const collectionItems = await collectionModel.getItems(collection.id);

      res.status(201).json({
        data: { ...collection, items: collectionItems },
        code: 201,
        metadata: { cache: false },
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const collection = await collectionModel.findById(id);

      if (!collection) {
        throw new AppError('Collection not found.', 404);
      }

      const items = await collectionModel.getItems(id);

      res.json({
        data: { ...collection, items },
        code: 200,
        metadata: { cache: true },
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, isPublic, items } = req.body;

      const fields = {};
      if (title !== undefined) fields.title = title;
      if (description !== undefined) fields.description = description;
      if (isPublic !== undefined) fields.is_public = isPublic;

      const updated = await collectionModel.update(id, req.user.id, fields);
      if (!updated) {
        throw new AppError('Collection not found or you do not have permission to edit it.', 404);
      }

      if (items && Array.isArray(items)) {
        for (const item of items) {
          if (item.action === 'add') {
            await collectionModel.addItem(id, item.mediaId, item.mediaType || 'anime');
          } else if (item.action === 'remove' && item.itemId) {
            await collectionModel.removeItem(id, item.itemId);
          }
        }
      }

      const collectionItems = await collectionModel.getItems(id);

      res.json({
        data: { ...updated, items: collectionItems },
        code: 200,
        metadata: { cache: false },
      });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await collectionModel.delete(id, req.user.id);

      if (!deleted) {
        throw new AppError('Collection not found or you do not have permission to delete it.', 404);
      }

      res.json({
        data: { message: 'Collection deleted successfully.' },
        code: 200,
        metadata: { cache: false },
      });
    } catch (err) {
      next(err);
    }
  },

  async remix(req, res, next) {
    try {
      const { id } = req.params;
      const collection = await collectionModel.findById(id);

      if (!collection) {
        throw new AppError('Collection not found.', 404);
      }

      const remixed = await collectionModel.remix(id, req.user.id);

      const items = await collectionModel.getItems(remixed.id);

      res.status(201).json({
        data: { ...remixed, items, original_collection_id: id },
        code: 201,
        metadata: { cache: false },
      });
    } catch (err) {
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const { page = 1, userId } = req.query;

      const result = await collectionModel.list({
        page: parseInt(page, 10),
        limit: 20,
        userId: userId || null,
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

module.exports = collectionController;
