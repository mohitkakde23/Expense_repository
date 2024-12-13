// Select DOM Elements
const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const comment = document.getElementById("comment");

// Retrieve Transactions from Local Storage
const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));
let transactions = localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Add Transaction
function addTransaction(e) {
  e.preventDefault();

  // Input Validation
  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add both text and amount");
    return;
  }

  const now = new Date();
  const transaction = {
    id: generateID(),
    text: text.value,
    comment: comment.value || "N/A", // Optional comment
    amount: +amount.value, // Convert to number
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };

  transactions.push(transaction);

  // Update UI and Storage
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();

  // Clear Inputs
  text.value = "";
  amount.value = "";
  comment.value = "";
}

// Generate Unique ID
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

// Add Transaction to DOM
function addTransactionDOM(transaction) {
  // Determine Sign
  const sign = transaction.amount < 0 ? "-" : "+";

  // Create List Item
  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  // Set Inner HTML
  item.innerHTML = `
    ${transaction.text} 
    <span>${sign}&#8377;${Math.abs(transaction.amount)}</span>
    <span class="created-at">Created: ${new Date(transaction.created_at).toLocaleString()}</span>
    <span class="updated-at">Updated: ${new Date(transaction.updated_at).toLocaleString()}</span>
    <span class="comment">(Comment: ${transaction.comment})</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">Delete</button>
    <button class="edit-btn" onclick="editTransaction(${transaction.id})">Edit</button>
  `;

  list.appendChild(item);
}

// Update Balance, Income, and Expense
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);

  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter((item) => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (amounts.filter((item) => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

  balance.innerHTML = `&#8377;${total}`;
  money_plus.innerHTML = `+&#8377;${income}`;
  money_minus.innerHTML = `-&#8377;${expense}`;
}

// Remove Transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  Init();
}

// Edit Transaction
function editTransaction(id) {
  const transactionToEdit = transactions.find((transaction) => transaction.id === id);

  if (transactionToEdit) {
    text.value = transactionToEdit.text;
    amount.value = transactionToEdit.amount;
    comment.value = transactionToEdit.comment || "";
    removeTransaction(id); // Remove old entry so it can be updated
  }
}

// Update Local Storage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialize App
function Init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// Update `updated_at` on Edit Submission
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const now = new Date();
  const editedTransaction = transactions.find(
    (transaction) => transaction.id === +text.dataset.editId
  );

  if (editedTransaction) {
    editedTransaction.text = text.value;
    editedTransaction.amount = +amount.value;
    editedTransaction.comment = comment.value || "N/A";
    editedTransaction.updated_at = now.toISOString();
    updateLocalStorage();
    Init();
    text.removeAttribute("data-edit-id");
    text.value = "";
    amount.value = "";
    comment.value = "";
  } else {
    addTransaction(e);
  }
});

// Initialize
Init();
