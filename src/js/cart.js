import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const listElement = document.querySelector(".product-list");
const storedCart = getLocalStorage("so-cart");
const cartItems = Array.isArray(storedCart)
  ? storedCart
  : storedCart ? [storedCart] : [];

cartItems.forEach((item) => {
  item.Quantity = Number.isSafeInteger(item.Quantity) && item.Quantity > 0
    ? item.Quantity : 1;
});

function renderCartContents() {
  const htmlItems = cartItems.map((item, index) => cartItemTemplate(item, index));
  listElement.innerHTML = htmlItems.join("") || "<li>Your cart is empty.</li>";
}

function cartItemTemplate(item, index) {
  const newItem = `<li class="cart-card divider">
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
  <label class="cart-card__quantity" for="quantity-${index}">Quantity
    <input id="quantity-${index}" data-index="${index}" type="number"
      min="1" step="1" value="${item.Quantity}">
  </label>
  <p class="cart-card__price" aria-live="polite">$${(item.FinalPrice * item.Quantity).toFixed(2)}</p>
</li>`;

  return newItem;
}

listElement.addEventListener("change", (event) => {
  const input = event.target;
  if (!input.matches("input[data-index]")) return;
  const item = cartItems[Number(input.dataset.index)];
  if (!item) return;
  const quantity = Number(input.value);
  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    input.value = item.Quantity;
    return;
  }
  item.Quantity = quantity;
  setLocalStorage("so-cart", cartItems);
  input.closest(".cart-card").querySelector(".cart-card__price").textContent =
    `$${(item.FinalPrice * quantity).toFixed(2)}`;
});

renderCartContents();
