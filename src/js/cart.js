import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const CART_KEY = "so-cart";

function getCart() {
  return getLocalStorage(CART_KEY) || [];
}

function saveCart(cart) {
  setLocalStorage(CART_KEY, cart);
}

function cartItemTemplate(item) {
  const quantity = item.quantity || 1;
  const price = item.FinalPrice ?? item.price ?? 0;
  const lineTotal = price * quantity;

  return `
<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <label class="cart-card__quantity">
    qty:
    <input type="number" class="cart-qty" data-id="${item.Id}" min="1" value="${quantity}">
  </label>
  <p class="cart-card__price">$${price.toFixed(2)}</p>
  <p class="cart-card__line-total">Subtotal: $${lineTotal.toFixed(2)}</p>
</li>`;
}

function calculateAndDisplayTotal(cartItems) {
  const footer = document.querySelector(".cart-footer");
  const totalElement = document.querySelector(".cart-total");

  if (!footer || !totalElement) return;

  if (!cartItems.length) {
    footer.classList.add("hide");
    totalElement.textContent = "Total: $0.00";
    return;
  }

  const total = cartItems.reduce((sum, item) => {
    const price = item.FinalPrice ?? item.price ?? 0;
    const quantity = item.quantity || 1;
    return sum + price * quantity;
  }, 0);

  footer.classList.remove("hide");
  totalElement.textContent = `Total: $${total.toFixed(2)}`;
}

function attachQtyListeners() {
  const inputs = document.querySelectorAll(".cart-qty");
  inputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      let quantity = parseInt(event.target.value);
      if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
        event.target.value = quantity;
      }

      const id = event.target.dataset.id;
      const cart = getCart();
      const item = cart.find((i) => i.Id === id);
      if (item) {
        item.quantity = quantity;
        saveCart(cart);
      }

     
      renderCartContents();
    });
  });
}

export function renderCartContents() {
  const cartItems = getCart();
  const productList = document.querySelector(".product-list");

  if (!productList) {
    return;
  }

  if (!cartItems.length) {
    productList.innerHTML = '<li><p>Tu carrito está vacío.</p></li>';
    calculateAndDisplayTotal(cartItems);
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join("");

  attachQtyListeners();
  calculateAndDisplayTotal(cartItems);
}

renderCartContents();
