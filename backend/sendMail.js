const axios = require("axios");

const sendMail = async (to, subject, html) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Empty Store",
          email: process.env.SMTP_USER
        },
        to: [
          {
            email: to
          }
        ],
        subject,
        htmlContent: html
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (err) {
    console.error("EMAIL ERROR:", err.response?.data || err.message);
    throw err;
  }
};

module.exports = sendMail;