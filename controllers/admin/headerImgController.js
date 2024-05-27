const { Headerimg } = require('./../../models');
const AppError = require('./../../utils/appError');
const catchAsync = require('./../../utils/catchAsync');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');

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

exports.getAll = catchAsync(async (req, res, next) => {
  const photos = await Headerimg.findAll({});
  if (!photos) return next(new AppError('Nothing there', 404));
  return res.status(201).send(
    photos.map((n) => {
      const { img, ...other } = n.toJSON();
      return {
        img: `${req.protocol}://${req.get('host')}/images/header/${img}`,
        ...other,
      };
    })
  );
});

exports.addImg = catchAsync(async (req, res, next) => {
  let headerId = '2';
  let imgBuffer = req.file.buffer;
  const newImgName = `${Date.now()}.webp`;
  await sharp(imgBuffer)
    .toFormat('webp')
    .webp({ quality: 70 })
    .toFile(`images/header/${newImgName}`);

  const newImgHeader = await Headerimg.create({
    headerId: headerId,
    img: newImgName,
  });

  return res.status(201).send({ msg: 'Added!' });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  let id = req.params.id;
  const none = await Headerimg.findOne({ where: { id: id } });

  if (!none) return next(new AppError('Not Found!', 404));

  let rubbish = `images/header/${none.img}`;
  fs.unlink(rubbish, (err) => {
    if (err) {
      console.log(`Error deleting file: ${rubbish}`, err);
    } else {
      console.log(`Image file deleted ${rubbish}`);
    }
  });

  await none.destroy();
  return res.status(200).send({ msg: 'Deleted 💥' });
});

exports.editPhoto = catchAsync(async (req, res, next) => {
  let id = req.params.id;
  const photo = await Headerimg.findOne({ where: { id: id } });
  if (!photo) return next(new AppError('Not found', 404));

  if (req.file) {
    let rubbish = `images/header/${photo.img}`;
    let date = Date.now();
    let newImg = `${date}.webp`;
    await sharp(req.file.buffer)
      .toFormat('webp')
      .webp({ quality: 70 })
      .toFile(`images/header/${newImg}`);

    fs.unlink(rubbish, (err) => {
      if (err) {
        console.log(`Error deleting this file ${rubbish}`);
      } else {
        console.log(`Photo has been deleted ${rubbish}`);
      }
    });
    await photo.update({ img: newImg });
  }

  photo.img = `${req.protocol}://${req.get('host')}/images/header/${photo.img}`;

  return res.status(201).send(photo);
});

exports.deleteAll = catchAsync(async (req, res, next) => {
  const all = await Headerimg.findAll();

  all.forEach(async (header) => {
    const rubbish = `images/header/${header.img}`;

    fs.unlink(rubbish, (err) => {
      if (err) {
        console.log(`Error deleting photo ${rubbish}`, err);
      } else {
        console.log(`Deleted ${rubbish}`, err);
      }
    });
    await header.destroy();
  });

  return res.status(201).send({ msg: 'All deleted💥' });
});
