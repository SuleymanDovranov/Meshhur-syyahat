const exprees = require('express');

const {
  getAllServices,
  addService,
  uploadPhoto,
  editService,
  getOne,
  deleteAllService,
  deleteOne,
} = require('./../../controllers/admin/servicesController');

const router = exprees.Router();

router.get('/getAll', getAllServices);
router.post('/add', uploadPhoto, addService);
router.patch('/edit/:uuid', uploadPhoto, editService);
router.delete('/deleteAll', deleteAllService);
router.delete('/deleteOne/:uuid', deleteOne);
router.get('/getOne/:uuid', getOne);

module.exports = router;
