const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const multer = require("multer")
const UserModel = require("./model/Users")
const ProductModel = require("./model/add-product")
const OrderModel = require("./model/Order")
const app = express()
const sendOrderEmail = require("./sendOrderEmail")
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const port = process.env.port;

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});



app.use(express.json())
app.use(cors())
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.Mongodb_URL)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err))



app.post("/login", (req,res)=>{

  const {email,password} = req.body

  UserModel.findOne({email,password})
  .then(user=>{
      if(user){
        res.json("Success")
      }else{
        res.json("Failed")
      }
  })
  .catch(err=>res.json(err))

})



app.post("/register", (req,res)=>{

  UserModel.create(req.body)
  .then(user=>res.json(user))
  .catch(err=>res.json(err))

})

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"uploads")
    },
    filename: function(req,file,cb){
        cb(null,Date.now()+"-"+file.originalname)
    }
})

const upload = multer({storage:storage})

app.post("/add-product", upload.single("image"), async (req, res) => {
  try {

     console.log(req.body);
    const product = new ProductModel({
      product: req.body.product,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
      brand: req.body.brand,
      stock: req.body.stock,
      color: req.body.color,
      discount: req.body.discount,
      rating: req.body.rating,
      image: req.file ? req.file.filename : ""
    });

    await product.save();

    res.json("Product Added");
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/order", async (req, res) => {
  try {
    const orderData = req.body;

    console.log("Incoming Request Body:", orderData);
    console.log("Customer Data:", orderData.customer);
    console.log("Customer Email:", orderData.customer?.email);

    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    if (
      !orderData.customer ||
      !orderData.customer.email ||
      orderData.customer.email.trim() === ""
    ) {
      return res.status(400).json({ error: "Email is required" });
    }

    const newOrder = new OrderModel(orderData);
    const savedOrder = await newOrder.save();

    console.log("Saved Order:", savedOrder);

    await sendOrderEmail({
      customer: savedOrder.customer,
      items: savedOrder.items,
      total: savedOrder.total,
      paymentMethod: savedOrder.paymentMethod,
      paymentId: savedOrder.paymentId,
    });

    res.status(201).json({
      message: "Order placed successfully & email sent",
      order: savedOrder,
    });

  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).json({ error: err.message || "Failed to place order" });
  }
});

app.get("/order", async (req, res) => {
  try {
    const orders = await OrderModel
      .find()
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Fetch Orders Error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});



app.put("/order/:id", async (req, res) => {
  try {
    const { status } = req.body;

    console.log("Incoming Status:", status);

    const order = await OrderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.statusLocked) {
      return res.status(400).json({ error: "Order already delivered" });
    }

    order.status = status;

   
    if (status === "Delivered") {
      order.statusLocked = true;
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);

  } catch (err) {
    console.error("UPDATE ERROR:", err.message);
    res.status(500).json({ error: err.message || "Failed to update status" });
  }
});


app.delete("/order/:id", async (req, res) => {
  try {
    const deleted = await OrderModel.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });

  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});


app.get("/payment/:paymentId", async (req, res) => {
  const paymentId = req.params.paymentId;
  const razorpay = new Razorpay({
    key_id: process.env.rzp_test_Sc8B6Js01KxpH9,
    key_secret: process.env.vUbxXij02IVsrCnRC4MO4oJN,
  });

  try {
    const payment = await razorpay.payments.fetch(paymentId);

    if(!payment){
      return res.status(404).json({ error: "Payment not found" });
    }
    
    res.json({
      status: payment.status,
      method: payment.method,
      amount: payment.amount,
      currency: payment.currency
    })
  }catch (error) {
    console.error("Razorpay Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch payment details" });
  }
});



app.get("/view-product", async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.get("/products", (req, res) => {
    ProductModel.find({})
    .then(products => res.json(products))
    .catch(err => res.json(err));
});


app.delete("/deleteProduct/:id", (req, res) => {
    const id = req.params.id;

    ProductModel.findByIdAndDelete(id)
    .then(result => res.json(result))
    .catch(err => res.json(err));
});



app.get("/getProduct/:id", (req, res) => {
  ProductModel.findById(req.params.id)
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

app.put("/updateProduct/:id", (req, res) => {
  const id = req.params.id;
  ProductModel.findByIdAndUpdate(id, req.body, { new: true })
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

app.get("/users", (req, res) => {
  UserModel.find({})
    .then(users => res.json(users))
    .catch(err => res.json(err));
});


app.delete("/deleteUser/:id", (req, res) => {
  UserModel.findByIdAndDelete(req.params.id)
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

app.post("/create-order", async (req, res) => {
  try {
    const Razorpay = require("razorpay");

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: req.body.amount * 100,
      currency: "INR",
    });

    res.json(order);
  } catch (err) {
    console.error("Razorpay Error:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
});

app.listen(3001,()=>{
  console.log("Server running on port 3001")
})