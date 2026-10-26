const form = document.getElementById('customizeForm');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Your customized bakery order has been submitted successfully!');
    form.reset();
  });
}
