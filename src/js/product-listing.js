import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const search = getParam("search");
const category = getParam("category") || "tents";

const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");
const title = document.querySelector(".products h2");
const myList = new ProductList(category, dataSource, listElement);

if (search) {
  // we came from the search box
  title.textContent = `Search results for: ${search}`;
  myList.initSearch(search.trim());
} else {
  // we came from a category link: "sleeping-bags" -> "Sleeping Bags"
  const words = category.split("-");
  let categoryName = "";
  for (const word of words) {
    categoryName += word.charAt(0).toUpperCase() + word.slice(1) + " ";
  }
  title.textContent = `Top Products: ${categoryName.trim()}`;
  myList.init();
}
