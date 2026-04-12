const express = require('express')
const app = express()
const cors = require("cors");
require('dotenv').config();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const User = require("./userdata");
const Product = require("./productdata");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRET = process.env.JWT_SECRET || "secretkey";
const multer = require("multer");
const cloudinary = require("./cloudinary");


// multer config
const upload = multer({ dest: "uploads/" });

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.use(cors({
  origin: "https://emptystore.onrender.com",
  credentials: true
}));

app.use(express.json());

app.use(express.static(path.join(__dirname, "frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend/dist/index.html"));
});



const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "No token" });
  }
  const token = header.split(" ")[1]; // Bearer token
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Profile data",
    user: req.user,
    valid: "true"
  });
});

app.get("/checkuserinfo", authMiddleware, async (req, res) => {
 
  
  const finduser = await User.findOne({ email: req.user.email });
   
  res.json({
    address: finduser.address,
    country: finduser.country,
    state: finduser.state,
    district: finduser.district,
    pincode: finduser.pincode
  })
});

app.post("/updateaddress", authMiddleware, async (req, res) => {

  try {
    const { address, country, state, district, pincode } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { email: req.user.email },   // 🔍 find by email
      {
        address,
        country,
        state,
        district,
        pincode
      },
      { new: true } // ✅ return updated data
    );

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/search", authMiddleware, async (req, res) => {

  try {
    const { userinput } = req.body;

    if (!userinput) {
      return res.status(400).json({ error: "userinput is required" });
    }

    const products = await Product.find({
      productname: { $regex: userinput, $options: "i" }
    });
    res.json(products); // send array to frontend

    console.log(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// const Product = require("./models/Product"); // your model

app.post("/add-product", upload.single("image"), authMiddleware, async (req, res) => {
  try {
    // ✅ Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ✅ Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products"
    });

    // ✅ Get text fields from body
    const {
      productname,
      productcategory,
      productcolor,
      productprice,
      productextrainfo
    } = req.body;

    const finduser = await User.findOne({ email: req.user.email });

    // ✅ Create new product instance with exact schema fields
    const newProduct = new Product({
      productimage: result.secure_url,   // matches schema
      productname,
      productcategory,
      productcolor,
      productprice,
      productsellername: finduser.name,
      productsellerid: finduser._id,
      productextrainfo
    });

    // ✅ Save to MongoDB
    await newProduct.save();

    res.json({
      message: "Product added successfully",
      data: newProduct
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Upload failed" });
  }
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.post("/signup", async (req, res) => {
  try {
    const { name, dob, gender, email, pass } = req.body;

    const regexname = /^[A-Za-z\s]{3,20}$/;
    const regexemail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexname.test(name)) {
      return res.json({ valid: "false", msg: "Invalid Name" });
    }

    if (!regexemail.test(email)) {
      return res.json({ valid: "false", msg: "Invalid Email" });
    }

    const user = await User.findOne({ email:email });

    if (user) {
      return res.json({ valid: "false", msg: "Email already used" });
    }

    const hashedPassword = await bcrypt.hash(pass, 10);

    const newUser = new User({
      name,
      dob,
      gender,
      email,
      pass: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.json({ valid: "true", token });

    console.log("Sign up api caalled");
    

  } catch (err) {
    console.log("SIGNUP ERROR:", err); // 🔥 IMPORTANT
    res.status(500).json({ error: err.message });
  }
});


app.post("/login", async (req, res) => {
  try {
    const { email, pass } = req.body;
    const regexemail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (regexemail.test(email)) {
      pass
    } else {
      return res.json({ valid: "fasle", msg: "Inappropriate Email Typed" });
    }
    const user = await User.findOne({ email: email });
    const isMatch = await bcrypt.compare(pass, user.pass);
    if (email) {
      if (isMatch) {
        const token = jwt.sign(
          { email: email, pass: pass }, "secretkey",
          { expiresIn: "1d" }
        );
        res.json({ valid: "true", token });
      } else {
        res.json({ msg: "Wrong Password" });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
