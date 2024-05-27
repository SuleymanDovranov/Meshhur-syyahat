const e = require('cors');
const { Contact } = require('./../../models');
const AppError = require('./../../utils/appError');
const catchAsync = require('./../../utils/catchAsync');

exports.editAdress = catchAsync(async (req, res, next) => {
  const newAdress = await Contact.findOne({ where: { id: 2 } });
  let adress = req.body.adress || newAdress.adress;
  let telNum = req.body.telNum || newAdress.telNum;
  let whatNum = req.body.whatNum || newAdress.whatNum;
  let teleNum = req.body.teleNum || newAdress.teleNum;
  let email = req.body.email || newAdress.email;
  let header_en = req.body.header_en || newAdress.header_en;
  let header_tm = req.body.header_tm || newAdress.header_tm;
  let header_ru = req.body.header_ru || newAdress.header_ru;
  let desc_en = req.body.desc_en || newAdress.desc_en;
  let desc_tm = req.body.desc_tm || newAdress.desc_tm;
  let desc_ru = req.body.desc_ru || newAdress.desc_ru;

  await newAdress.update({
    adress,
    telNum,
    whatNum,
    teleNum,
    email,
    header_en,
    header_ru,
    header_tm,
    desc_en,
    desc_ru,
    desc_tm,
  });

  return res.status(201).send(newAdress);
});

exports.getAdress = catchAsync(async (req, res, next) => {
  const adress = await Contact.findOne({ where: { id: 2 } });

  return res.status(201).send(adress);
});

// exports.addContact = catchAsync(async (req, res, next) => {
//   let adress = req.body.adress;
//   let telNum = req.body.telNum;
//   let whatNum = req.body.whatNum;
//   let teleNum = req.body.teleNum;
//   let email = req.body.email;
//   let header_en = req.body.header_en;
//   let header_tm = req.body.header_tm;
//   let header_ru = req.body.header_ru;
//   let desc_en = req.body.desc_en;
//   let desc_tm = req.body.desc_tm;
//   let desc_ru = req.body.desc_ru;
//   const contact = await Contact.create({
//     adress,
//     telNum,
//     teleNum,
//     whatNum,
//     email,
//     header_en,
//     header_ru,
//     header_tm,
//     desc_en,
//     desc_ru,
//     desc_tm,
//   });

//   return res.status(201).send(contact);
// });
