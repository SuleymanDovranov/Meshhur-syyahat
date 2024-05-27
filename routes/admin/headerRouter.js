const express = require('express');

const {
  getHeader,
  editHeader,
} = require('./../../controllers/admin/headerController');

const router = express.Router();

router.patch('/edit', editHeader);
router.get('/get', getHeader);

module.exports = router;
