
const API_URL = "https://jsonplaceholder.typicode.com/users";

const loadButton = document.getElementById("load-users");
const filterInput = document.getElementById("filter-input");
const status = document.getElementById("status");
const usersList = document.getElementById("users-list");

let users = [];

// Display any array of users in the directory.
function renderUsers(list) {
  usersList.replaceChildren();

  if (list.length === 0) {
    status.textContent = users.length === 0
      ? "No users available. Click Load Users to try again."
      : "No users match your filter.";
    return;
  }

  list.forEach((user) => {
    const listItem = document.createElement("li");

    const name = document.createElement("h2");
    name.textContent = user.name;

    const email = document.createElement("p");
    email.textContent = `Email: ${user.email}`;

    const city = document.createElement("p");
    city.textContent = `City: ${user.address.city}`;

    const company = document.createElement("p");
    company.textContent = `Company: ${user.company.name}`;

    listItem.append(name, email, city, company);
    usersList.appendChild(listItem);
  });

  status.textContent = `Showing ${list.length} user(s).`;
}

// Fetch users from the API.
async function loadUsers() {
  loadButton.disabled = true;
  status.textContent = "Loading users...";
  usersList.replaceChildren();

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    users = data;

    renderUsers(users);
  } catch (error) {
    users = [];
    usersList.replaceChildren();
    status.textContent =
      "Failed to load users. Please check your connection and try again.";

    console.error("Error loading users:", error);
  } finally {
    loadButton.disabled = false;
  }
}

// Load users when the button is clicked.
loadButton.addEventListener("click", loadUsers);

// Filter the already-loaded users without another request.
filterInput.addEventListener("input", () => {
  if (users.length === 0) {
    return;
  }

  const searchText = filterInput.value.trim().toLowerCase();

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchText)
  );

  renderUsers(filteredUsers);
});