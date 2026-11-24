import { alertMessage, getLocalStorage, normalizeQuantity } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

// takes the items of the cart and returns them in the simple form the server wants
function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: normalizeQuantity(item.Quantity),
  }));
}

// converts the form fields into an object: { fname: "John", lname: "Doe", ... }
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemCount = 0;
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    // add up price x quantity of every item, and count the items
    this.itemCount = 0;
    this.itemTotal = 0;
    for (const item of this.list) {
      const quantity = normalizeQuantity(item.Quantity);
      this.itemCount = this.itemCount + quantity;
      this.itemTotal = this.itemTotal + item.FinalPrice * quantity;
    }

    // show them in the order summary
    const count = document.querySelector(`${this.outputSelector} #item-count`);
    const subtotal = document.querySelector(`${this.outputSelector} #subtotal`);
    count.innerText = this.itemCount;
    subtotal.innerText = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    // tax: 6% of the subtotal, rounded to cents
    this.tax = Math.round(this.itemTotal * 0.06 * 100) / 100;

    // shipping: $10 for the first item plus $2 for each additional item
    if (this.itemCount > 0) {
      this.shipping = 10 + (this.itemCount - 1) * 2;
    } else {
      this.shipping = 0;
    }

    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(`${this.outputSelector} #order-total`);

    tax.innerText = `$${this.tax.toFixed(2)}`;
    shipping.innerText = `$${this.shipping.toFixed(2)}`;
    orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    try {
      // calculate again, in case the zip code was never "changed" (example: autofill)
      this.calculateOrderTotal();

      // the form data becomes the order object
      const order = formDataToJSON(form);

      // add the rest of the information the server needs
      order.orderDate = new Date().toISOString();
      order.orderTotal = this.orderTotal.toFixed(2);
      order.tax = this.tax.toFixed(2);
      order.shipping = this.shipping;
      order.items = packageItems(this.list);

      // send the order and return whether the request succeeded
      await services.checkout(order);
      return true;
    } catch (error) {
      const details =
        error && error.message !== undefined ? error.message : error;
      const message =
        typeof details === "string" ? details : JSON.stringify(details);
      alertMessage(
        message || "We could not place your order. Please try again.",
      );
      return false;
    }
  }
}