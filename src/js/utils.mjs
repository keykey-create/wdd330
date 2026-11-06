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
export function renderListWithTemplate(templateFn, parentElement, list) {
  const htmlStrings = list.map(templateFn);
  parentElement.innerHTML = htmlStrings.join("");
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