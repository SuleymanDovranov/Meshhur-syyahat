const express = require('express');

const {
  protect,
  login,
  updateAdmin,
} = require('./../../controllers/admin/authController');

const router = express.Router();

router.post('/login', login);
router.use(protect);
router.patch('/updateAdmin', updateAdmin);

router.use('/news', require('./newsRouter'));
router.use('/tours', require('./tourRouter'));
router.use('/aboutUs', require('./aboutUsRouter'));
router.use('/gallery', require('./galleryRouter'));
router.use('/services', require('./servicesRouter'));
router.use('/header', require('./headerRouter'));
router.use('/contact', require('./contactRouter'));
router.use('/history', require('./historyRouter'));
router.use('/headerImg', require('./headerImgRouter'));
router.use('/otherGallery', require('./otherGalleryRouter'));

module.exports = router;
