const { Tours } = require('./../../models');
const AppError = require('./../../utils/appError');
const catchAsync = require('./../../utils/catchAsync');

exports.getOneTour = catchAsync(async (req, res, next) => {
  try {
    const tour = await Tours.findOne({ where: { uuid: req.params.uuid } });

    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    tour.img = `${req.protocol}://${req.get('host')}/images/tours/${tour.img}`;

    return res.status(200).json(tour);
  } catch (error) {
    console.error('Error fetching tour:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

exports.getAllTour = catchAsync(async (req, res, next) => {
  const tours = await Tours.findAll();

  if (!tours) return next(new AppError('Not Found!', 404));

  return res.status(201).send(
    tours.map((n) => {
      const { img, ...other } = n.toJSON();
      return {
        img: `${req.protocol}://${req.get('host')}/images/tours/${img}`,
        ...other,
      };
    })
  );
});
