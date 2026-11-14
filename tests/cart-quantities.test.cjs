const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "../src/js/cart.js"), "utf8")
  .replace(/^import .*;\r?\n/, "");
const product = { Id: "344YJ", Name: "Rimrock", Image: "/tent.jpg",
  Colors: [{ ColorName: "Rust" }], FinalPrice: 69.99 };

function loadCart(stored) {
  let saved = stored;
  let handler;
  const list = { innerHTML: "", addEventListener: (_, fn) => { handler = fn; } };
  vm.runInNewContext(source, {
    document: { querySelector: () => list },
    getLocalStorage: () => saved && JSON.parse(JSON.stringify(saved)),
    setLocalStorage: (_, value) => { saved = JSON.parse(JSON.stringify(value)); },
  });
  return {
    list,
    saved: () => saved,
    change(value, index = 0) {
      const price = { textContent: "" };
      const input = { value, dataset: { index }, matches: () => true,
        closest: () => ({ querySelector: () => price }) };
      handler({ target: input });
      return { input, price };
    },
  };
}

test("existing items start at one and quantity updates persist across reload", () => {
  const cart = loadCart([product, { ...product, Id: "second" }]);
  assert.match(cart.list.innerHTML, /value="1"/);
  const { price } = cart.change("3");
  assert.equal(price.textContent, "$209.97");
  assert.equal(cart.saved()[0].Quantity, 3);
  assert.equal(cart.saved()[1].Quantity, 1);
  const reloaded = loadCart(cart.saved());
  assert.match(reloaded.list.innerHTML, /value="3"/);
  assert.match(reloaded.list.innerHTML, /\$209\.97/);
  assert.equal(reloaded.change("1").price.textContent, "$69.99");
});

test("invalid quantities restore the saved value without writing storage", () => {
  const cart = loadCart([{ ...product, Quantity: 2 }]);
  for (const value of ["", "0", "-1", "1.5", "abc", "9007199254740992"]) {
    assert.equal(cart.change(value).input.value, 2);
    assert.equal(cart.saved()[0].Quantity, 2);
  }
});

test("empty and legacy single-product carts render", () => {
  assert.match(loadCart(null).list.innerHTML, /Your cart is empty/);
  assert.match(loadCart([]).list.innerHTML, /Your cart is empty/);
  assert.match(loadCart(product).list.innerHTML, /Rimrock/);
});
