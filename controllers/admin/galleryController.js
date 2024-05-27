const { Gallery, otherGallery } = require('./../../models');
const AppError = require('./../../utils/appError');
const catchAsync = require('./../../utils/catchAsync');
const sharp = require('sharp');
const fs = require('fs');
const multer = require('multer');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPhoto = upload.single('img');

exports.addGallery = catchAsync(async (req, res, next) => {
  var { name_tm, name_ru, name_en } = req.body;

  let img = req.file.buffer;
  let date = Date.now();
  const newImgName = `${date}.webp`;
  await sharp(img)
    .toFormat('webp')
    .webp({ quality: 70 })
    .toFile(`images/gallery/${newImgName}`);

  console.log('💚💚', name_en, name_ru, name_tm);
  const gallery = await Gallery.create({
    name_en,
    name_ru,
    name_tm,
    img: newImgName,
  });
  console.log('💥', gallery.img);
  gallery.img = `${req.protocol}://${req.get(
    'host'
  )}/images/gallery/${newImgName}`;

  return res.status(201).send(gallery);
});

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

exports.deleteOneGallery = catchAsync(async (req, res, next) => {
  let uuid = req.params.uuid;
  const gallery = await Gallery.findOne({ where: { uuid: uuid } });

  if (!gallery) return next(new AppError('Not Found!', 404));

  const anotherGallery = await otherGallery.findAll({
    where: { galleryId: gallery.id },
  });

  if (anotherGallery) {
    anotherGallery.forEach(async (gallery) => {
      const rubbish = `images/gallery/otherGallery/${gallery.img}`;

      fs.unlink(rubbish, (err) => {
        if (err) {
          console.log(`Error deleting photo ${rubbish}`, err);
        } else {
          console.log(`Deleted ${rubbish}`, err);
        }
      });
      await gallery.destroy();
    });
  }

  let rubbish = `images/gallery/${gallery.img}`;
  fs.unlink(rubbish, (err) => {
    if (err) {
      console.log(`Error deleting file: ${rubbish}`, err);
    } else {
      console.log(`Image file deleted ${rubbish}`);
    }
  });

  await gallery.destroy();
  return res.status(200).send({ msg: 'Deleted 💥' });
});

exports.deleteAll = catchAsync(async (req, res, next) => {
  const allGallery = await Gallery.findAll();

  const otherGalleryss = await otherGallery.findAll();

  if (otherGalleryss) {
    otherGalleryss.forEach(async (gallery) => {
      const rubbish = `images/gallery/otherGallery/${gallery.img}`;

      fs.unlink(rubbish, (err) => {
        if (err) {
          console.log(`Error deleting photo ${rubbish}`, err);
        } else {
          console.log(`Deleted ${rubbish}`, err);
        }
      });
      await gallery.destroy();
    });
  }

  allGallery.forEach(async (gallery) => {
    const rubbish = `images/gallery/${gallery.img}`;

    fs.unlink(rubbish, (err) => {
      if (err) {
        console.log(`Error deleting photo ${rubbish}`, err);
      } else {
        console.log(`Deleted ${rubbish}`, err);
      }
    });
    await gallery.destroy();
  });
  return res.status(200).send({ msg: 'All photos has been deleted 💥' });
});

exports.editPhoto = catchAsync(async (req, res, next) => {
  let uuid = req.params.uuid;
  const photo = await Gallery.findOne({ where: { uuid: uuid } });
  if (!photo) return next(new AppError('Not found', 404));

  if (req.file) {
    let rubbish = `images/gallery/${photo.img}`;
    let date = Date.now();
    let newImg = `${date}.webp`;
    await sharp(req.file.buffer)
      .toFormat('webp')
      .webp({ quality: 70 })
      .toFile(`images/gallery/${newImg}`);

    fs.unlink(rubbish, (err) => {
      if (err) {
        console.log(`Error deleting this file ${rubbish}`);
      } else {
        console.log(`Photo has been deleted ${rubbish}`);
      }
    });
    await photo.update({ img: newImg });
  }
  let name_en = req.body.name_en || photo.name_en;
  let name_ru = req.body.name_ru || photo.name_ru;
  let name_tm = req.body.name_tm || photo.name_tm;

  await photo.update({ name_en, name_ru, name_tm });

  photo.img = `${req.protocol}://${req.get('host')}/images/gallery/${
    photo.img
  }`;

  return res.status(201).send(photo);
});

exports.getOneGallery = catchAsync(async (req, res, next) => {
  let uuid = req.params.uuid;
  const photo = await Gallery.findOne({
    where: { uuid: uuid },
    include: [
      {
        model: otherGallery,
        as: 'another',
        attributes: ['img', 'id'],
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
