// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}
//  this will get the id from the query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

// build the html for each item in the list and put it inside the parent element
export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin",
  clear = false,) {
  const htmlStrings = list.map(templateFn);
  // empty the element first if clear is true
  if (clear) {
    parentElement.innerHTML = "";
  }

  
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement, null, updateCartCount);
  renderWithTemplate(footerTemplate, footerElement);
}

// show how many items are in the cart on the backpack icon
export function updateCartCount() {
  const countElement = document.querySelector(".cart-count");

  // some pages may not have the badge
  if (!countElement) {
    return;
  }

  const cartItems = getLocalStorage("so-cart");
  let count = 0;
  if (Array.isArray(cartItems)) {
    count = cartItems.reduce((total, item) => total + (item.Quantity || 1), 0);
  }

  if (count > 0) {
    countElement.textContent = count;
    countElement.classList.remove("hide");
  } else {
    // nothing in the cart, hide the badge
    countElement.classList.add("hide");
  }
}

export function alertMessage(message, scroll = true) {
  const main = document.querySelector("main");
  if (!main) {
    throw new Error("Cannot display an alert without a main element.");
  }

  main.querySelectorAll(".alert").forEach((existingAlert) => {
    existingAlert.remove();
  });

  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.setAttribute("role", "alert");
  alert.setAttribute("aria-live", "assertive");

  const alertText = document.createElement("p");
  alertText.textContent =
    typeof message === "string" ? message : JSON.stringify(message);

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.classList.add("alert__close");
  closeButton.setAttribute("aria-label", "Dismiss message");
  closeButton.textContent = "X";
  closeButton.addEventListener("click", () => alert.remove());

  alert.append(alertText, closeButton);
  main.prepend(alert);

  if (scroll) {
    window.scrollTo(0, 0);
  }
}

