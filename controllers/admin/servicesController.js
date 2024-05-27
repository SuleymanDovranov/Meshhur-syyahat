const { Services } = require('./../../models');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
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

exports.addService = catchAsync(async (req, res, next) => {
  let name_en = req.body.name_en;
  let name_ru = req.body.name_ru;
  let name_tm = req.body.name_tm;
  let desc_en = req.body.desc_en;
  let desc_ru = req.body.desc_ru;
  let desc_tm = req.body.desc_tm;

  let imgBuffer = req.file.buffer;
  const newImgName = `${Date.now()}.webp`;
  await sharp(imgBuffer)
    .toFormat('webp')
    .webp({ quality: 70 })
    .toFile(`images/services/${newImgName}`);

  const newService = await Services.create({
    name_en,
    name_ru,
    name_tm,
    desc_en,
    desc_ru,
    desc_tm,
    img: newImgName,
  });

  newService.img = `${req.protocol}://${req.get(
    'host'
  )}/images/services/${newImgName}`;

  return res.status(201).send(newService);
});

exports.getOne = catchAsync(async (req, res, next) => {
  let uuid = req.params.uuid;
  const service = await Services.findOne({ where: { uuid: uuid } });

  if (!service) return next(new AppError('Not found!'), 404);

  service.img = `${req.protocol}://${req.get('host')}/images/services/${
    service.img
  }`;

  return res.status(201).send(service);
});

exports.getAllServices = catchAsync(async (req, res, next) => {
  const services = await Services.findAll();

  if (!services)
    return next(new AppError('No Services yet please add Some!', 404));

  return res.status(201).send(
    services.map((n) => {
      const { img, ...other } = n.toJSON();
      return {
        img: `${req.protocol}://${req.get('host')}/images/services/${img}`,
        ...other,
      };
    })
  );
});

exports.editService = catchAsync(async (req, res, next) => {
  let uuid = req.params.uuid;
  const service = await Services.findOne({ where: { uuid: uuid } });

  if (!service) return next(new AppError('Not Found!', 404));

  if (req.file) {
    let rubbish = `images/services/${service.img}`;
    let date = Date.now();
    let newImgName = `${date}.webp`;
    await sharp(req.file.buffer)
      .toFormat('webp')
      .webp({ quality: 70 })
      .toFile(`images/services/${newImgName}`);

    fs.unlink(rubbish, (err) => {
      if (err) {
        console.log(`Can't delete this picture ${rubbish}`, err);
      } else {
        console.log(`File ${rubbish} successfully deleted!`);
      }
    });

    await service.update({ img: newImgName });
  }
  let name_en = req.body.name_en || service.name_en;
  let name_ru = req.body.name_ru || service.name_ru;
  let name_tm = req.body.name_tm || service.name_tm;
  let desc_en = req.body.desc_en || service.desc_en;
  let desc_ru = req.body.desc_ru || service.desc_ru;
  let desc_tm = req.body.desc_tm || service.desc_tm;

  await service.update({
    name_en,
    name_ru,
    name_tm,
    desc_en,
    desc_ru,
    desc_tm,
  });
  service.img = `${req.protocol}://${req.get('host')}/images/services/${
    service.img
  }`;
  return res.status(201).send(service);
});

exports.deleteAllService = catchAsync(async (req, res, next) => {
  const services = await Services.findAll();
  services.forEach((service) => {
    const rubbish = `images/services/${service.img}`;
    fs.unlink(rubbish, (err) => {
      if (err) {
        console.log(`Can't delete ${rubbish} picture`);
      } else {
        console.log(`Deleted succesfully ${rubbish}`);
      }
    });
  });
  await Services.destroy({ where: {} });
  return res.status(200).send({ msg: 'All services has been deleted!' });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  let uuid = req.params.uuid;
  const service = await Services.findOne({ where: { uuid: uuid } });

  if (!service) return next(new AppError('Not Found!', 404));

  rubbish = `images/services/${service.img}`;
  fs.unlink(rubbish, (err) => {
    if (err) {
      console.log(`Can't delete this picture ${rubbish}`);
    } else {
      console.log(`Picture has been deleted ${rubbish}`);
    }
  });

  await service.destroy();
  return res.status(200).send({ msg: 'Service has been deleted!' });
});
