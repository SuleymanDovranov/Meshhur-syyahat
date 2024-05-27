const express = require('express');
const {
  getOneNew,
  getAllNews,
  editNews,
  addNews,
  uploadNewsPhoto,
  deleteNews,
  deleteAllNews,
} = require('./../../controllers/admin/newsController');

const router = express.Router();

router.post('/addNews', uploadNewsPhoto, addNews);
router.get('/getAllNews', getAllNews);
router.get('/getOneNew/:uuid', getOneNew);
router.delete('/deleteAll', deleteAllNews);
router.patch('/edit/:uuid', uploadNewsPhoto, editNews);
router.delete('/delete/:uuid', deleteNews);

module.exports = router;
