const productList = [
  { id: 1, name: 'Chocolate Cake', price: 39 },
  { id: 2, name: 'Strawberry Tart', price: 24 }
];

exports.getProducts = (req, res) => {
  res.json(productList);
};
