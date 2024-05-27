const { Tours } = require('./../../models');
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

exports.uploadToursPhoto = upload.single('img');

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

exports.addTour = catchAsync(async (req, res, next) => {
  try {
    let { loc_tm, loc_ru, loc_en, date, persons, desc_tm, desc_ru, desc_en } =
      req.body;

    let price = req.body.price || '';

    const imgBuffer = req.file.buffer;
    const newImgName = `${Date.now()}.webp`;
    await sharp(imgBuffer)
      .toFormat('webp')
      .webp({ quality: 70 })
      .toFile(`images/tours/${newImgName}`);

    const newTour = await Tours.create({
      loc_en,
      loc_ru,
      loc_tm,
      date,
      persons,
      desc_en,
      desc_ru,
      desc_tm,
      img: newImgName,
      price,
    });

    newTour.img = `${req.protocol}://${req.get(
      'host'
    )}/images/tours/${newImgName}`;
    return res.status(201).send(newTour);
  } catch (error) {
    console.error('Error adding Tour:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

exports.getAllTour = catchAsync(async (req, res, next) => {
  const tours = await Tours.findAll();
  if (!tours) return next(new AppError('Not found!', 404));

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

exports.editTour = catchAsync(async (req, res, next) => {
  try {
    const tour = await Tours.findOne({ where: { uuid: req.params.uuid } });

    if (!tour) return next(new AppError('Tour not found', 404));

    if (req.file) {
      const oldImgPath = `images/tours/${tour.img}`;
      fs.unlink(oldImgPath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${oldImgPath}`, err);
        } else {
          console.log(`Old image file ${oldImgPath} deleted successfully`);
        }
      });

      const imgBuffer = req.file.buffer;
      const newImgName = `${Date.now()}.webp`;
      await sharp(imgBuffer)
        .toFormat('webp')
        .webp({ quality: 70 })
        .toFile(`images/tours/${newImgName}`);

      await tour.update({ img: newImgName });
    }

    loc_en = req.body.loc_en || tour.loc_en;
    loc_ru = req.body.loc_ru || tour.loc_ru;
    loc_tm = req.body.loc_tm || tour.loc_tm;
    date = req.body.date || tour.date;
    persons = req.body.persons || tour.persons;
    desc_en = req.body.desc_en || tour.desc_en;
    desc_ru = req.body.desc_ru || tour.desc_ru;
    desc_tm = req.body.desc_tm || tour.desc_tm;
    price = req.body.price || tour.price;

    await tour.update({
      loc_en,
      loc_ru,
      loc_tm,
      date,
      persons,
      desc_en,
      desc_ru,
      desc_tm,
      price,
    });

    tour.img = `${req.protocol}://${req.get('host')}/images/tours/${tour.img}`;

    return res.status(200).json(tour);
  } catch (error) {
    console.error('Error editing tour:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  try {
    const tour = await Tours.findOne({ where: { uuid: req.params.uuid } });

    if (!tour) return next(new AppError('Tour not found!', 404));

    const imgPath = `images/tours/${tour.img}`;
    fs.unlink(imgPath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${imgPath}`, err);
      } else {
        console.log(`File ${imgPath} has been deleted`);
      }
    });

    const name = tour.locationName;

    await tour.destroy();

    return res.status(200).json({ msg: `Tour ${name} has been deleted!` });
  } catch (error) {
    console.error('Error deleting tour:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

exports.deleteAllTour = catchAsync(async (req, res, next) => {
  try {
    const tours = await Tours.findAll();

    tours.forEach((tour) => {
      const imgPath = `images/tours/${tour.img}`;
      fs.unlink(imgPath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${imgPath}`, err);
        } else {
          console.log(`File ${imgPath} has been deleted`);
        }
      });
    });

    await Tours.destroy({ where: {} });

    return res.status(200).json({ msg: 'All Tours have been deleted!' });
  } catch (error) {
    console.error('Error deleting all tours:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
