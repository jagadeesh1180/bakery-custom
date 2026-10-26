const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, default: '', maxlength: 1000 },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: '' },
  available: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
