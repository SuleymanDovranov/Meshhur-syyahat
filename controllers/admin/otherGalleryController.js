const { otherGallery, Gallery } = require('../../models');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

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

exports.addPhoto = catchAsync(async (req, res, next) => {
  const main = await Gallery.findOne({ where: { uuid: req.params.uuid } });

  if (!main) return next(new AppError('Not Found', 404));

  const galleryId = main.id;

  let img = req.file.buffer;
  let date = Date.now();
  const newImgName = `${date}.webp`;
  await sharp(img)
    .toFormat('webp')
    .webp({ quality: 70 })
    .toFile(`images/gallery/otherGallery/${newImgName}`);

  img = newImgName;
  const ottherGallery = await otherGallery.create({
    galleryId,
    img,
  });
  ottherGallery.img = `${req.protocol}://${req.get(
    'host'
  )}/images/gallery/otherGallery/${newImgName}`;
  return res.status(201).send(ottherGallery);
});

exports.deletePhoto = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const oldImg = await otherGallery.findOne({ where: { id: id } });
  if (!oldImg) return next(new AppError('Not Found!', 404));

  let rubbish = `images/gallery/otherGallery/${oldImg.img}`;
  fs.unlink(rubbish, (err) => {
    if (err) {
      console.log(`Error deleting file: ${rubbish}`, err);
    } else {
      console.log(`Image file deleted ${rubbish}`);
    }
  });

  await oldImg.destroy();

  return res.status(201).send({ msg: '💥 Deleted' });
});

exports.editPohoto = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const oldImg = await otherGallery.findOne({ where: { id: id } });

  let rubbish = `images/gallery/otherGallery/${oldImg.img}`;
  fs.unlink(rubbish, (err) => {
    if (err) {
      console.log(`Error deleting file: ${rubbish}`, err);
    } else {
      console.log(`Image file deleted ${rubbish}`);
    }
  });

  let img = req.file.buffer;
  let date = Date.now();
  const newImgName = `${date}.webp`;
  await sharp(img)
    .toFormat('webp')
    .webp({ quality: 70 })
    .toFile(`images/gallery/otherGallery/${newImgName}`);

  await oldImg.update({
    img: newImgName,
  });

  oldImg.img = `${req.protocol}://${req.get(
    'host'
  )}/images/gallery/otherGallery/${newImgName}`;
  return res.status(201).send(oldImg);
});

exports.deleteAll = catchAsync(async (req, res, next) => {
  const main = await Gallery.findOne({ where: { uuid: req.params.uuid } });

  const galleryId = main.id;

  const allImg = await otherGallery.findAll({
    where: { galleryId: galleryId },
  });

  allImg.forEach(async (gallery) => {
    const rubbish = `images/gallery/othergallery/${gallery.img}`;

    fs.unlink(rubbish, (err) => {
      if (err) {
        console.log(`Error deleting photo ${rubbish}`, err);
      } else {
        console.log(`Deleted ${rubbish}`, err);
      }
    });
    await gallery.destroy();
  });

  return res.status(201).send({ msg: 'All deleted💥' });
});
