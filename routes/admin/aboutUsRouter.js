const express = require('express');

const {
  editAboutUs,
  getAboutUs,
  uploadPhoto,
  deleteHeader,
  addHeader,
} = require('../../controllers/admin/aboutUsController');

const router = express.Router();

router.patch('/edit', uploadPhoto, editAboutUs);
router.get('/get', getAboutUs);
router.delete('/delete', deleteHeader);
router.post('/add', uploadPhoto, addHeader);

module.exports = router;
