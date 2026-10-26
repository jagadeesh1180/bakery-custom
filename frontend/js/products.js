const products = [
  { name: 'Chocolate Cake', price: 39, type: 'Cake' },
  { name: 'Strawberry Tart', price: 24, type: 'Tart' },
  { name: 'Vanilla Cupcake', price: 12, type: 'Cupcake' },
  { name: 'Croissant', price: 8, type: 'Pastry' },
  { name: 'Brownie Box', price: 18, type: 'Dessert' }
];

const productGrid = document.getElementById('productGrid');

if (productGrid) {
  productGrid.innerHTML = products
    .map(
      (product) => `
        <div class="product-card">
          <h3>${product.name}</h3>
          <p>${product.type}</p>
          <p class="price">$${product.price}</p>
          <button class="btn primary">Add to Cart</button>
        </div>
      `
    )
    .join('');
}
