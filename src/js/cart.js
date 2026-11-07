import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

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

function renderCartTotal(cartItems) {
  let total = 0;

  // add up the price of each item
  for (const item of cartItems) {
    total = total + item.FinalPrice;
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
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
updateCartCount();
