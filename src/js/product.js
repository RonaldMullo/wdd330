import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");
const CART_KEY = "so-cart";

function getCart() {
  return getLocalStorage(CART_KEY) || [];
}

function saveCart(cart) {
  setLocalStorage(CART_KEY, cart);
}

function addProductToCart(product) {
  const cart = getCart();

  
  const existing = cart.find((item) => item.Id === product.Id);

  if (existing) {
    const currentQty = existing.quantity || 1;
    existing.quantity = currentQty + 1;
  } else {
    const newItem = { ...product, quantity: 1 };
    cart.push(newItem);
  }

  saveCart(cart);
}


async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}


const addToCartButton = document.getElementById("addToCart");
if (addToCartButton) {
  addToCartButton.addEventListener("click", addToCartHandler);
}
