# Cart quantities

Selected from the Backlog 2 column of the Sleep Outside Team 6 Trello board supplied on 14 November 2026. This task is separate from the course module activities excluded by the assignment.

## Changes

- Added a labelled number input for each cart entry, starting at one for older entries.
- Saved quantity changes to `so-cart` in local storage.
- Recalculated each entry's price as unit price multiplied by quantity, formatted to two decimal places.
- Restored the last valid quantity when a blank, zero, negative, fractional, or unsafe integer is entered.
- Kept the quantity input in place during updates to preserve keyboard focus.

## Verification

`npm run build` passed, with existing Vite warnings about the CommonJS API and an unresolved stylesheet path.

`npm run lint` passed.

`node --test tests/cart-quantities.test.cjs` passed three tests covering quantity changes, independent entries, storage persistence after reinitialization, invalid quantities, empty carts, and legacy single-product storage. These use a simulated DOM; browser and live deployment verification remain pending.

## Browser demonstration

1. Run `npm start` and open a product page.
2. Add a product to the cart and open the cart.
3. Set its quantity to 3 and move focus outside the input. A $69.99 product should show $209.97.
4. Reload the page. The quantity should remain 3.
5. Set it back to 1; its price should return to $69.99.
6. Try zero or a fractional quantity; the last valid quantity should be restored.
7. Record screenshots of the changed quantity and the reloaded page after deployment.

## Submission details

Task: Cart quantities

Source: https://github.com/keykey-create/wdd330/blob/samsonodunaiya--individual2/src/js/cart.js

Site: https://wdd330-dsjb.onrender.com/cart/

The source link requires this branch to be pushed. The site link is the supplied deployment URL; the quantity feature must be deployed and verified there before submission. Move the Trello card to Done once that verification is complete.

## Professional development reflection draft

Review these prompts and complete them in your own words after reviewing and trying the implementation. Do not assign a self-assessment rating or claim personal learning without that review.

- Divide and conquer: Explain how the work was divided into rendering quantities, responding to input changes, saving state, and recalculating prices.
- Troubleshooting: Explain why a missing Quantity property needs a default, and how you checked that existing carts still render.
- JavaScript and events: Describe how the change listener on the list handles quantity inputs and updates only the affected line price.
- JSON and local storage: Explain how the existing storage utilities serialize cart entries and restore saved quantities after reload.
- Testing: Describe the difference between the automated simulated-DOM checks and the browser demonstration you performed.

The existing skill-development document is labelled for the final personal project. Confirm the appropriate place with your course instructions before adding this team-project example there.
