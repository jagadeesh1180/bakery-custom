const products = [
  { id: 1, name: "Chocolate Cake", emoji: "🍫", price: 39, tag: "Custom" },
  { id: 2, name: "Strawberry Tart", emoji: "🍓", price: 24, tag: "Fresh" },
  { id: 3, name: "Vanilla Cupcake", emoji: "🧁", price: 12, tag: "Popular" },
  { id: 4, name: "Croissant", emoji: "🥐", price: 8, tag: "Breakfast" },
  { id: 5, name: "Fruit Donut", emoji: "🍩", price: 10, tag: "Sweet" },
  { id: 6, name: "Brownie Box", emoji: "🍪", price: 18, tag: "Mix" }
];

let cart = [];

const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const cartPanel = document.getElementById("cartPanel");
const cartButton = document.getElementById("cartButton");
const closeCart = document.getElementById("closeCart");
const orderForm = document.getElementById("orderForm");

function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image">${product.emoji}</div>
          <div class="product-info">
            <div>
              <h3>${product.name}</h3>
            </div>
            <span class="product-price">$${product.price}</span>
          </div>

          <div class="product-meta">
            <span>${product.tag}</span>
            <button class="add-btn" data-id="${product.id}">Add</button>
          </div>
        </article>
      `
    )
    .join("");
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);

  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
}

function updateCartUI() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = `$${total.toFixed(2)}`;

  cartItems.innerHTML = cart.length
    ? cart
        .map(
          (item) => `
          <div class="cart-item">
            <div>
              <strong>${item.name}</strong>
              <p>Qty: ${item.quantity}</p>
            </div>
            <div>
              <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
            </div>
          </div>
        `
        )
        .join("")
    : "<p>Your cart is empty.</p>";
}

productGrid.addEventListener("click", (event) => {
  const target = event.target.closest(".add-btn");
  if (!target) return;

  const productId = Number(target.dataset.id);
  addToCart(productId);
});

cartButton.addEventListener("click", () => {
  cartPanel.classList.add("open");
});

closeCart.addEventListener("click", () => {
  cartPanel.classList.remove("open");
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  alert("Your bakery inquiry has been sent successfully!");
  orderForm.reset();
});

renderProducts();
updateCartUI();
