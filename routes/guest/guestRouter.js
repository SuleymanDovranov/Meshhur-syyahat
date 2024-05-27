const express = require('express');

const { getAboutUs } = require('./../../controllers/guest/aboutUsController');
const { getHeader } = require('./../../controllers/guest/headerController');
const { getAdress } = require('./../../controllers/guest/contactController');

const router = express.Router();

router.get('/header', getHeader);
router.get('/aboutUs', getAboutUs);
router.get('/contact', getAdress);

router.use('/news', require('./newsRouter'));
router.use('/tours', require('./toursRouter'));
router.use('/gallery', require('./galleryRouter'));
router.use('/services', require('./serviceRouter'));
router.use('/email', require('./emailRouter'));
router.use('/history', require('./historyRouter'));

module.exports = router;
