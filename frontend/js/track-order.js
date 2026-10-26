const API_BASE_URL = window.BAKERY_API_BASE_URL || 'http://localhost:5000';
const form = document.getElementById('trackForm');
if (form) form.addEventListener('submit', async event => {
  event.preventDefault();
  const id = document.getElementById('trackingId').value.trim();
  const result = document.getElementById('trackingResult');
  result.textContent = 'Looking up order...';
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/track/${encodeURIComponent(id)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Order not found');
    const order = data.order;
    result.textContent = `Order ${order.trackingId}: ${order.productType}, ${order.flavor}. Status: ${order.status}. Created: ${new Date(order.createdAt).toLocaleString()}.`;
  } catch (error) { result.textContent = error.message; }
});