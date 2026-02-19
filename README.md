# Trip Expense Tracker

A modular web application that allows users to log all their spendings on a trip and see what each user owes to the others.

## Features

- **User Authentication**: Secure login and registration system
- **Trip Management**: Create and manage trips with multiple members
- **Expense Tracking**: Log expenses with descriptions, amounts, and participants
- **Balance Calculation**: Automatically calculate who owes who and how much
- **Multi-currency Support**: Track expenses in different currencies
- **Responsive Design**: Clean, modern UI that works on all devices

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React with Vite
- Tailwind CSS for styling
- Zustand for state management
- Axios for API calls
- React Router for navigation

## Project Structure

```
trip-expense-tracker/
├── src/
│   ├── backend/
│   │   ├── config/          # Database and app configuration
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Authentication middleware
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions (JWT, etc.)
│   │   ├── server.js        # Main server file
│   │   └── package.json
│   └── frontend/
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── store/       # Zustand state management
│       │   ├── services/    # API services
│       │   ├── App.js       # Main app component
│       │   └── main.jsx     # Entry point
│       ├── public/          # Static assets
│       ├── index.html
│       └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trip-expense-tracker
   ```

2. **Install backend dependencies**
   ```bash
   cd src/backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**

   Create a `.env` file in the `src/backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/trip-expense-tracker
   JWT_SECRET=your_jwt_secret_key_change_in_production
   JWT_EXPIRE=7d
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Run the application**

   **Option 1: Run backend and frontend separately**

   Terminal 1 - Backend:
   ```bash
   cd src/backend
   npm run dev
   ```

   Terminal 2 - Frontend:
   ```bash
   cd src/frontend
   npm run dev
   ```

   **Option 2: Run both together (requires concurrently)**
   ```bash
   cd src/backend
   npm install concurrently --save-dev
   npx concurrently "npm run dev" "cd ../frontend && npm run dev"
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)

### Trips
- `POST /api/trips` - Create a new trip (protected)
- `GET /api/trips` - Get all trips for the user (protected)
- `GET /api/trips/:id` - Get trip by ID (protected)
- `DELETE /api/trips/:id` - Delete a trip (protected)
- `POST /api/trips/:id/members` - Add member to trip (protected)

### Expenses
- `POST /api/expenses` - Add a new expense (protected)
- `GET /api/expenses/trip/:tripId` - Get expenses for a trip (protected)
- `DELETE /api/expenses/:id` - Delete an expense (protected)

## How It Works

1. **User Registration/Login**: Users create accounts and log in to access their trips
2. **Trip Creation**: Create trips with names, descriptions, and dates
3. **Add Members**: Invite other users to join your trips
4. **Log Expenses**: Record expenses with descriptions, amounts, and participants
5. **Automatic Balances**: The system calculates who paid what and who owes whom

## Balance Calculation Logic

The application uses a simple but effective balance calculation:

1. For each expense, track who paid and who participated
2. Divide the expense amount equally among participants
3. Track how much each person has paid and how much they owe
4. Calculate the net balance: `Balance = Paid - Owed`

- **Positive balance**: The person is owed money (they paid more than they owe)
- **Negative balance**: The person owes money (they owe more than they paid)
- **Zero balance**: The person's payments and debts are balanced

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Input validation
- CORS protection

## Future Enhancements

- [ ] Mobile app version
- [ ] Receipt scanning and OCR
- [ ] Currency conversion
- [ ] Export to CSV/PDF
- [ ] Real-time notifications
- [ ] Group chat for trips
- [ ] Budget tracking
- [ ] Statistics and analytics

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with modular architecture for easy maintenance and scalability
- Inspired by popular expense tracking apps like Splitwise and TripSplitter
