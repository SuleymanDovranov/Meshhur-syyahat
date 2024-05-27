const express = require('express');

const {
  getAllTour,
  getOneTour,
} = require('./../../controllers/guest/toursController');

const router = express.Router();

router.get('/getAll', getAllTour);
router.get('/getOne/:uuid', getOneTour);

module.exports = router;
