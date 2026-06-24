const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middleware');

router.post('/', authenticate, reviewController.create);
router.get('/:mediaId', reviewController.getByMedia);

module.exports = router;
