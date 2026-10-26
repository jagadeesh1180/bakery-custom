const form = document.getElementById('customizeForm');
const API_BASE_URL = window.BAKERY_API_BASE_URL || 'http://localhost:5000';
if (form) {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const inputs = form.querySelectorAll('input');
    const payload = { customerName: inputs[0]?.value.trim(), productType: inputs[1]?.value.trim(), flavor: inputs[2]?.value.trim(), occasion: inputs[3]?.value.trim(), phone: inputs[4]?.value.trim(), email: inputs[5]?.value.trim(), instructions: form.querySelector('textarea')?.value.trim() || '' };
    const button = form.querySelector('button[type="submit"]');
    const oldText = button?.textContent;
    if (button) { button.disabled = true; button.textContent = 'Submitting...'; }
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Could not submit order');
      alert(`Order submitted! Save your tracking ID: ${result.trackingId}`); form.reset();
    } catch (error) { alert(`Order was not saved: ${error.message}. Check backend URL and database configuration.`); }
    finally { if (button) { button.disabled = false; button.textContent = oldText || 'Submit Order'; } }
  });
}
