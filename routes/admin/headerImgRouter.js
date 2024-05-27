const express = require('express');

const {
  uploadPhoto,
  addImg,
  editPhoto,
  deleteOne,
  getAll,
  deleteAll,
} = require('./../../controllers/admin/headerImgController');

const router = express.Router();

router.get('/get', getAll);
router.post('/add', uploadPhoto, addImg);
router.delete('/deleteOne/:id', deleteOne);
router.patch('/edit/:id', uploadPhoto, editPhoto);
router.delete('/deleteAll', deleteAll);

module.exports = router;
