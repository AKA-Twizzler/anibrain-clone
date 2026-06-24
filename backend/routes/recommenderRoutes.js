const express = require('express');
const router = express.Router();
const recommenderController = require('../controllers/recommenderController');

router.get('/autosuggest', recommenderController.autosuggest);
router.get('/recs/list', recommenderController.getRecsFromList);
router.get('/recs/:mediaType/:id', recommenderController.getRecs);

module.exports = router;
