const express = require('express')
const app = express()
const path = require("path");
const cors = require("cors");
require('dotenv').config();
const axios = require("axios");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const User = require("./userdata");
const Product = require("./productdata");
const Order = require("./orderdata");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRET = process.env.JWT_SECRET || "secretkey";
const multer = require("multer");
const cloudinary = require("./cloudinary");
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);



// multer config
const upload = multer({ dest: "uploads/" });

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// app.use(cors({
//   origin: "https://emptystore.onrender.com",
//   credentials: true
// }));

app.use(cors({
  origin: "http://localhost:5173", // or your frontend port
  credentials: true
}));

app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use('/uploads', express.static('uploads'));

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

// app.get("/checkUserRole", authMiddleware, (req, res) => {
//   try {
//     finduser = 

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: err.message });
//   }
// });

app.get("/checkuserinfo", authMiddleware, async (req, res) => {


  const finduser = await User.findOne({ email: req.user.email });

  res.json({
    address: finduser.address,
    country: finduser.country,
    state: finduser.state,
    district: finduser.district,
    pincode: finduser.pincode,
    phoneNo: finduser.phoneNo,
    role: finduser.role,
    pickup_location: finduser.pickup_location
  })
});

app.post("/updateaddress", authMiddleware, async (req, res) => {
  try {
    const { address, country, state, district, pincode } = req.body;

    const format = (str) =>
      str
        ?.toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "_");

    const pickup_location = `${format(req.user.name || "user")}_${format(state)}_${format(district)}_${req.user._id}`;

    const updatedUser = await User.findOneAndUpdate(
      { email: req.user.email },
      {
        address,
        country,
        state,
        district,
        pincode,
        pickup_location   // ✅ IMPORTANT
      },
      { returnDocument: 'after' }
    );

    res.json({
      success: true,
      user: updatedUser
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/updatecontact", authMiddleware, async (req, res) => {

  try {
    const { phoneNo } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { email: req.user.email },   // 🔍 find by email
      {
        phoneNo
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

app.post("/confirmOrders", authMiddleware, async (req, res) => {
  const { orderid } = req.body
  try {

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderid },   // 🔍 find by email
      {
        orderstatus: "Confirm"
      },
      { new: true } // ✅ return updated data
    );


    res.json({ orders: updatedOrder });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/readyforshipment", authMiddleware, async (req, res) => {
  const { orderid } = req.body;

  try {
    const order = await Order.findById(orderid);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // 🔹 Get seller
    const seller = await User.findById(order.sellerid);

    if (!seller || !seller.pickup_location) {
      return res.status(400).json({ msg: "Seller pickup location missing" });
    }

    // 🔹 Get Shiprocket token
    const tokenRes = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD
      }
    );

    const token = tokenRes.data.token;

    // 🔹 Create shipment
    const shipmentRes = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      {
        order_id: order._id.toString(),
        order_date: new Date(),

        pickup_location: seller.pickup_location,

        billing_customer_name: order.customername,
        billing_address: order.address,
        billing_pincode: order.pincode,
        billing_phone: order.phoneNo,

        shipping_is_billing: true,

        order_items: [
          {
            name: order.productname,
            sku: order.productid,
            units: order.quantity,
            selling_price: 500
          }
        ],

        payment_method: "Prepaid",
        sub_total: 500,

        length: 10,
        breadth: 10,
        height: 5,
        weight: order.weight || 0.5
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const shipment_id = shipmentRes.data.shipment_id;

    // 🔹 Assign courier
    const courierRes = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
      { shipment_id },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = courierRes.data.response.data;

    // 🔹 Save in DB
    order.orderstatus = "Shipped";
    order.shipment_id = shipment_id;
    order.awb_code = data.awb_code;
    order.courier_name = data.courier_name;
    order.tracking_url = data.tracking_url;

    await order.save();

    res.json({
      success: true,
      awb: data.awb_code,
      courier: data.courier_name
    });

  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/Orders", authMiddleware, async (req, res) => {
  try {
    const finduser = await User.findOne({ email: req.user.email });

    if (!finduser) {
      return res.status(404).json({ message: "User not found" });
    }
    const orders = await Order.find({
      sellerid: finduser._id   // no need for toString if ObjectId
    });


    console.log(orders); // true or false

    res.json({ orders: orders });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/placeOrder", authMiddleware, async (req, res) => {
  const { quantity, sellerid, productid, productname } = req.body;
  const finduser = await User.findOne({ email: req.user.email });

  try {
    const newOrder = new Order({
      customerid: finduser._id,
      customername: finduser.name,
      customeremail: finduser.email,
      address: finduser.address,
      country: finduser.country,
      state: finduser.state,
      district: finduser.district,
      pincode: finduser.pincode,
      phoneNo: finduser.phoneNo,
      productid,
      productname,
      quantity,
      sellerid,
      orderstatus: "Pending"
    });

    await newOrder.save();

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

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

app.get("/createkey", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 🔴 Validate data
    if (
      !user.name ||
      !user.phoneNo ||
      !user.address ||
      !user.district ||
      !user.state ||
      !user.country ||
      !user.pincode
    ) {
      return res.status(400).json({
        msg: "Complete your profile first"
      });
    }

    // Generate pickup location
    const newPickup = "LOC_" + Math.random().toString(36).substring(2, 8);
    user.pickup_location = newPickup;

    // Shiprocket login
    const tokenRes = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD
      }
    );

    const token = tokenRes.data.token;

    // Create pickup
    await axios.post(
      "https://apiv2.shiprocket.in/v1/external/settings/company/addpickup",
      {
        pickup_location: newPickup,
        name: user.name,
        email: user.email,
        phone: user.phoneNo,
        address: user.address,
        city: user.district,
        state: user.state,
        country: user.country,
        pin_code: user.pincode   // ✅ FIXED
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    await user.save();

    res.json({
      success: true,
      pickup_location: newPickup
    });

  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data || err.message
    });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { name, dob, gender, phoneNo, email, pass } = req.body;

    const regexname = /^[A-Za-z\s]{3,20}$/;
    const regexemail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexname.test(name)) {
      return res.json({ valid: "false", msg: "Invalid Name" });
    }

    if (!regexemail.test(email)) {
      return res.json({ valid: "false", msg: "Invalid Email" });
    }

    const user = await User.findOne({ email: email });

    if (user) {
      return res.json({ valid: "false", msg: "Email already used" });
    }

    const hashedPassword = await bcrypt.hash(pass, 10);

    const newUser = new User({
      role: 'Customer',
      name,
      dob,
      gender,
      phoneNo,
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

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});


app.listen(port, () => {
  console.log(`Example app listening on ports ${port}`)
})
