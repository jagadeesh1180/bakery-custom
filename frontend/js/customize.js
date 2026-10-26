const form = document.getElementById('customizeForm');
const API_BASE_URL = window.BAKERY_API_BASE_URL || 'http://localhost:5000';

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const inputs = form.querySelectorAll('input');
    const payload = {
      customerName: inputs[0]?.value.trim(),
      productType: inputs[1]?.value.trim(),
      flavor: inputs[2]?.value.trim(),
      occasion: inputs[3]?.value.trim(),
      phone: inputs[4]?.value.trim(),
      email: inputs[5]?.value.trim(),
      instructions: form.querySelector('textarea')?.value.trim() || ''
    };

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton?.textContent;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Could not submit the order');
      alert(`Order submitted! Save your tracking ID: ${result.trackingId}`);
      form.reset();
    } catch (error) {
      alert(`Order was not saved: ${error.message}. Check that the backend is running and configured.`);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText || 'Submit Order';
      }
    }
  });
}
