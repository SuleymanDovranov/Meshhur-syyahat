const { History } = require('./../../models');
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

exports.uploadHistoryPhoto = upload.single('img');

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

exports.getOneHistory = catchAsync(async (req, res, next) => {
  const history = await History.findOne({ where: { uuid: req.params.uuid } });
  if (!history) return next(new AppError('Not Found', 404));
  let img = history.img;
  history.img = `${req.protocol}://${req.get('host')}/images/history/${img}`;
  return res.status(201).send(history);
});

exports.addHistory = catchAsync(async (req, res, next) => {
  try {
    let name_tm = req.body.name_tm;
    let name_ru = req.body.name_ru;
    let name_en = req.body.name_en;
    let desc_tm = req.body.desc_tm;
    let desc_ru = req.body.desc_ru;
    let desc_en = req.body.desc_en;
    let imgBuffer = req.file.buffer;

    let date = Date.now();
    const newImgName = `${date}.webp`;
    await sharp(imgBuffer)
      .toFormat('webp')
      .webp({ quality: 70 })
      .toFile(`images/history/${newImgName}`);

    const history = await History.create({
      name_en,
      name_ru,
      name_tm,
      desc_en,
      desc_ru,
      desc_tm,
      img: newImgName,
    });

    history.img = `${req.protocol}://${req.get(
      'host'
    )}/images/history/${newImgName}`;

    return res.status(201).send(history);
  } catch (error) {
    console.error('Error adding History entry:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

exports.deleteHistory = catchAsync(async (req, res, next) => {
  try {
    const history = await History.findOne({ where: { uuid: req.params.uuid } });

    if (!history) return next(new AppError('History entry not found', 404));

    const imgPath = `images/history/${history.img}`;

    fs.unlink(imgPath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${imgPath}`, err);
      } else {
        console.log(`Image file ${imgPath} deleted successfully`);
      }
    });

    await history.destroy();

    return res.status(200).send({ msg: 'Deleted 💥' });
  } catch (error) {
    console.error('Error deleting history entry:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

exports.editHistory = catchAsync(async (req, res, next) => {
  try {
    const history = await History.findOne({ where: { uuid: req.params.uuid } });

    if (!history) return next(new AppError('history entry not found', 404));

    if (req.file) {
      const oldImgPath = `images/history/${history.img}`;

      let date = Date.now();
      const newImg = `${date}.webp`;
      await sharp(req.file.buffer)
        .toFormat('webp')
        .webp({ quality: 70 })
        .toFile(`images/history/${newImg}`);

      fs.unlink(oldImgPath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${oldImgPath}`, err);
        } else {
          console.log(`Old image file ${oldImgPath} deleted successfully`);
        }
      });

      await history.update({ img: newImg });
    }

    let name_tm = req.body.name_tm || history.name_tm;
    let name_ru = req.body.name_ru || history.name_ru;
    let name_en = req.body.name_en || history.name_en;
    let desc_tm = req.body.desc_tm || history.desc_tm;
    let desc_ru = req.body.desc_ru || history.desc_ru;
    let desc_en = req.body.desc_en || history.desc_en;

    await history.update({
      name_en,
      name_ru,
      name_tm,
      desc_en,
      desc_ru,
      desc_tm,
    });

    let image = history.img;
    history.img = `${req.protocol}://${req.get(
      'host'
    )}/images/history/${image}`;

    return res.status(201).send(history);
  } catch (error) {
    console.error('Error editing history entry:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

exports.deleteAllHistory = catchAsync(async (req, res, next) => {
  try {
    const allHistory = await History.findAll();

    allHistory.forEach(async (history) => {
      const imgPath = `images/history/${history.img}`;

      fs.unlink(imgPath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${imgPath}`, err);
        } else {
          console.log(`Image file ${imgPath} deleted successfully`);
        }
      });

      await history.destroy();
    });

    return res.status(200).send({ msg: 'All history entries deleted 💥' });
  } catch (error) {
    console.error('Error deleting all history entries:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
