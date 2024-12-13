// Select Elements
const historyTableBody = document.getElementById("historyTable").querySelector("tbody");
const addTransitionForm = document.getElementById("addTransitionForm");
const transitionNameInput = document.getElementById("transitionName");
const commentsInput = document.getElementById("comments");

// Get Transactions from Local Storage
const localStorageHistory = JSON.parse(localStorage.getItem("history"));
let history = localStorage.getItem("history") !== null ? localStorageHistory : [];

// Add New Transition
function addNewTransition(e) {
  e.preventDefault();

  // Validate Inputs
  if (transitionNameInput.value.trim() === "") {
    alert("Transition Name is required.");
    return;
  }

  // Create New Transition Object
  const newTransition = {
    id: generateID(),
    name: transitionNameInput.value.trim(),
    comments: commentsInput.value.trim() || null,
    createdAt: new Date().toLocaleString(),
    updatedAt: new Date().toLocaleString(),
  };

  history.push(newTransition);

  // Update DOM and Local Storage
  addTransitionToDOM(newTransition);
  updateLocalStorage();

  // Reset Form
  addTransitionForm.reset();
}

// Generate Unique ID
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

// Add Transition to DOM
function addTransitionToDOM(transition) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${transition.name}</td>
    <td>${transition.comments || "N/A"}</td>
    <td>${transition.createdAt}</td>
    <td>${transition.updatedAt}</td>
    <td>
      <button class="delete-btn" onclick="removeTransition(${transition.id})">Delete</button>
      <button class="edit-btn" onclick="editTransition(${transition.id})">Edit</button>
    </td>
  `;

  historyTableBody.appendChild(row);
}

// Update the History Table
function updateHistoryTable() {
  historyTableBody.innerHTML = ""; // Clear the table
  history.forEach(addTransitionToDOM); // Add all transitions to the table
}

// Remove Transition by ID
function removeTransition(id) {
  history = history.filter((transition) => transition.id !== id);
  updateLocalStorage();
  updateHistoryTable();
}

// Edit Transition
function editTransition(id) {
  const transition = history.find((item) => item.id === id);

  if (transition) {
    transitionNameInput.value = transition.name;
    commentsInput.value = transition.comments || "";
    removeTransition(id); // Remove old entry
  }
}

// Update Local Storage
function updateLocalStorage() {
  localStorage.setItem("history", JSON.stringify(history));
}

// Initialize App
function initApp() {
  updateHistoryTable();
}

// Event Listeners
addTransitionForm.addEventListener("submit", addNewTransition);

// Initialize the App
initApp();
