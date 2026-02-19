import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import TripList from './components/TripList.jsx';
import TripDetail from './components/TripDetail.jsx';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import useAuthStore from './store/authStore';

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <TripList />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips"
              element={
                <PrivateRoute>
                  <TripList />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips/:tripId"
              element={
                <PrivateRoute>
                  <TripDetail />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
