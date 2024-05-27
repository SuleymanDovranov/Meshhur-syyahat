const { AboutUs } = require('./../../models');
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

exports.editAboutUs = async (req, res, next) => {
  try {
    const about = await AboutUs.findOne({ where: { id: '7' } });

    if (!about) {
      return res.status(404).json({ error: 'About Us entry not found' });
    }

    if (req.file) {
      const oldImgPath = `images/aboutUs/${about.img}`;
      let date = Date.now();
      const newImg = `${date}.webp`;

      await sharp(req.file.buffer)
        .toFormat('webp')
        .webp({ quality: 70 })
        .toFile(`images/aboutUs/${newImg}`);

      fs.unlink(oldImgPath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${oldImgPath}`, err);
        } else {
          console.log(`Old image file ${oldImgPath} deleted successfully`);
        }
      });

      await about.update({ img: newImg });
    }

    let desc_tm = req.body.desc_tm || about.desc_tm;
    let desc_ru = req.body.desc_ru || about.desc_ru;
    let desc_en = req.body.desc_en || about.desc_en;
    await about.update({ desc_en, desc_ru, desc_tm });

    about.img = `${req.protocol}://${req.get('host')}/images/aboutUs/${
      about.img
    }`;
    return res.status(200).json(about);
  } catch (error) {
    console.error('Error editing About Us entry:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

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

exports.deleteHeader = catchAsync(async (req, res, next) => {
  await AboutUs.destroy({ where: {} });
  return res.status(200).send({ msg: 'deleted' });
});

exports.addHeader = catchAsync(async (req, res, next) => {
  let desc_en = req.body.desc_en;
  let desc_ru = req.body.desc_ru;
  let desc_tm = req.body.desc_tm;

  let imgBuffer = req.file.buffer;
  const newImgName = `${Date.now()}.webp`;
  await sharp(imgBuffer)
    .toFormat('webp')
    .webp({ quality: 70 })
    .toFile(`images/aboutUs/${newImgName}`);

  const newService = await AboutUs.create({
    desc_en,
    desc_ru,
    desc_tm,
    img: newImgName,
  });

  newService.img = `${req.protocol}://${req.get(
    'host'
  )}/images/aboutUs/${newImgName}`;

  return res.status(201).send(newService);
});

// {
//   "development": {
//     "username": "root",
//     "password": "root5312023",
//     "database": "syyahat",
//     "host": "95.85.127.110",
//     "dialect": "postgres"
//   }
// }
