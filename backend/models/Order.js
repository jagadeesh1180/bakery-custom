const mongoose = require('mongoose');
const crypto = require('crypto');

const orderSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    default: () => crypto.randomBytes(6).toString('hex').toUpperCase(),
    unique: true,
    index: true
  },
  customerName: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, trim: true, lowercase: true, default: '' },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  productType: { type: String, required: true, trim: true },
  flavor: { type: String, required: true, trim: true },
  occasion: { type: String, default: '', maxlength: 120 },
  instructions: { type: String, default: '', maxlength: 2000 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
