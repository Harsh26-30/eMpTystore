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
const Request = require("./request");
const Ui = require("./Uidata");
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

const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

// const generateUniqueSlug = async (name) => {
//   let baseSlug = createSlug(name);
//   let slug = baseSlug;

//   let count = 1;
//   while (await User.findOne({ slug })) {
//     slug = `${baseSlug}-${count}`;
//     count++;
//   }

//   return slug;
// };

app.get("/myprofile", authMiddleware, async (req, res) => {
  const finduser = await User.findOne({ email: req.user.email });
  res.json({
    message: "Profile data",
    BusinessName: finduser.ui.generalinfo.BusinessName,
    Aboutus: finduser.profile.Aboutus,
    profilePicture: finduser.profile.profilepic,
    valid: "true"
  });
});

app.put("/shoporsellerprofile", authMiddleware, async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const finduser = await User.findById(id);

    if (!finduser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      BusinessName: finduser.ui?.generalinfo?.BusinessName || "",
      Aboutus: finduser.profile?.Aboutus || "",
      profilePicture: finduser.profile?.profilepic || "",
      valid: true
    });

  } catch (err) {
    console.error("shoporsellerprofile error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/profile/:id", async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id
  });

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  console.log("user PROFILE:", {
    id: user._id,
    BusinessName: user.ui.generalinfo.BusinessName,
    Aboutus: user.profile.Aboutus,
    profilePicture: user.profile.profilepic
  });

  res.json({
    id: user._id,
    BusinessName: user.ui.generalinfo.BusinessName || "",
    Aboutus: user.profile.Aboutus || "",
    profilePicture: user.profile.profilepic || ""
  });
});

app.put("/updateprofileAboutus", authMiddleware, async (req, res) => {
  const finduser = await User.findOne({ email: req.user.email });
  const { Aboutus } = req.body;
  await User.findOneAndUpdate(
    { email: req.user.email },
    { "profile.Aboutus": Aboutus },
    { new: true }
  );
  res.json({ message: "Profile updated successfully" });
});

app.put("/updateprofilePicture", upload.single("profilePicture"), authMiddleware, async (req, res) => {
  const finduser = await User.findOne({ email: req.user.email });
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "ui-backgrounds",
  });

   await finduser.updateOne({
      "profile.profilepic": result.secure_url
    });
 
  res.json({ message: "Profile updated successfully" });  
});

app.get("/checkuserinfo", authMiddleware, async (req, res) => {
  const finduser = await User.findOne({ email: req.user.email });
  const finduser2 = await User.find({
    _id: { $in: finduser.shoporseller }
  });


  const findproduct = await Product.find({
    _id: { $in: finduser.myproductid }
  });

  const findproductid1 = finduser.ui.productbox.productbox1id
    ? await Product.findById(finduser.ui.productbox.productbox1id)
    : null;

  const findproductid2 = finduser.ui.productbox.productbox2id
    ? await Product.findById(finduser.ui.productbox.productbox2id)
    : null;

  const findproductid3 = finduser.ui.productbox.productbox3id
    ? await Product.findById(finduser.ui.productbox.productbox3id)
    : null;

  const findproductid4 = finduser.ui.productbox.productbox4id
    ? await Product.findById(finduser.ui.productbox.productbox4id)
    : null;

  const findproductid5 = finduser.ui.productbox.productbox5id
    ? await Product.findById(finduser.ui.productbox.productbox5id)
    : null;

  const findproductid6 = finduser.ui.productbox.productbox6id
    ? await Product.findById(finduser.ui.productbox.productbox6id)
    : null;

  const findproductid7 = finduser.ui.productbox.productbox7id
    ? await Product.findById(finduser.ui.productbox.productbox7id)
    : null;

  const findproductid8 = finduser.ui.productbox.productbox8id
    ? await Product.findById(finduser.ui.productbox.productbox8id)
    : null;

  res.json({
    id: finduser._id,
    role: finduser.role,
    address: finduser.address,
    country: finduser.country,
    state: finduser.state,
    district: finduser.district,
    pincode: finduser.pincode,
    phoneNo: finduser.phoneNo,
    seller_key: finduser.seller_key,
    useruidata: finduser.ui,
    productbox: {

      BusinessName: finduser.ui.generalinfo.BusinessName,
      productbox1: findproductid1,
      productbox2: findproductid2,
      productbox3: findproductid3,
      productbox4: findproductid4,
      productbox5: findproductid5,
      productbox6: findproductid6,
      productbox7: findproductid7,
      productbox8: findproductid8

    },
    myproductdata: findproduct,
    shops: finduser2,
    shopOpenOrNot: finduser.shopOpenOrNot
  });

});

app.post("/updateaddress", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { address, country, state, district, pincode } = req.body;

    const format = (str) =>
      (str || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "_");

    const seller_key = `${user._id}_${format(user.ui.genralinfo.BusinessName)})}`;

    const updatedUser = await User.findOneAndUpdate(
      { email: user.email },
      {
        address,
        country,
        state,
        district,
        pincode,
        seller_key
      },
      { new: true }
    );

    // ✅ THIS WAS MISSING
    res.json({
      success: true,
      user: updatedUser
    });

  } catch (err) {
    console.log("🔥 ERROR:", err.response?.data || err.message);

    res.status(500).json({
      error: err.response?.data || err.message
    });
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

    const shop = await User.find({
      email: { $regex: userinput, $options: "i" }
    });

    res.json({ shop });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/buildconnection", authMiddleware, async (req, res) => {
  try {
    const { connectionid } = req.body;

    const customer = await User.findOne({
      email: req.user.email,
    });

    const seller = await await User.findOne({
      email: connectionid
    });


    if (!customer || !seller) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (customer !== seller) {

      // add seller to customer
      await User.findByIdAndUpdate(customer._id, {
        $addToSet: {
          shoporseller: seller._id,
        },
      });

      // add customer to seller
      await User.findByIdAndUpdate(seller._id, {
        $addToSet: {
          customer: customer._id,
        },
      });
    }

    res.json({
      message: "Connection successful",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message,
    });
  }
});

app.get("/Request", authMiddleware, async (req, res) => {
  try {

    const requests = await Request.find({});


    res.json({ requests: requests });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/becomeseller", authMiddleware, async (req, res) => {
  try {

    // Request
    const finduser = await User.findOne({ email: req.user.email });

    if (!finduser) {
      return res.status(404).json({ error: "User not found" });
    }

    const newRequest = new Request({
      role: finduser.role,
      email: finduser.email,
      phoneNo: finduser.phoneNo,
      address: finduser.address,
      country: finduser.country,
      state: finduser.state,
      district: finduser.district,
      pincode: finduser.pincode,
      seller_key: finduser.seller_key,
      requestof: "seller"
    });

    await newRequest.save();

    res.json({ msg: "your request has been recorded" })

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/updateproducttoui",
  upload.single("Backgroundimage"),
  authMiddleware,
  async (req, res) => {
    try {
      const { businessname, TextColor, BackgroundColor } = req.body;

      const updates = {};

      // IMAGE
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "ui-backgrounds",
        });

        updates["ui.generalinfo.Backgroundimage"] = result.secure_url;
      }

      // TEXT FIELDS
      if (businessname?.trim()) {
        updates["ui.generalinfo.BusinessName"] = businessname.trim();
      }

      if (BackgroundColor) {
        updates["ui.generalinfo.BackgroundColor"] = BackgroundColor;
      }

      if (TextColor) {
        updates["ui.generalinfo.TextColor"] = TextColor;
      }

      // PRODUCTS
      for (let i = 1; i <= 12; i++) {
        const value = req.body[`Product${i}`];

        if (value) {
          updates[`ui.productbox.productbox${i}id`] = value;
        }
      }

      if (Object.keys(updates).length === 0) {
        return res.json({ message: "Nothing to update" });
      }

      const updatedUser = await User.updateOne(
        { email: req.user.email },
        { $set: updates }
      );

      return res.json({
        message: "UI updated successfully",
        result: updatedUser,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);


app.post("/updateshoplistcustomerlist", authMiddleware, async (req, res) => {
  try {
    const finduser = await User.findOne({ email: req.user.email });

    const currentUserId = finduser._id;   // YOU
    const { shopOwnerId } = req.body;     // OTHER

    if (!shopOwnerId) {
      return res.status(400).json({ message: "shopOwnerId required" });
    }

    if (currentUserId.toString() === shopOwnerId) {
      return res.status(400).json({ message: "Cannot add yourself" });
    }

    // ✅ Update YOUR shop list
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { shoporseller: shopOwnerId }
    });

    // ✅ Update THEIR customer list
    await User.findByIdAndUpdate(shopOwnerId, {
      $addToSet: { customer: currentUserId }
    });

    res.json({ message: "Shop added successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/get-user-products", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    const products = await Product.find({ _id: { $in: user.myproductid } });

    res.json(products);


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/confirmOrders", authMiddleware, async (req, res) => {

  const { orderid } = req.body;

  try {

    // 1. Find order first
    const order = await Order.findById(orderid);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2. Find product
    const product = await Product.findById(order.productid);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 3. Update order status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderid,
      { orderstatus: "Confirm" },
      { new: true }
    );

    // 4. Reduce stock properly
    await Product.findByIdAndUpdate(
      order.productid,
      {
        $inc: {
          totalstock: -Number(order.quantity),
          unitsold: Number(order.quantity)
        }
      },
      { new: true }
    );

    res.json({ orders: updatedOrder });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/readyforDelivary", authMiddleware, async (req, res) => {
  const { orderid } = req.body
  try {

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderid },   // 🔍 find by email
      {
        orderstatus: "RFD"
      },
      { new: true } // ✅ return updated data
    );

    res.json({ orders: updatedOrder });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/Outfordelivary", authMiddleware, async (req, res) => {
  const { orderid } = req.body
  try {

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderid },   // 🔍 find by email
      {
        orderstatus: "OFD"
      },
      { new: true } // ✅ return updated data
    );


    res.json({ orders: updatedOrder });

  } catch (err) {
    console.log(err);
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
      productextrainfo,
      productstock
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
      productextrainfo,
      totalstock: productstock,
      unitsold: 0
    });

    // ✅ Save to MongoDB
    const savedProduct = await newProduct.save();

    const updatedaddproducttouserdata = await User.findOneAndUpdate(
      { email: req.user.email },
      {
        $push: {
          myproductid: savedProduct._id
        }
      },
      { new: true }
    );

    res.json({
      message: "Product added successfully",
      data: newProduct
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.post("/update-stock", authMiddleware, async (req, res) => {

  try {

    const { UpdateInputvalue, productid } = req.body;

    if (!UpdateInputvalue) {
      return res.status(400).json({
        message: "Stock value missing"
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productid,
      {
        $inc: {
          totalstock: Number(UpdateInputvalue)
        }
      },
      { new: true }
    );

    res.json({
      message: "Stock updated successfully",
      updatedProduct
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }
});

app.post("/addui", authMiddleware, async (req, res) => {
  try {
    const { uiid } = req.body;
    const type = uiid.split("_")[0]; // header / body / footer

    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      {
        $set: {
          [`ui.componentid.${type}`]: uiid
        }
      },
      { new: true }
    );

    const finduser = await User.findOne({ email: req.user.email });
    const findui = await Ui.findOne({
      Componentid: finduser.ui.componentid.header
    });
    res.json({ uicode: findui.Componentcode });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/uidatas", authMiddleware, async (req, res) => {
  try {
    const allUi = await Ui.find();
    res.json(allUi);
  } catch (err) {
    res.status(500).json({ message: "Error fetching UI data" });
  }
});

app.post("/uidata", authMiddleware, async (req, res) => {
  const { id } = req.body;
  try {

    if (id) {
      const finduserid = await User.findOne({ _id: id });
      const component = finduserid.ui?.componentid || {};

      const finduiheader = component.header
        ? await Ui.findOne({ Componentid: component.header })
        : null;

      const finduibody = component.body
        ? await Ui.findOne({ Componentid: component.body })
        : null;

      const finduifooter = component.footer
        ? await Ui.findOne({ Componentid: component.footer })
        : null;

      const findproductid1 = finduserid.ui.productbox.productbox1id
        ? await Product.findById(finduserid.ui.productbox.productbox1id)
        : null;

      const findproductid2 = finduserid.ui.productbox.productbox2id
        ? await Product.findById(finduserid.ui.productbox.productbox2id)
        : null;

      const findproductid3 = finduserid.ui.productbox.productbox3id
        ? await Product.findById(finduserid.ui.productbox.productbox3id)
        : null;

      const findproductid4 = finduserid.ui.productbox.productbox4id
        ? await Product.findById(finduserid.ui.productbox.productbox4id)
        : null;

      const findproductid5 = finduserid.ui.productbox.productbox5id
        ? await Product.findById(finduserid.ui.productbox.productbox5id)
        : null;

      const findproductid6 = finduserid.ui.productbox.productbox6id
        ? await Product.findById(finduserid.ui.productbox.productbox6id)
        : null;

      const findproductid7 = finduserid.ui.productbox.productbox7id
        ? await Product.findById(finduserid.ui.productbox.productbox7id)
        : null;

      const findproductid8 = finduserid.ui.productbox.productbox8id
        ? await Product.findById(finduserid.ui.productbox.productbox8id)
        : null;

      return res.json({
        uiheader: finduiheader?.Componentcode || "",
        uibody: finduibody?.Componentcode || "",
        uifooter: finduifooter?.Componentcode || "",
        ui: finduserid.ui || {},
        productbox: {

          BusinessName: finduserid.ui.generalinfo.BusinessName,
          productbox1: findproductid1,
          productbox2: findproductid2,
          productbox3: findproductid3,
          productbox4: findproductid4,
          productbox5: findproductid5,
          productbox6: findproductid6,
          productbox7: findproductid7,
          productbox8: findproductid8

        },
      });
    }

    const finduser = await User.findOne({ email: req.user.email });

    if (!finduser) {
      return res.status(404).json({ message: "User not found" });
    }

    const component = finduser.ui?.componentid || {};

    const finduiheader = component.header
      ? await Ui.findOne({ Componentid: component.header })
      : null;

    const finduibody = component.body
      ? await Ui.findOne({ Componentid: component.body })
      : null;

    const finduifooter = component.footer
      ? await Ui.findOne({ Componentid: component.footer })
      : null;

    res.json({
      uiheader: finduiheader?.Componentcode || "",
      uibody: finduibody?.Componentcode || "",
      uifooter: finduifooter?.Componentcode || "",
      ui: finduser.ui || {}
    });

  } catch (err) {
    console.log("❌ ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// uploadui
app.post("/uploadui", authMiddleware, async (req, res) => {

  try {
    const { Componentid, Componentcode } = req.body

    if (!Componentid || !Componentcode) {
      return res.json({ message: `Your code has not uploaded ${Componentid, Componentcode}` })
    }

    const findui = await Ui.insertOne({
      Componentid: Componentid,
      Componentcode: Componentcode
    });

    res.json({ message: `your id:${Componentid} code has recorded` })

  } catch (err) {
    console.log(" ERROR:", err);
    res.status(500).json({ message: "Server error" });
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

    const slug = await generateUniqueSlug(name);

    const hashedPassword = await bcrypt.hash(pass, 10);

    const newUser = new User({
      role: 'Customer',
      name,
      dob,
      gender,
      phoneNo,
      email,
      pass: hashedPassword,
      slug
    });

    await newUser.save();

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.json({ valid: "true", token });


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

    if (user) {
      const isMatch = await bcrypt.compare(pass, user.pass);

      if (isMatch) {
        const token = jwt.sign(
          { email },
          process.env.JWT_SECRET || "secretkey",
          { expiresIn: "365d" }
        );
        res.json({ valid: "true", token });
      } else {
        res.json({ msg: "Wrong Password Entered" });
      }
    } else {
      res.json({ msg: "User Not Found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/toggleShopOpenOrNot", authMiddleware, async (req, res) => {
  try {
    const finduser = await User.findOne({ email: req.user.email });

    if (!finduser) {
      return res.status(404).json({ message: "User not found" });
    }

    const newShopOpenOrNot = finduser.shopOpenOrNot === "Open" ? "Closed" : "Open";

    await User.updateOne(
      { email: req.user.email },
      { shopOpenOrNot: newShopOpenOrNot }
    );

    res.json({ shopOpenOrNot: newShopOpenOrNot });

  } catch (err) {
    console.log("TOGGLE SHOP OPEN OR NOT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/updatepassword", async (req, res) => {
  try {
    const { email, dob, newpassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const dbDob = new Date(user.dob).toISOString().split("T")[0];
    const inputDob = new Date(dob).toISOString().split("T")[0];

    if (dbDob !== inputDob) {
      return res.json({ success: false, message: "DOB does not match" });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    await User.updateOne(
      { email },
      { pass: hashedPassword }
    );

    return res.json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (err) {
    console.log("UPDATE PASSWORD ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});


app.listen(port, () => {
  console.log(`Example app listening on ports ${port}`)
})
