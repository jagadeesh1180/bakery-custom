exports.createOrder = (req, res) => {
  const { customerName, productType, flavor } = req.body;

  if (!customerName || !productType || !flavor) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  res.status(201).json({
    message: 'Order created successfully',
    order: { customerName, productType, flavor, status: 'pending' }
  });
};
