# Trip Expense Tracker - Project Summary

## Overview
A modular web application that allows users to log all their spendings on a trip and see what each user owes to the others. The application is built with a clean, modular architecture for easy maintenance and scalability.

## What's Been Created

### Backend (Node.js + Express + MongoDB)
- **Authentication System**: User registration, login, and JWT-based authentication
- **Trip Management**: Create, read, update, and delete trips
- **Expense Tracking**: Log expenses with descriptions, amounts, and participants
- **Balance Calculation**: Automatic calculation of who owes who
- **Modular Architecture**: Separated into controllers, models, routes, middleware, and utils

### Frontend (React + Vite + Tailwind CSS)
- **Responsive UI**: Clean, modern design that works on all devices
- **State Management**: Zustand for efficient state handling
- **API Integration**: Axios for backend communication
- **Component-Based**: Modular React components for easy maintenance

## Project Structure

```
trip-expense-tracker/
├── src/
│   ├── backend/              # Backend API
│   │   ├── config/          # Database and app configuration
│   │   ├── controllers/     # Business logic (user, trip, expense)
│   │   ├── models/          # MongoDB database models
│   │   ├── middleware/      # Authentication middleware
│   │   ├── routes/          # API route definitions
│   │   ├── utils/           # Utility functions (JWT, etc.)
│   │   ├── server.js        # Main server file
│   │   └── package.json
│   └── frontend/            # Frontend application
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── store/       # Zustand state management
│       │   ├── services/    # API services
│       │   ├── App.js       # Main app with routing
│       │   └── main.jsx     # Entry point
│       ├── public/          # Static assets
│       ├── index.html
│       └── package.json
├── README.md                # Main documentation
├── QUICKSTART.md           # Quick setup guide
├── docker-compose.yml      # Docker configuration
└── .gitignore
```

## Key Features

1. **User Authentication**
   - Secure registration with password hashing
   - JWT-based authentication
   - Protected routes

2. **Trip Management**
   - Create trips with names and descriptions
   - Add multiple members to trips
   - Set start and end dates

3. **Expense Tracking**
   - Add expenses with descriptions and amounts
   - Track who paid and who participated
   - Multi-currency support

4. **Balance Calculation**
   - Automatic calculation of who owes who
   - Visual representation of balances
   - Clear indication of positive/negative balances

## Technology Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for security

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Zustand for state management
- React Router for navigation
- Axios for API calls

## How to Use

### Quick Start
1. Install dependencies:
   ```bash
   cd src/backend && npm install
   cd ../frontend && npm install
   ```

2. Start MongoDB

3. Run the application:
   ```bash
   # Terminal 1 - Backend
   cd src/backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd src/frontend
   npm run dev
   ```

4. Access the application at http://localhost:3000

### Using Docker
```bash
docker-compose up -d
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)

### Trips
- `POST /api/trips` - Create a new trip (protected)
- `GET /api/trips` - Get all trips (protected)
- `GET /api/trips/:id` - Get trip by ID (protected)
- `DELETE /api/trips/:id` - Delete a trip (protected)
- `POST /api/trips/:id/members` - Add member to trip (protected)

### Expenses
- `POST /api/expenses` - Add a new expense (protected)
- `GET /api/expenses/trip/:tripId` - Get expenses for a trip (protected)
- `DELETE /api/expenses/delete/:id` - Delete an expense (protected)

## Balance Calculation Logic

The application uses a simple but effective formula:

```
Balance = Amount Paid - Amount Owed
```

Where:
- **Amount Paid**: Total amount this person has paid for expenses
- **Amount Owed**: Total amount this person should pay (split among participants)

### Examples:
- **Positive balance (+$50)**: The person is owed $50 (they paid more than they owe)
- **Negative balance (-$30)**: The person owes $30 (they owe more than they paid)
- **Zero balance ($0)**: The person's payments and debts are balanced

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Input validation
- CORS protection
- Environment variables for sensitive data

## Modular Design

The application is designed with modularity in mind:

1. **Backend**: Each feature (users, trips, expenses) has its own controllers, models, and routes
2. **Frontend**: Components are separated by functionality and use dedicated state stores
3. **State Management**: Separate Zustand stores for auth, trips, and expenses
4. **API Services**: Centralized API calls with interceptors for authentication

## Future Enhancements

- [ ] Mobile app version
- [ ] Receipt scanning and OCR
- [ ] Currency conversion
- [ ] Export to CSV/PDF
- [ ] Real-time notifications
- [ ] Group chat for trips
- [ ] Budget tracking
- [ ] Statistics and analytics

## Documentation

- **README.md**: Comprehensive project documentation
- **QUICKSTART.md**: Quick setup guide for developers
- **Inline comments**: Well-commented code for better understanding

## License

MIT License - See LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- Built with modular architecture for easy maintenance and scalability
- Inspired by popular expense tracking apps like Splitwise and TripSplitter
- Uses modern web technologies for a responsive and performant user experience
