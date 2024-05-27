const express = require('express');

const {
  getAllTour,
  getOneTour,
  addTour,
  uploadToursPhoto,
  editTour,
  deleteAllTour,
  deleteTour,
} = require('./../../controllers/admin/toursController');

const router = express.Router();

router.post('/addTour', uploadToursPhoto, addTour);
router.get('/getAllTours', getAllTour);
router.get('/getOneTour/:uuid', getOneTour);
router.delete('/deleteAll', deleteAllTour);
router.delete('/delete/:uuid', deleteTour);
router.patch('/editTour/:uuid', uploadToursPhoto, editTour);

module.exports = router;
