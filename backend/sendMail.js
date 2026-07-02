const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendMail = async (to, subject, html) => {
  return await transporter.sendMail({
    from: `"Empty Store" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html
  });
};

module.exports = sendMail;