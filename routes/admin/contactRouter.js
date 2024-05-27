const express = require('express');

const {
  editAdress,
  getAdress,
} = require('./../../controllers/admin/contactController');

const router = express.Router();

router.patch('/edit', editAdress);
router.get('/get', getAdress);

module.exports = router;
