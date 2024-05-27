const express = require('express');

const {
  getAllNews,
  getOneNew,
} = require('./../../controllers/guest/newsController');

const router = express.Router();

router.get('/getAll', getAllNews);
router.get('/getOneNew/:uuid', getOneNew);

module.exports = router;
