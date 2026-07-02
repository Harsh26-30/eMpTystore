import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendMail = async (to, subject, html) => {
    await transporter.sendMail({
        from: `"Empty Store" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        html
    });
};

export default sendMail;