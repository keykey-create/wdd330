const items = document.querySelectorAll("#items li");
const details = document.querySelector("#details");

items.forEach((item) => {
  // Console output is required by this learning activity.
  /* eslint-disable no-console */
  console.log("Name:", item.dataset.name);
  console.log("Category:", item.dataset.category);
  console.log("Color:", item.dataset.color);
  /* eslint-enable no-console */

  item.addEventListener("click", () => {
    items.forEach((entry) => {
      entry
        .querySelector("button")
        .setAttribute("aria-pressed", String(entry === item));
    });

    const heading = document.createElement("h2");
    heading.textContent = "Item details";
    const fields = ["name", "category", "color"].map((field) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = `${field[0].toUpperCase()}${field.slice(1)}: ${item.dataset[field]}`;
      return paragraph;
    });
    // Treat attribute values as text, rather than interpreting them as HTML.
    details.replaceChildren(heading, ...fields);
  });
});
