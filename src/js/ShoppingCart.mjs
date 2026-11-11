import {
  getLocalStorage,
  setLocalStorage,
  renderListWithTemplate,
  updateCartCount,
} from "./utils.mjs";

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
  <span class="cart-card__remove" data-id="${item.Id}">X</span>
  <a href="#" class="cart-card__image">
    <picture>
      <source media="(min-width: 700px)" srcset="${item.Images.PrimaryMedium}" />
      <img src="${item.Images.PrimarySmall}" alt="${item.Name}" />
    </picture>
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;
}

export default class ShoppingCart {
  constructor(key, listElement) {
    this.key = key;
    this.listElement = listElement;
  }

  init() {
    this.renderCart();
  }

  renderCart() {
    const cartItems = getLocalStorage(this.key) || [];
    const footer = document.querySelector(".cart-footer");

    // show a message if the cart is empty and hide the total
    if (cartItems.length === 0) {
      this.listElement.innerHTML = "<li>Your cart is empty.</li>";
      footer.classList.add("hide");
      return;
    }

    // clear = true, so the list is drawn again from zero
    renderListWithTemplate(cartItemTemplate, this.listElement, cartItems, "afterbegin", true);
    this.renderCartTotal(cartItems);

    // add a click listener to each X
    const removeButtons = document.querySelectorAll(".cart-card__remove");
    removeButtons.forEach((button) => {
      button.addEventListener("click", this.removeFromCart.bind(this));
    });
  }

  removeFromCart(event) {
    const id = event.target.dataset.id;
    const cartItems = getLocalStorage(this.key) || [];

    // remove only the first item with that id
    const index = cartItems.findIndex((item) => item.Id === id);
    if (index !== -1) {
      cartItems.splice(index, 1);
    }

    setLocalStorage(this.key, cartItems);
    this.renderCart();
    updateCartCount();
  }

  renderCartTotal(cartItems) {
    let total = 0;
    for (const item of cartItems) {
      total = total + item.FinalPrice;
    }

    document.querySelector(".cart-footer").classList.remove("hide");
    document.querySelector(".cart-total").innerHTML = `Total: $${total.toFixed(2)}`;
  }
}