const mongoose = require('mongoose');
require('dotenv').config();
const connection = mongoose.connect(process.env.Mongodb_URL);

module.exports = connection;