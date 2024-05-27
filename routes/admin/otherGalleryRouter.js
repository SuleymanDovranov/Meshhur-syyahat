const express = require('express');

const {
  addPhoto,
  uploadPhoto,
  editPohoto,
  deleteAll,
  deletePhoto,
} = require('./../../controllers/admin/otherGalleryController');

const router = express.Router();

router.post('/add/:uuid', uploadPhoto, addPhoto);
router.patch('/edit/:id', uploadPhoto, editPohoto);
router.delete('/deleteAll/:uuid', deleteAll);
router.delete('/deleteOne/:id', deletePhoto);

module.exports = router;
