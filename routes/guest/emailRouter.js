const express = require('express');
const router = express.Router();
const transporter = require('./transporter');

router.post('/sendEmail', async (req, res, next) => {
  const body = req.body;
  const mailList = ['wantedsuleyman@gmail.com'];
  const mailOptions = {
    from: body.email,
    to: mailList,
    subject: `Message by ${req.body.name}`,
    html: `<html><body><h2>Name: ${body.name}<h2><p>email: ${body.email}</p><p>Text: ${body.text}`,
  };
  transporter.sendMail(mailOptions, (err, result) => {
    if (err) {
      console.log(err);
      res.json('Opps error occured');
    } else {
      res.json('Thanks for e-mailing me!');
    }
  });
});

module.exports = router;
