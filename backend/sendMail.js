const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendMail = async (to, subject, html) => {
  return await transporter.sendMail({
    from: `"Empty Store" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  });
};

module.exports = sendMail;