// Trip Expense Tracker - API Endpoints Demo
//
// This script demonstrates the key API endpoints of the application

console.log("=== Trip Expense Tracker - API Endpoints Demo ===\n");

const apiEndpoints = [
  {
    method: "POST",
    path: "/api/users/register",
    description: "Register a new user",
    example: {
      username: "john_doe",
      email: "john@example.com",
      password: "securepassword123"
    }
  },
  {
    method: "POST",
    path: "/api/users/login",
    description: "Login user",
    example: {
      email: "john@example.com",
      password: "securepassword123"
    }
  },
  {
    method: "GET",
    path: "/api/users/profile",
    description: "Get user profile (protected)",
    auth_required: true
  },
  {
    method: "POST",
    path: "/api/trips",
    description: "Create a new trip (protected)",
    auth_required: true,
    example: {
      name: "Summer Vacation",
      description: "Trip to Bali with friends",
      startDate: "2023-07-01",
      endDate: "2023-07-15"
    }
  },
  {
    method: "GET",
    path: "/api/trips",
    description: "Get all trips for the user (protected)",
    auth_required: true
  },
  {
    method: "GET",
    path: "/api/trips/:id",
    description: "Get trip by ID (protected)",
    auth_required: true
  },
  {
    method: "DELETE",
    path: "/api/trips/:id",
    description: "Delete a trip (protected)",
    auth_required: true
  },
  {
    method: "POST",
    path: "/api/trips/:id/members",
    description: "Add member to trip (protected)",
    auth_required: true,
    example: {
      userId: "user123"
    }
  },
  {
    method: "POST",
    path: "/api/expenses",
    description: "Add a new expense (protected)",
    auth_required: true,
    example: {
      tripId: "trip123",
      description: "Dinner at restaurant",
      amount: 120,
      paidBy: "user123",
      participants: ["user123", "user456", "user789"]
    }
  },
  {
    method: "GET",
    path: "/api/expenses/trip/:tripId",
    description: "Get expenses for a trip (protected)",
    auth_required: true
  },
  {
    method: "DELETE",
    path: "/api/expenses/:id",
    description: "Delete an expense (protected)",
    auth_required: true
  }
];

console.log("Key API Endpoints:");
console.log("==================");

apiEndpoints.forEach((endpoint, index) => {
  console.log(`${index + 1}. ${endpoint.method} ${endpoint.path}`);
  console.log(`   Description: ${endpoint.description}`);
  
  if (endpoint.auth_required) {
    console.log("   ⚠️  Authentication required");
  }
  
  if (endpoint.example) {
    console.log("   Example:");
    Object.keys(endpoint.example).forEach(key => {
      console.log(`     ${key}: ${JSON.stringify(endpoint.example[key])}`);
    });
  }
  console.log("");
});

console.log("=== APPLICATION FLOW ===");
console.log("1. User registers/login → JWT token received");
console.log("2. User creates trips → Trip data stored in DB");
console.log("3. User adds members to trips → Trip membership managed");
console.log("4. User logs expenses → Expense data stored with participants");
console.log("5. System automatically calculates balances → Shows who owes what");
console.log("6. Users can view trip details and balances");
console.log("");

console.log("=== SECURITY FEATURES ===");
console.log("• Password hashing with bcryptjs");
console.log("• JWT token authentication");
console.log("• Protected API routes");
console.log("• Input validation");
console.log("• CORS protection");
console.log("• Environment variables for sensitive data");