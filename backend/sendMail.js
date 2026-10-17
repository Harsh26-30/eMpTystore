const axios = require("axios");

const sendMail = async (to, subject, html) => {
  try {
    const senderEmail = process.env.BREVO_SENDER_EMAIL;

    if (!senderEmail) {
      throw new Error("BREVO_SENDER_EMAIL is missing");
    }

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Empty Store",
          email: senderEmail
        },
        to: [{ email: to }],
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

    console.log("OTP email accepted by Brevo");
    return response.data;
  } catch (err) {
    console.error(
      "EMAIL ERROR:",
      err.response?.data || err.message
    );
    throw err;
  }
};

module.exports = sendMail;