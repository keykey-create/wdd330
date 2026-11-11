import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

export default class ProductDetails {

  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
  }


  addProductToCart() {
    let cartItems = getLocalStorage("so-cart");
    if (!Array.isArray(cartItems)) {
      cartItems = [];
    }
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);

    // refresh the number on the backpack icon
    updateCartCount();
  }

  renderProductDetails() {
    const section = document.querySelector(".product-detail");

    // check if the product is discounted
    let discountHtml = "";
    if (this.product.FinalPrice < this.product.SuggestedRetailPrice) {
      const difference = this.product.SuggestedRetailPrice - this.product.FinalPrice;
      const percent = Math.round((difference / this.product.SuggestedRetailPrice) * 100);

      discountHtml = `
        <p class="discount-flag">${percent}% OFF</p>
        <p class="original-price">Was $${this.product.SuggestedRetailPrice.toFixed(2)}</p>`;
    }

    section.innerHTML = `
      <h3>${this.product.Brand.Name}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand}</h2>
      <picture>
        <source media="(min-width: 900px)" srcset="${this.product.Images.PrimaryExtraLarge}" />
        <source media="(min-width: 500px)" srcset="${this.product.Images.PrimaryLarge}" />
        <img
          class="divider"
          src="${this.product.Images.PrimaryMedium}"
          alt="${this.product.Name}"
        />
      </picture>
      <p class="product-card__price">$${this.product.FinalPrice}</p>
      ${discountHtml}
      <p class="product__color">${this.product.Colors[0].ColorName}</p>
      <p class="product__description">${this.product.DescriptionHtmlSimple}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
      </div>
    `;

    document.title = `Sleep Outside | ${this.product.Name}`;
  }
}