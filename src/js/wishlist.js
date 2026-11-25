import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
  alertMessage,
} from "./utils.mjs";

loadHeaderFooter();

function renderWishlist() {
  const wishlist = getLocalStorage("so-wishlist") || [];
  const listElement = document.querySelector(".wishlist-list");

  if (wishlist.length === 0) {
    listElement.innerHTML = "<p>Your wishlist is currently empty.</p>";
    return;
  }

  listElement.innerHTML = wishlist
    .map((item) => wishlistItemTemplate(item))
    .join("");
  attachEventListeners();
}

function wishlistItemTemplate(item) {
  return `<li class="wishlist-card divider">
    <a href="/product_pages/index.html?product=${item.Id}" class="wishlist-card__image">
      <img src="${item.Images.PrimaryMedium}" alt="${item.Name}" />
    </a>
    <a href="/product_pages/index.html?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="wishlist-card__color">${item.Colors[0].ColorName}</p>
    <p class="wishlist-card__price">$${item.FinalPrice}</p>
    <div class="wishlist-card__actions">
      <button class="move-to-cart" data-id="${item.Id}">Move to Cart</button>
      <button class="remove-wishlist" data-id="${item.Id}">Remove</button>
    </div>
  </li>`;
}

function attachEventListeners() {
  document.querySelectorAll(".remove-wishlist").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      let wishlist = getLocalStorage("so-wishlist") || [];
      wishlist = wishlist.filter((item) => item.Id !== id);
      setLocalStorage("so-wishlist", wishlist);
      renderWishlist();
    });
  });

  document.querySelectorAll(".move-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      let wishlist = getLocalStorage("so-wishlist") || [];
      const itemToMove = wishlist.find((item) => item.Id === id);

      if (itemToMove) {
        // Add to cart
        let cart = getLocalStorage("so-cart") || [];
        cart.push(itemToMove);
        setLocalStorage("so-cart", cart);

        // Remove from wishlist
        wishlist = wishlist.filter((item) => item.Id !== id);
        setLocalStorage("so-wishlist", wishlist);

        renderWishlist();
        alertMessage(`${itemToMove.NameWithoutBrand} moved to cart!`);
      }
    });
  });
}

renderWishlist();
