const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const { authenticate } = require('../middleware');

router.post('/', authenticate, collectionController.create);
router.get('/', collectionController.list);
router.get('/:id', collectionController.getById);
router.put('/:id', authenticate, collectionController.update);
router.delete('/:id', authenticate, collectionController.delete);
router.post('/:id/remix', authenticate, collectionController.remix);

module.exports = router;
