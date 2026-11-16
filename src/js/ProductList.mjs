import { renderListWithTemplate } from "./utils.mjs";

// html for one product card
function productCardTemplate(product) {
  let discountHtml = "";

  // flag the product if it is discounted
  if (product.FinalPrice < product.SuggestedRetailPrice) {
    const difference = product.SuggestedRetailPrice - product.FinalPrice;
    const percent = Math.round((difference / product.SuggestedRetailPrice) * 100);

    discountHtml = `
      <p class="discount-flag">${percent}% OFF</p>
      <p class="original-price">Was $${product.SuggestedRetailPrice.toFixed(2)}</p>`;
  }

  return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
      <picture>
        <source media="(min-width: 700px)" srcset="${product.Images.PrimaryLarge}"/>
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}" />
      </picture>
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <p class="card__name">${product.NameWithoutBrand}</p>
      <p class="product-card__price">$${product.FinalPrice}</p>
      ${discountHtml}
    </a>
  </li>`;
}

const categoryName = {
  tents: "Tents",
  backpacks: "Backpacks",
  "sleeping-bags": "Sleeping Bags",
  hammocks: "Hammocks",
};

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    // get all the products from the json file
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
    document.querySelector(".title").textContent = categoryName[this.category] ?? this.category;
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}