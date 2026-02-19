// Trip Expense Tracker - Balance Calculation Demo
//
// This script demonstrates how the trip expense tracker calculates balances
// between participants in a group trip.

console.log("=== Trip Expense Tracker - Balance Calculation Demo ===\n");

// Sample data representing a trip with participants and expenses
const trip = {
  name: "Summer Vacation to Bali",
  participants: ["Alice", "Bob", "Charlie", "Diana"],
  expenses: [
    {
      id: 1,
      description: "Hotel Booking",
      amount: 800,
      paidBy: "Alice",
      participants: ["Alice", "Bob", "Charlie", "Diana"]
    },
    {
      id: 2,
      description: "Dinner at Restaurant",
      amount: 120,
      paidBy: "Bob",
      participants: ["Alice", "Bob", "Charlie"]
    },
    {
      id: 3,
      description: "Airport Transfer",
      amount: 60,
      paidBy: "Charlie",
      participants: ["Charlie", "Diana"]
    },
    {
      id: 4,
      description: "Souvenir Shopping",
      amount: 90,
      paidBy: "Diana",
      participants: ["Alice", "Diana"]
    }
  ]
};

console.log(`Trip: ${trip.name}`);
console.log(`Participants: ${trip.participants.join(", ")}\n`);

// Calculate balances
const balances = {};

// Initialize balances for all participants
trip.participants.forEach(participant => {
  balances[participant] = { paid: 0, owed: 0 };
});

// Process each expense
trip.expenses.forEach(expense => {
  console.log(`Expense: ${expense.description} - $${expense.amount}`);
  console.log(`  Paid by: ${expense.paidBy}`);
  console.log(`  Participants: ${expense.participants.join(", ")}`);
  
  // Calculate how much each participant should pay
  const share = expense.amount / expense.participants.length;
  
  // Update the payer's paid amount
  balances[expense.paidBy].paid += expense.amount;
  
  // Update each participant's owed amount
  expense.participants.forEach(participant => {
    balances[participant].owed += share;
  });
  
  console.log(`  Each participant pays: $${share.toFixed(2)}\n`);
});

// Calculate final balances
console.log("=== FINAL BALANCE CALCULATION ===");
console.log("Balance = Amount Paid - Amount Owed\n");

let totalPaid = 0;
let totalOwed = 0;

trip.participants.forEach(participant => {
  const balance = balances[participant].paid - balances[participant].owed;
  totalPaid += balances[participant].paid;
  totalOwed += balances[participant].owed;
  
  console.log(`${participant}:`);
  console.log(`  Paid: $${balances[participant].paid.toFixed(2)}`);
  console.log(`  Owed: $${balances[participant].owed.toFixed(2)}`);
  console.log(`  Balance: $${balance.toFixed(2)} (${balance >= 0 ? 'OWED' : 'OWES'})`);
  console.log("");
});

console.log(`=== SUMMARY ===`);
console.log(`Total Paid: $${totalPaid.toFixed(2)}`);
console.log(`Total Owed: $${totalOwed.toFixed(2)}`);
console.log(`Total Expenses: $${trip.expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}`);

console.log("\n=== HOW IT WORKS ===");
console.log("1. Each expense is split equally among participants");
console.log("2. The system tracks how much each person paid vs how much they owe");
console.log("3. Final balance shows who owes money or is owed money");
console.log("4. Positive balance = person is owed money");
console.log("5. Negative balance = person owes money");
console.log("6. Zero balance = payments and debts are balanced");