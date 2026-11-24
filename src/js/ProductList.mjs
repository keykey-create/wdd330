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
    this.products = [];
  }

  async init() {
    document.querySelector(".title").textContent = categoryName[this.category] ?? this.category;
    const sortControl = document.querySelector("#product-sort");
    const status = document.querySelector("#sort-status");
    try {
      this.products = await this.dataSource.getData(this.category);
      this.renderList(this.products);
      if (sortControl) {
        sortControl.disabled = this.products.length === 0;
        sortControl.addEventListener("change", () => {
          this.renderList(this.sortedProducts(sortControl.value));
          if (status) {
            status.textContent = `${this.products.length} products. ${sortControl.selectedOptions[0].textContent}.`;
          }
        });
      }
      if (status) status.textContent = `${this.products.length} products.`;
      if (!this.products.length) {
        this.listElement.innerHTML = "<li>No products found in this category.</li>";
      }
    } catch {
      this.listElement.innerHTML = "<li>Unable to load products. Please refresh to try again.</li>";
      if (status) status.textContent = "Products could not be loaded.";
    }
  }

  sortedProducts(order) {
    // Sort a copy so choosing Featured restores the original server order.
    const products = [...this.products];
    const byName = (a, b) => a.Name.localeCompare(b.Name, undefined, { sensitivity: "base", numeric: true });
    const comparators = {
      "name-asc": byName,
      "name-desc": (a, b) => byName(b, a),
      "price-asc": (a, b) => Number(a.FinalPrice) - Number(b.FinalPrice) || byName(a, b),
      "price-desc": (a, b) => Number(b.FinalPrice) - Number(a.FinalPrice) || byName(a, b),
    };
    return comparators[order] ? products.sort(comparators[order]) : products;
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
  }
}
