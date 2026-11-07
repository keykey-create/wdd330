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
    <a href="product_pages/index.html?product=${product.Id}">
      <img src="${product.Image}" alt="${product.Name}" />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
      ${discountHtml}
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement, idsToShow) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.idsToShow = idsToShow;
  }

  async init() {
    // get all the products from the json file
    const list = await this.dataSource.getData();

    // keep only the products that have a detail page
    const filteredList = list.filter((product) =>
      this.idsToShow.includes(product.Id)
    );

    this.renderList(filteredList);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}