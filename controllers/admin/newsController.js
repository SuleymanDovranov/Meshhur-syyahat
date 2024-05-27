const { News } = require('./../../models');
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

exports.uploadNewsPhoto = upload.single('img');

exports.getAllNews = catchAsync(async (req, res, next) => {
  const news = await News.findAll();
  if (!news) return next(new AppError('No News', 404));

  return res.status(201).send(
    news.map((n) => {
      const { img, ...other } = n.toJSON();
      return {
        img: `${req.protocol}://${req.get('host')}/images/news/${img}`,
        ...other,
      };
    })
  );
});

exports.getOneNew = catchAsync(async (req, res, next) => {
  const news = await News.findOne({ where: { uuid: req.params.uuid } });
  if (!news) return next(new AppError('Not Found', 404));
  let img = news.img;
  news.img = `${req.protocol}://${req.get('host')}/images/news/${img}`;
  return res.status(201).send(news);
});

exports.addNews = catchAsync(async (req, res, next) => {
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
      .toFile(`images/news/${newImgName}`);

    const news = await News.create({
      name_en,
      name_ru,
      name_tm,
      desc_en,
      desc_ru,
      desc_tm,
      img: newImgName,
    });

    news.img = `${req.protocol}://${req.get('host')}/images/news/${newImgName}`;

    return res.status(201).send(news);
  } catch (error) {
    console.error('Error adding News entry:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

exports.deleteNews = catchAsync(async (req, res, next) => {
  try {
    const news = await News.findOne({ where: { uuid: req.params.uuid } });

    if (!news) return next(new AppError('News entry not found', 404));

    const imgPath = `images/news/${news.img}`;

    fs.unlink(imgPath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${imgPath}`, err);
      } else {
        console.log(`Image file ${imgPath} deleted successfully`);
      }
    });

    await news.destroy();

    return res.status(200).send({ msg: 'Deleted 💥' });
  } catch (error) {
    console.error('Error deleting News entry:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

exports.editNews = catchAsync(async (req, res, next) => {
  try {
    const news = await News.findOne({ where: { uuid: req.params.uuid } });

    if (!news) return next(new AppError('News entry not found', 404));

    if (req.file) {
      const oldImgPath = `images/news/${news.img}`;

      let date = Date.now();
      const newImg = `${date}.webp`;
      await sharp(req.file.buffer)
        .toFormat('webp')
        .webp({ quality: 70 })
        .toFile(`images/news/${newImg}`);

      fs.unlink(oldImgPath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${oldImgPath}`, err);
        } else {
          console.log(`Old image file ${oldImgPath} deleted successfully`);
        }
      });

      await news.update({ img: newImg });
    }

    let name_tm = req.body.name_tm || news.name_tm;
    let name_ru = req.body.name_ru || news.name_ru;
    let name_en = req.body.name_en || news.name_en;
    let desc_tm = req.body.desc_tm || news.desc_tm;
    let desc_ru = req.body.desc_ru || news.desc_ru;
    let desc_en = req.body.desc_en || news.desc_en;

    await news.update({ name_en, name_ru, name_tm, desc_en, desc_ru, desc_tm });

    let image = news.img;
    news.img = `${req.protocol}://${req.get('host')}/images/news/${image}`;

    return res.status(201).send(news);
  } catch (error) {
    console.error('Error editing News entry:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

exports.deleteAllNews = catchAsync(async (req, res, next) => {
  try {
    const allNews = await News.findAll();

    allNews.forEach(async (news) => {
      const imgPath = `images/news/${news.img}`;

      fs.unlink(imgPath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${imgPath}`, err);
        } else {
          console.log(`Image file ${imgPath} deleted successfully`);
        }
      });

      await news.destroy();
    });

    return res.status(200).send({ msg: 'All news entries deleted 💥' });
  } catch (error) {
    console.error('Error deleting all news entries:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
