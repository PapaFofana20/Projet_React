import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './part1-landing/LandingPage';
import LoginPage from './part2-auth/LoginPage';
import RegisterPage from './part2-auth/RegisterPage';
import ResetPassword from './part2-auth/ResetPassword';
import DashboardPage from './part3-dashboard/DashboardPage';
import MovieDetails from './part4-booking/MovieDetails';
import SeatSelection from './part4-booking/SeatSelection';
import Checkout from './part4-booking/Checkout';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-dark-900 text-white">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/book/:id/seats" element={<SeatSelection />} />
            <Route path="/book/:id/checkout" element={<Checkout />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
