const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const { authenticateOptional } = require('../middleware');

router.post('/', authenticateOptional, voteController.create);
router.get('/:mediaId', voteController.getByMedia);

module.exports = router;
