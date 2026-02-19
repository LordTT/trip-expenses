# Quick Start Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation Steps

### 1. Install Backend Dependencies

```bash
cd src/backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 3. Start MongoDB

Make sure MongoDB is running on your system. You can start it with:

```bash
# If MongoDB is installed as a service
sudo systemctl start mongod

# Or run MongoDB directly
mongod
```

### 4. Start the Application

**Option A: Run separately (Recommended for development)**

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

**Option B: Run together with concurrently**

First install concurrently:

```bash
cd src/backend
npm install concurrently --save-dev
```

Then run both together:

```bash
cd src/backend
npx concurrently "npm run dev" "cd ../frontend && npm run dev"
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Using Docker (Alternative)

If you have Docker and Docker Compose installed:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## First Time Setup

1. Open http://localhost:3000 in your browser
2. Click "Register" to create a new account
3. After registration, you'll be automatically logged in
4. Create your first trip
5. Add expenses and see the balance calculations

## Project Structure

### Backend (`src/backend/`)
- `config/` - Database and app configuration
- `controllers/` - Business logic for handling requests
- `models/` - MongoDB database models
- `middleware/` - Authentication and other middleware
- `routes/` - API route definitions
- `utils/` - Utility functions (JWT, etc.)
- `server.js` - Main server entry point

### Frontend (`src/frontend/`)
- `src/components/` - React components
- `src/store/` - Zustand state management
- `src/services/` - API service layer
- `src/App.js` - Main app component with routing
- `src/main.jsx` - Entry point

## Features

- ✅ User registration and login
- ✅ Create and manage trips
- ✅ Add expenses with descriptions and amounts
- ✅ Track who paid and who participated
- ✅ Automatic balance calculation
- ✅ Multi-currency support
- ✅ Responsive design

## API Documentation

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
- `DELETE /api/expenses/delete/:id` - Delete an expense (protected)

## Balance Calculation

The application calculates balances using this formula:

```
Balance = Amount Paid - Amount Owed
```

- **Positive balance**: The person is owed money (they paid more than they owe)
- **Negative balance**: The person owes money (they owe more than they paid)
- **Zero balance**: The person's payments and debts are balanced

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use, you can change them in:
- Backend: `src/backend/.env` (PORT)
- Frontend: `src/frontend/vite.config.js` (server.port)

### MongoDB Connection Issues
Make sure MongoDB is running and the connection string in `src/backend/.env` is correct.

### Module Not Found
Run `npm install` in both backend and frontend directories.

## License

MIT License - See LICENSE file for details.
