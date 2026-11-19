const userList = document.querySelector("#users");
const statusMessage = document.querySelector("#status");

async function loadUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const users = await response.json();
    const items = users.map((user) => {
      const item = document.createElement("li");
      item.textContent = `${user.name} — ${user.email}`;
      return item;
    });

    userList.replaceChildren(...items);
    statusMessage.textContent = users.length ? "" : "No users found.";
  } catch (error) {
    statusMessage.textContent =
      "Unable to load users. Please refresh the page to try again.";
  }
}

loadUsers();
