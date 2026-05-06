import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Header from './components/Header';
import MobileTabNavigation from './components/MobileTabNavigation';
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
import { ProtectedRoute } from './context/AuthContext';

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-900 text-white">
      <ScrollToTop />
      <Header />
      <main className="flex-grow pt-16 lg:pt-20 pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          
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
        </Routes>
      </main>
      <MobileTabNavigation />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <AppContent />
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
