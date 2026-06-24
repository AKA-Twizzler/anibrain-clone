const express = require('express');
const router = express.Router();
const infoController = require('../controllers/infoController');

router.get('/anime/:id', infoController.getAnime);
router.get('/manga/:id', infoController.getManga);

module.exports = router;
