const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find({ available: true }).sort({ category: 1, name: 1 }).lean();
    res.json({ products });
  } catch (error) { next(error); }
});
router.get('/:id', async (req, res, next) => {
  try {
    if (!/^[a-f\d]{24}$/i.test(req.params.id)) return res.status(400).json({ message: 'Invalid product ID' });
    const product = await Product.findOne({ _id: req.params.id, available: true }).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (error) { next(error); }
});
module.exports = router;
