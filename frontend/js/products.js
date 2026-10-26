const API_BASE_URL = window.BAKERY_API_BASE_URL || 'http://localhost:5000';
const productGrid = document.getElementById('productGrid');
async function loadProducts() {
  if (!productGrid) return;
  productGrid.innerHTML = '<p>Loading products...</p>';
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    if (!response.ok) throw new Error('Unable to load products');
    const products = (await response.json()).products || [];
    if (!products.length) { productGrid.innerHTML = '<p>No products have been added yet. Add product documents to MongoDB to display them.</p>'; return; }
    productGrid.innerHTML = products.map(p => `<article class="product-card">${p.image ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy">` : ''}<h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description || p.category || '')}</p><p class="price">₹${Number(p.price).toFixed(2)}</p></article>`).join('');
  } catch (error) { productGrid.innerHTML = `<p>Could not load products: ${escapeHtml(error.message)}. Check API URL and backend status.</p>`; }
}
function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
loadProducts();
