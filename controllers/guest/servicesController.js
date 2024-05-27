const { Services } = require('./../../models');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

exports.getOne = catchAsync(async (req, res, next) => {
  let uuid = req.params.uuid;
  const service = await Services.findOne({ where: { uuid: uuid } });

  if (!service) return next(new AppError('Not found!'), 404);

  service.img = `${req.protocol}://${req.get('host')}/images/services/${
    service.img
  }`;

  return res.status(201).send(service);
});

exports.getAllServices = catchAsync(async (req, res, next) => {
  const services = await Services.findAll();

  if (!services)
    return next(new AppError('No Services yet please add Some!', 404));

  return res.status(201).send(
    services.map((n) => {
      const { img, ...other } = n.toJSON();
      return {
        img: `${req.protocol}://${req.get('host')}/images/services/${img}`,
        ...other,
      };
    })
  );
});
