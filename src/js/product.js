// import { setLocalStorage, getLocalStorage, getParam } from "./utils.mjs";
// import ProductData from "./ProductData.mjs";

// const dataSource = new ProductData("tents");
// const productId = getParam("product");
// console.log(dataSource.findProductById(productId));

// function addProductToCart(product) {
//   let itemList = getLocalStorage("so-cart");
//   if (!Array.isArray(itemList)) {
//     itemList = [];
//   }
//   itemList.push(product);
//   setLocalStorage("so-cart", itemList);
// }
// // add to cart button event handler
// async function addToCartHandler(e) {
//   const product = await dataSource.findProductById(e.target.dataset.id);
//   addProductToCart(product);
// }

// // add listener to Add to Cart button
// document
//   .getElementById("addToCart")
//   .addEventListener("click", addToCartHandler);

import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");

const product = new ProductDetails(productId, dataSource);
product.init();