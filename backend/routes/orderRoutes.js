const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// POST /api/orders - create and persist a custom order
router.post('/', async (req, res, next) => {
  try {
    const { customerName, phone, email, productType, flavor, occasion, instructions } = req.body || {};
    if (![customerName, phone, productType, flavor].every(v => typeof v === 'string' && v.trim())) {
      return res.status(400).json({ message: 'customerName, phone, productType, and flavor are required.' });
    }

    const order = await Order.create({
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: typeof email === 'string' ? email.trim() : '',
      productType: productType.trim(),
      flavor: flavor.trim(),
      occasion: typeof occasion === 'string' ? occasion.trim() : '',
      instructions: typeof instructions === 'string' ? instructions.trim() : ''
    });

    res.status(201).json({
      message: 'Order saved successfully',
      trackingId: order.trackingId,
      order: {
        trackingId: order.trackingId,
        customerName: order.customerName,
        productType: order.productType,
        flavor: order.flavor,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/track/:trackingId - limited public fields
router.get('/track/:trackingId', async (req, res, next) => {
  try {
    const trackingId = String(req.params.trackingId || '').trim().toUpperCase();
    const order = await Order.findOne({ trackingId }).select('trackingId productType flavor status createdAt').lean();
    if (!order) return res.status(404).json({ message: 'Order not found. Check the tracking ID.' });
    res.json({ order });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
