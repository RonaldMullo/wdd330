import Alert from "./Alert.js";

const featuredIds = ["880RR", "985RF", "985PR", "344YJ"];

const detailPages = {
  "880RR": "product_pages/marmot-ajax-3.html",
  "985RF": "product_pages/northface-talus-4.html",
  "985PR": "product_pages/northface-alpine-3.html",
  "344YJ": "product_pages/cedar-ridge-rimrock-2.html"
};

function productCardTemplate(product) {
  const imageUrl = product.Image.replace("..", "");
  const price = product.FinalPrice ?? product.price ?? 0;
  const link = detailPages[product.Id] || "#";

  return `
  <li class="product-card">
    <a href="${link}">
      <img
        src="${imageUrl}"
        alt="${product.Name}"
        class="product-card__image"
      />
      <h3 class="card__brand">${product.Brand || ""}</h3>
      <h2 class="card__name">${product.NameWithoutBrand || product.Name}</h2>
      <p class="product-card__price">$${price.toFixed(2)}</p>
    </a>
  </li>`;
}

async function loadFeaturedProducts() {
  const list = document.querySelector(".product-list");
  if (!list) return;

  try {
    const response = await fetch("/json/tents.json");
    if (!response.ok) throw new Error("Error loading tents.json");
    const tents = await response.json();
    const products = tents.filter((item) => featuredIds.includes(item.Id));

    list.innerHTML = products.map(productCardTemplate).join("");
  } catch (error) {
    console.error(error);
    list.innerHTML = "<li><p>Unable to load products.</p></li>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadFeaturedProducts();

  const alerts = new Alert("main", "/json/alerts.json");
  alerts.init();
});
