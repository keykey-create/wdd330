# W05 Learning Activity: Dataset

Run `npm start` from the repository root, then open
`http://localhost:5173/exercises/week05-dataset/datasets.html` (use the port Vite reports).
You can also open `datasets.html` directly in a modern browser.

## Completed activity

- `datasets.html` contains Banana, Carrot, and Blueberry in `ul#items`, each with `data-name`, `data-category`, and `data-color` attributes.
- `datasets.js` selects all list items with `document.querySelectorAll`, loops through them, and logs the three values through `dataset`.
- Clicking an item displays its dataset values below the list. Native buttons also support Tab navigation and Enter/Space activation. The selected button exposes its state through `aria-pressed`, and the details region announces updates.
- `datasets.css` styles categories using attribute selectors: fruit is light yellow, vegetables are light green, and dairy is light blue (provided for future dairy items).

## Questions to consider

### What are the advantages of using data-* attributes in HTML?

They keep small pieces of element-specific metadata beside the element, without overloading classes or IDs. JavaScript reads and updates them through `dataset`, and CSS can select them. Hyphenated names become camelCase: `data-user-id` maps to `dataset.userId`. Dataset values are strings.

### How can data-* attributes enhance accessibility?

They can supply information that JavaScript uses to update visible text or accessible state. They do not provide accessibility semantics by themselves. Use native controls, visible labels, appropriate ARIA attributes, and live regions to expose interactions and changes to assistive technology, as this example does.

### When would you prefer data-* attributes over other methods?

Use them for small public values associated with an element, such as a product ID, category, or filter key. Use classes for styling hooks and IDs for unique references. Keep complex application state and large datasets in JavaScript or a data store.

### How can you ensure the data is valid and secure?

Treat attributes as untrusted strings: check required fields, allow only expected categories, and explicitly parse and validate numeric values before using them. Validate data again on the server when it affects a trusted operation. Never store secrets in HTML attributes; users can inspect and change them. Render values with `textContent` instead of inserting them as HTML, as this activity does.

## Manual verification

1. Open the browser console and reload: each item logs its name, category, and color (nine log messages).
2. Click each item: its three values appear below the list and its button becomes selected.
3. Tab through the buttons and activate each with Enter or Space: the same details appear and keyboard focus remains visible.
4. Check the category backgrounds and view the page at a narrow mobile width.
