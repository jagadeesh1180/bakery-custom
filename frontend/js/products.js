const API_BASE_URL = window.BAKERY_API_BASE_URL || 'http://localhost:5000';
const productGrid = document.getElementById('productGrid');

async function loadProducts() {
  if (!productGrid) return;
  productGrid.innerHTML = '<p>Loading products...</p>';
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    if (!response.ok) throw new Error('Unable to load products');
    const data = await response.json();
    const products = data.products || [];

    if (!products.length) {
      productGrid.innerHTML = '<p>No products have been added yet. Add product documents to MongoDB to display them.</p>';
      return;
    }

    productGrid.innerHTML = products.map(product => `
      <article class="product-card">
        ${product.image ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">` : ''}
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.description || product.category || '')}</p>
        <p class="price">₹${Number(product.price).toFixed(2)}</p>
      </article>
    `).join('');
  } catch (error) {
    productGrid.innerHTML = `<p>Could not load products: ${escapeHtml(error.message)}. Check the API URL and backend status.</p>`;
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}
loadProducts();
