const { History } = require('./../../models');
const AppError = require('./../../utils/appError');
const catchAsync = require('./../../utils/catchAsync');

exports.getAllHistory = catchAsync(async (req, res, next) => {
  const history = await History.findAll();
  if (!history) return next(new AppError('No history', 404));

  return res.status(201).send(
    history.map((n) => {
      const { img, ...other } = n.toJSON();
      return {
        img: `${req.protocol}://${req.get('host')}/images/history/${img}`,
        ...other,
      };
    })
  );
});
