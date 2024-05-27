const express = require('express');

const {
  getAll,
  getOneGallery,
} = require('./../../controllers/guest/galleryController');

const router = express.Router();

router.get('/getAll', getAll);
router.get('/getOne/:uuid', getOneGallery);

module.exports = router;
