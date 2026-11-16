import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

const category = getParam("category");
const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");

// only the tents that have a detail page
//const idsToShow = ["880RR", "985RF", "985PR", "344YJ"];

const myList = new ProductList(category, dataSource, listElement);
myList.init();

loadHeaderFooter();
