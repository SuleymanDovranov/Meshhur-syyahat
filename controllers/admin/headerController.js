const { Header, Headerimg } = require('./../../models');
const AppError = require('./../../utils/appError');
const catchAsync = require('./../../utils/catchAsync');

exports.getHeader = catchAsync(async (req, res, next) => {
  let header = await Header.findOne({
    where: { id: 2 },
    include: [
      {
        model: Headerimg,
        as: 'imgs',
      },
    ],
  });

  for (let i = 0; i < header.imgs.length; i++) {
    header.imgs[i].img = `${req.protocol}://${req.get('host')}/images/header/${
      header.imgs[i].img
    }`;
  }

  return res.status(201).send(header);
});

exports.editHeader = catchAsync(async (req, res, next) => {
  const oldHeader = await Header.findOne({ where: { id: 2 } });

  console.log('❎', req.body);

  let name_tm = req.body.name_tm || oldHeader.name_tm;
  let name_ru = req.body.name_ru || oldHeader.name_ru;
  let name_en = req.body.name_en || oldHeader.name_en;
  let desc_tm = req.body.desc_tm || oldHeader.desc_tm;
  let desc_ru = req.body.desc_ru || oldHeader.desc_ru;
  let desc_en = req.body.desc_en || oldHeader.desc_en;

  await oldHeader.update({
    name_en,
    name_ru,
    name_tm,
    desc_en,
    desc_ru,
    desc_tm,
  });

  return res.status(201).send(oldHeader);
});

// exports.deleteHeader = catchAsync(async (req, res, next) => {
//   await Header.destroy({ where: {} });
//   return res.status(200).send({ msg: 'deleted' });
// });

// exports.addHeader = catchAsync(async (req, res, next) => {
//   let name_en = req.body.name_en;
//   let name_ru = req.body.name_ru;
//   let name_tm = req.body.name_tm;
//   let desc_en = req.body.desc_en;
//   let desc_ru = req.body.desc_ru;
//   let desc_tm = req.body.desc_tm;

//   const newService = await Header.create({
//     name_en,
//     name_ru,
//     name_tm,
//     desc_en,
//     desc_ru,
//     desc_tm,
//   });

//   newService.img = `${req.protocol}://${req.get(
//     'host'
//   )}/images/header/${newImgName}`;

//   return res.status(201).send(newService);
// });
