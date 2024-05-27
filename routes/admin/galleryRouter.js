const express = require('express');

const {
  addGallery,
  getAll,
  uploadPhoto,
  deleteOneGallery,
  deleteAll,
  editPhoto,
  getOneGallery,
} = require('./../../controllers/admin/galleryController');

const router = express.Router();

router.get('/getAll', getAll);
router.post('/add', uploadPhoto, addGallery);
router.delete('/delete/:uuid', deleteOneGallery);
router.delete('/deleteAll', deleteAll);
router.patch('/edit/:uuid', uploadPhoto, editPhoto);
router.get('/getOne/:uuid', getOneGallery);

module.exports = router;
