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
  return urlParams.get(param);
}

// build the html for each item in the list and put it inside the parent element
export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin",
  clear = false,) {
  // empty the element first if clear is true
  if (clear) {
    parentElement.innerHTML = "";
  }

  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));



}

// show how many items are in the cart on the backpack icon
export function updateCartCount() {
  const countElement = qs(".cart-count");

  // some pages may not have the badge
  if (!countElement) {
    return;
  }

  const cartItems = getLocalStorage("so-cart");
  let count = 0;
  if (Array.isArray(cartItems)) {
    count = cartItems.length;
  }

  if (count > 0) {
    countElement.textContent = count;
    countElement.classList.remove("hide");
  } else {
    // nothing in the cart, hide the badge
    countElement.classList.add("hide");
  }
}


export function renderWithTemplate (template, parentElement, data, callback) {
   parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// get the html text of a file
export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

// load the header and the footer into the page
export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = qs("#main-header");
  const footerElement = qs("#main-footer");

  // the callback updates the cart number AFTER the header exists
  renderWithTemplate(headerTemplate, headerElement, null, updateCartCount);
  renderWithTemplate(footerTemplate, footerElement);
}