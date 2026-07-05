import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, ProtectedRoute, ProtectedAdminRoute } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { AdminFilmProvider } from './context/AdminFilmContext';

// Client Layout & Pages
import ClientLayout from './layouts/ClientLayout';
import LandingPage from './part1-landing/LandingPage';
import CatalogPage from './part1-landing/CatalogPage';
import LoginPage from './part2-auth/LoginPage';
import RegisterPage from './part2-auth/RegisterPage';
import ProfilePage from './part2-auth/ProfilePage';
import ResetPassword from './part2-auth/ResetPassword';
import DashboardPage from './part3-dashboard/DashboardPage';
import MovieDetails from './part4-booking/MovieDetails';
import SeatSelection from './part4-booking/SeatSelection';
import Checkout from './part4-booking/Checkout';

// Admin Layout & Pages
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFilms from './pages/admin/AdminFilms';
import AdminReservations from './pages/admin/AdminReservations';
import AdminAnalytics from './pages/admin/AdminAnalytics';

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <AdminFilmProvider>
          <Router>
            <Routes>
              {/* ========== CLIENT ROUTES ========== */}
              <Route element={<ClientLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                
                {/* Protected Client Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/book/:id/seats" element={
                  <ProtectedRoute>
                    <SeatSelection />
                  </ProtectedRoute>
                } />
                <Route path="/book/:id/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
              </Route>

              {/* ========== ADMIN ROUTES ========== */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                } />
                <Route path="films" element={
                  <ProtectedAdminRoute>
                    <AdminFilms />
                  </ProtectedAdminRoute>
                } />
                <Route path="reservations" element={
                  <ProtectedAdminRoute>
                    <AdminReservations />
                  </ProtectedAdminRoute>
                } />
                <Route path="analytics" element={
                  <ProtectedAdminRoute>
                    <AdminAnalytics />
                  </ProtectedAdminRoute>
                } />
              </Route>
              
              {/* Admin Login - Outside AdminLayout */}
              <Route path="/admin/login" element={<AdminLogin />} />
            </Routes>
          </Router>
        </AdminFilmProvider>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
