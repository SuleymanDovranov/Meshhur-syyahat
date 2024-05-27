const { Contact } = require('./../../models');
const AppError = require('./../../utils/appError');
const catchAsync = require('./../../utils/catchAsync');

exports.getAdress = catchAsync(async (req, res, next) => {
  const adress = await Contact.findAll();

  return res.status(201).send(adress);
});
