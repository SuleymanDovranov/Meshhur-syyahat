const { Header, Headerimg } = require('./../../models');
const catchAsync = require('./../../utils/catchAsync');

exports.getHeader = catchAsync(async (req, res, next) => {
  let header = await Header.findOne({
    where: { id: 2 },
    include: [
      {
        model: Headerimg,
        as: 'imgs',
      },
    ],
  });

  for (let i = 0; i < header.imgs.length; i++) {
    header.imgs[i].img = `${req.protocol}://${req.get('host')}/images/header/${
      header.imgs[i].img
    }`;
  }

  const newHeader = [header];
  return res.status(201).send(newHeader);
});
