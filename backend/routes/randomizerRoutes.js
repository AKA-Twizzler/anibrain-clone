const express = require('express');
const router = express.Router();
const randomizerController = require('../controllers/randomizerController');

router.get('/recs/:mediaType', randomizerController.getRandomRecs);
router.get('/count/:mediaType', randomizerController.getCount);

module.exports = router;
