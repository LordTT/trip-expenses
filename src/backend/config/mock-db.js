// Mock database connection for demonstration purposes
// This simulates the MongoDB connection without requiring actual MongoDB

const mockDB = {
  // In-memory storage for users, trips, and expenses
  users: [],
  trips: [],
  expenses: [],
  
  // Simulate database connection
  connect: async () => {
    console.log('Mock MongoDB Connected: Simulated connection');
    return { connection: { host: 'mock-db' } };
  },
  
  // Simulate database operations
  collection: (name) => {
    return {
      findOne: async (query) => {
        if (name === 'users') {
          return mockDB.users.find(user => 
            (query.email && user.email === query.email) || 
            (query._id && user._id === query._id)
          );
        } else if (name === 'trips') {
          return mockDB.trips.find(trip => trip._id === query._id);
        } else if (name === 'expenses') {
          return mockDB.expenses.find(expense => expense._id === query._id);
        }
        return null;
      },
      
      findOneAndUpdate: async (query, update) => {
        if (name === 'users') {
          const userIndex = mockDB.users.findIndex(u => u._id === query._id);
          if (userIndex !== -1) {
            mockDB.users[userIndex] = { ...mockDB.users[userIndex], ...update.$set };
            return mockDB.users[userIndex];
          }
        }
        return null;
      },
      
      insertOne: async (doc) => {
        if (name === 'users') {
          const newUser = { _id: Date.now().toString(), ...doc };
          mockDB.users.push(newUser);
          return newUser;
        } else if (name === 'trips') {
          const newTrip = { _id: Date.now().toString(), ...doc };
          mockDB.trips.push(newTrip);
          return newTrip;
        } else if (name === 'expenses') {
          const newExpense = { _id: Date.now().toString(), ...doc };
          mockDB.expenses.push(newExpense);
          return newExpense;
        }
        return null;
      },
      
      find: async (query) => {
        if (name === 'users') {
          return mockDB.users.filter(user => user.email === query.email);
        } else if (name === 'trips') {
          return mockDB.trips.filter(trip => trip.userId === query.userId);
        } else if (name === 'expenses') {
          return mockDB.expenses.filter(expense => expense.tripId === query.tripId);
        }
        return [];
      },
      
      deleteOne: async (query) => {
        if (name === 'users') {
          const index = mockDB.users.findIndex(u => u._id === query._id);
          if (index !== -1) {
            mockDB.users.splice(index, 1);
            return { deletedCount: 1 };
          }
        }
        return { deletedCount: 0 };
      }
    };
  }
};

// Export a mock connect function
const connectDB = async () => {
  console.log('Mock MongoDB Connected: Simulated connection');
  return mockDB;
};

module.exports = connectDB;