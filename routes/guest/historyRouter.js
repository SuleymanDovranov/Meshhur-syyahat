const express = require('express');

const {
  getAllHistory,
} = require('./../../controllers/guest/historyController');

const router = express.Router();

router.get('/getAll', getAllHistory);

module.exports = router;
