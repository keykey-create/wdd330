import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { updateCartCount } from "./utils.mjs";
import Alert from "./Alert.js";

const dataSource = new ProductData("tents");
const listElement = document.querySelector(".product-list");

// only the tents that have a detail page
const idsToShow = ["880RR", "985RF", "985PR", "344YJ"];

const myList = new ProductList("tents", dataSource, listElement, idsToShow);
myList.init();

const alert = new Alert();
alert.init();

updateCartCount();