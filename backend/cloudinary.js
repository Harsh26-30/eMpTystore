const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: "dgo7ddgdh",
//   api_key: "843774476977626",
//   api_secret: "i39c3XeAB9FwbTK9opKxXr1ZZis"
// });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

module.exports = cloudinary;