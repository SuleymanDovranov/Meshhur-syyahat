const { Gallery, otherGallery } = require('./../../models');
const AppError = require('./../../utils/appError');
const catchAsync = require('./../../utils/catchAsync');

exports.getAll = catchAsync(async (req, res, next) => {
  const gallery = await Gallery.findAll();

  if (!gallery) return next(new AppError('No Gallery!', 404));

  return res.status(201).send(
    gallery.map((n) => {
      const { img, ...other } = n.toJSON();
      return {
        img: `${req.protocol}://${req.get('host')}/images/gallery/${img}`,
        ...other,
      };
    })
  );
});

exports.getOneGallery = catchAsync(async (req, res, next) => {
  let uuid = req.params.uuid;
  const photo = await Gallery.findOne({
    where: { uuid: uuid },
    include: [
      {
        model: otherGallery,
        as: 'another',
        attributes: ['img'],
      },
    ],
  });

  if (!photo) return next(new AppError('Not Found!', 404));

  photo.img = `${req.protocol}://${req.get('host')}/images/gallery/${
    photo.img
  }`;

  for (let i = 0; i < photo.another.length; i++) {
    photo.another[i].img = `${req.protocol}://${req.get(
      'host'
    )}/images/gallery/otherGallery/${photo.another[i].img}`;
  }

  return res.status(201).send(photo);
});
