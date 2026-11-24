import test from "node:test";
import assert from "node:assert/strict";
import ProductList from "../js/ProductList.mjs";

const products = [
  { Id: "z", Name: "Zulu Tent", FinalPrice: "100.00" },
  { Id: "b", Name: "beta Tent", FinalPrice: 9 },
  { Id: "a", Name: "Alpha Tent", FinalPrice: 9 },
];
const ids = (list) => list.map((product) => product.Id);

test("name sorting ignores case and supports both directions", () => {
  const list = new ProductList("tents", {}, {});
  list.products = products;
  assert.deepEqual(ids(list.sortedProducts("name-asc")), ["a", "b", "z"]);
  assert.deepEqual(ids(list.sortedProducts("name-desc")), ["z", "b", "a"]);
});

test("price sorting is numeric and equal prices have consistent name ordering", () => {
  const list = new ProductList("tents", {}, {});
  list.products = products;
  assert.deepEqual(ids(list.sortedProducts("price-asc")), ["a", "b", "z"]);
  assert.deepEqual(ids(list.sortedProducts("price-desc")), ["z", "a", "b"]);
  assert.deepEqual(ids(list.sortedProducts("featured")), ["z", "b", "a"]);
  assert.deepEqual(ids(products), ["z", "b", "a"]);
});

test("changing the selector replaces cards without refetching or duplicating them", async () => {
  let listener;
  let fetchCount = 0;
  const status = {};
  const control = {
    disabled: true,
    value: "price-asc",
    selectedOptions: [{ textContent: "Price: low to high" }],
    addEventListener: (event, callback) => { listener = callback; },
  };
  globalThis.document = { querySelector: (selector) => ({ ".title": {}, "#product-sort": control, "#sort-status": status })[selector] };
  const element = {
    innerHTML: "",
    insertAdjacentHTML(position, html) { this.innerHTML += html; },
  };
  const data = products.map((product) => ({ ...product, NameWithoutBrand: product.Name, Brand: { Name: "Brand" }, Images: { PrimaryMedium: "image.jpg", PrimaryLarge: "image.jpg" } }));
  const list = new ProductList("tents", { getData: async () => { fetchCount++; return data; } }, element);
  await list.init();
  assert.equal(control.disabled, false);
  listener();
  assert.equal((element.innerHTML.match(/class="product-card"/g) || []).length, 3);
  assert.ok(element.innerHTML.indexOf("product=a") < element.innerHTML.indexOf("product=z"));
  control.value = "featured";
  listener();
  assert.equal(fetchCount, 1);
  assert.ok(element.innerHTML.indexOf("product=z") < element.innerHTML.indexOf("product=a"));
  assert.equal((element.innerHTML.match(/class="product-card"/g) || []).length, 3);
  delete globalThis.document;
});

test("empty and failed categories keep sorting disabled with useful feedback", async () => {
  const control = { disabled: true, addEventListener() {} };
  const status = {};
  globalThis.document = { querySelector: (selector) => ({ ".title": {}, "#product-sort": control, "#sort-status": status })[selector] };
  const element = { innerHTML: "", insertAdjacentHTML() {} };
  await new ProductList("tents", { getData: async () => [] }, element).init();
  assert.equal(control.disabled, true);
  assert.match(element.innerHTML, /No products/);
  await new ProductList("tents", { getData: async () => { throw new Error("offline"); } }, element).init();
  assert.equal(control.disabled, true);
  assert.match(status.textContent, /could not be loaded/);
  delete globalThis.document;
});
