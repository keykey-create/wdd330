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

// Render one HTML template and optionally initialize its dynamic behavior.
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Unable to load ${path}: ${response.status}`);
  }
  return response.text();
}

export async function loadHeaderFooter() {
  const sections = [
    ["#main-header", "/partials/header.html"],
    ["#main-footer", "/partials/footer.html"],
  ];

  await Promise.all(
    sections.map(async ([selector, path]) => {
      const element = qs(selector);
      if (!element) return;
      try {
        const template = await loadTemplate(path);
        renderWithTemplate(template, element);
      } catch (error) {
        element.textContent =
          "Unable to load this section. Please refresh the page.";
      }
    }),
  );
}
