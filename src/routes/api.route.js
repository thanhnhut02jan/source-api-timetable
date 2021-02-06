const express = require('express');
const router = express.Router();

const apiController = require('../controllers/api.controller');

router.get('/timeTable', apiController.getTimeTable);
// router.post('/', testController.postIndex);

module.exports = router;