const mongoose = require("mongoose")

const ServiceSchema = new mongoose.Schema({
  image: String,
   
})

module.exports =mongoose.model("services", ServiceSchema);