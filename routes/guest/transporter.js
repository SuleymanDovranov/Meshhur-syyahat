const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'hallievshahzad7@gmail.com', pass: 'tsrlnyjwmnenwfsc' },
});
module.exports = transporter;
