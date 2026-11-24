import {
  getLocalStorage,
  setLocalStorage,
  updateCartCount,
  loadHeaderFooter,
  normalizeQuantity,
} from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  // if nothing is saved yet, use an empty list
  const cartItems = getLocalStorage("so-cart") || [];
  const footer = document.querySelector(".cart-footer");

  // show a message if the cart is empty and hide the total
  if (cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML =
      "<li>Your cart is empty.</li>";
    footer.classList.add("hide");
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // the cart has items, so show the total
  renderCartTotal(cartItems);

  // add a click listener to each X
  const removeButtons = document.querySelectorAll(".cart-card__remove");
  removeButtons.forEach((button) => {
    button.addEventListener("click", removeFromCart);
  });

  // allow the desired quantity to be changed for each cart item
  const quantityInputs = document.querySelectorAll(
    ".cart-card__quantity-input",
  );
  quantityInputs.forEach((input) => {
    input.addEventListener("change", changeCartQuantity);
  });
}

function removeFromCart(event) {
  // the id was saved in the data-id of the X that was clicked
  const id = event.target.dataset.id;

  const cartItems = getLocalStorage("so-cart") || [];

  // find the position of the first item with that id
  const index = cartItems.findIndex((item) => item.Id === id);

  // remove only that one item
  if (index !== -1) {
    cartItems.splice(index, 1);
  }

  // save the new cart and draw everything again
  setLocalStorage("so-cart", cartItems);
  renderCartContents();
  updateCartCount();
}

function changeCartQuantity(event) {
  const input = event.currentTarget;
  const id = input.dataset.id;
  const cartItems = getLocalStorage("so-cart") || [];
  const quantity = normalizeQuantity(input.value);
  const matchingItems = cartItems.filter((cartItem) => cartItem.Id === id);

  if (matchingItems.length === 0) {
    return;
  }

  matchingItems.forEach((item) => {
    item.Quantity = quantity;
  });

  setLocalStorage("so-cart", cartItems);
  renderCartContents();
  updateCartCount();
}

function renderCartTotal(cartItems) {
  let total = 0;

  // add up the price of each item
  for (const item of cartItems) {
    total = total + item.FinalPrice * normalizeQuantity(item.Quantity);
  }

  // show the footer and write the total inside it
  document.querySelector(".cart-footer").classList.remove("hide");
  document.querySelector(".cart-total").innerHTML =
    `Total: $${total.toFixed(2)}`;
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <span class="cart-card__remove" data-id="${item.Id}">X</span>
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimaryMedium}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "No color specified"}</p>
  <p class="cart-card__quantity">
    qty:
    <input
      class="cart-card__quantity-input"
      type="number"
      min="1"
      step="1"
      value="${normalizeQuantity(item.Quantity)}"
      data-id="${item.Id}"
      aria-label="Quantity for ${item.Name}"
    />
  </p>
  <p class="cart-card__price">$${(item.FinalPrice * normalizeQuantity(item.Quantity)).toFixed(2)}</p>
</li>`;

  return newItem;
}

renderCartContents();
updateCartCount();
