import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

const category = getParam("category") || "tents";
const dataSource = new ExternalServices();
const listElement = document.querySelector(".product-list");

const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
if (categories.includes(category)) {
  const myList = new ProductList(category, dataSource, listElement);
  myList.init();
} else {
  document.querySelector(".title").textContent = "Unknown category";
  listElement.innerHTML =
    "<li>Please choose a category from the home page.</li>";
}

loadHeaderFooter();
