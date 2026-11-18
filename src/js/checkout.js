import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const myCheckout = new CheckoutProcess("so-cart", ".order-summary");
myCheckout.init();

// when the zip code is filled, calculate tax, shipping and order total
document.querySelector("#zip").addEventListener("change", () => {
  myCheckout.calculateOrderTotal();
});

// when the form is submitted (only if all fields are valid)
const form = document.querySelector("#checkout-form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const response = await myCheckout.checkout(form);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
});
