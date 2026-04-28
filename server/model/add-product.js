const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
   product: String,
   image: String,
   category: String,
   description: String,
   price: String,
   brand: String,
   color: String,
   stock: Number,
   discount: Number,
   rating: Number
})

module.exports =mongoose.model("add-product", ProductSchema);