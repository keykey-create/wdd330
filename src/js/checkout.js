import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const myCheckout = new CheckoutProcess("so-cart", ".order-summary");
myCheckout.init();

// when the zip code is filled, calculate tax, shipping and order total
document.querySelector("#zip").addEventListener("input", (event) => {
  if (event.target.checkValidity()) myCheckout.calculateOrderTotal();
});

// when the form is submitted (only if all fields are valid)
const form = document.querySelector("#checkout-form");
const submitButton = form.querySelector("button[type=submit]");
const status = document.querySelector("#checkout-status");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity() || submitButton.disabled) return;
  if (myCheckout.itemCount === 0) {
    status.textContent = "Add items to your cart before checking out.";
    return;
  }

  submitButton.disabled = true;
  status.textContent = "Submitting your order…";
  try {
    await myCheckout.checkout(form);
    status.textContent = "Your order was submitted successfully.";
  } catch (error) {
    status.textContent = `Unable to submit your order. ${error.message}`;
  } finally {
    submitButton.disabled = false;
  }
});
