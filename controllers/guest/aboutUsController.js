const { AboutUs } = require('./../../models');
const AppError = require('./../../utils/appError');
const catchAsync = require('./../../utils/catchAsync');

exports.getAboutUs = catchAsync(async (req, res, next) => {
  try {
    const about = await AboutUs.findAll();
    about.forEach((entry) => {
      entry.img = `${req.protocol}://${req.get('host')}/images/aboutUs/${
        entry.img
      }`;
    });
    return res.status(200).json(about);
  } catch (error) {
    console.error('Error fetching About Us entries:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
