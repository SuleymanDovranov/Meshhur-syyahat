const express = require('express');

const {
  getAllServices,
  getOne,
} = require('./../../controllers/guest/servicesController');

const router = express.Router();

router.get('/getOne/:uuid', getOne);
router.get('/getAll', getAllServices);

module.exports = router;
