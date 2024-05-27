const { News } = require('./../../models');
const AppError = require('./../../utils/appError');
const catchAsync = require('./../../utils/catchAsync');

exports.getOneNew = catchAsync(async (req, res, next) => {
  const news = await News.findOne({ where: { uuid: req.params.uuid } });
  if (!news) return next(new AppError('Not Found', 404));
  let img = news.img;
  news.img = `${req.protocol}://${req.get('host')}/images/news/${img}`;
  return res.status(201).send(news);
});

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
