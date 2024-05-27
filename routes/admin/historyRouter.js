const express = require('express');
const {
  uploadHistoryPhoto,
  addHistory,
  getAllHistory,
  getOneHistory,
  deleteAllHistory,
  editHistory,
  deleteHistory,
} = require('./../../controllers/admin/historyController');

const router = express.Router();

router.post('/addHistory', uploadHistoryPhoto, addHistory);
router.get('/getAllHistory', getAllHistory);
router.get('/getOneHistory/:uuid', getOneHistory);
router.delete('/deleteAll', deleteAllHistory);
router.patch('/edit/:uuid', uploadHistoryPhoto, editHistory);
router.delete('/delete/:uuid', deleteHistory);

module.exports = router;
