const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },

  paymentMethod: { 
    type: String, 
    enum: ['cod', 'online'], 
    default: 'cod' 
  },

  paymentId: { type: String }, // For Razorpay payment ID

  cardInfo: {
    cardNumber: { type: String },
    expiryMonth: { type: String },
    expiryYear: { type: String },
    cvv: { type: String },
  },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      product: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    }
  ],

  total: { type: Number, required: true },

  
  status: {
    type: String,
    enum: ['Pending', 'Order Confirmed', 'Shipped', 'Delivered'],
    default: 'Pending',
  },

  
  statusLocked: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);