const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    products: [
      { id: 1, name: 'Chocolate Cake', price: 39 },
      { id: 2, name: 'Strawberry Tart', price: 24 }
    ]
  });
});

module.exports = router;
