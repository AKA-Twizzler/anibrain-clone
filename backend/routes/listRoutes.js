const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');

router.get('/:provider/fetch-list', listController.fetchList);
router.post('/:provider/sync', listController.syncList);

module.exports = router;
