// import { setLocalStorage, getLocalStorage, getParam } from "./utils.mjs";
// import ExternalServices from "./ExternalServices.mjs";
// // import { getLocalStorage, setLocalStorage } from "./utils.mjs";
// const dataSource = new ExternalServices("tents");

// function addProductToCart(product) {
//   const storedCart = getLocalStorage("so-cart");
//   const cart = Array.isArray(storedCart)
//     ? storedCart
//     : storedCart
//       ? [storedCart]
//       : [];

//   cart.push(product);
//   setLocalStorage("so-cart", cart);
// }

// // function addProductToCart(product) {
// // setLocalStorage("so-cart", product);
// // }

// // add to cart button event handler
// async function addToCartHandler(e) {
//   const product = await dataSource.findProductById(e.target.dataset.id);
//   addProductToCart(product);
// }

// // add listener to Add to Cart button
// document
//   .getElementById("addToCart")
//   .addEventListener("click", addToCartHandler);

// I commented out the old code in case we need it , but this is the refactored code
import { getParam, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ExternalServices("tents");
const productID = getParam("product");

const product = new ProductDetails(productID, dataSource);
product.init();

loadHeaderFooter();
