const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { customerName, productType, flavor } = req.body;

  if (!customerName || !productType || !flavor) {
    return res.status(400).json({ message: 'Missing required order fields' });
  }

  res.status(201).json({
    message: 'Order created successfully',
    order: { customerName, productType, flavor, status: 'pending' }
  });
});

module.exports = router;
