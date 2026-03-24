import { Link } from 'react-router-dom';
import { Film, User, Ticket } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-dark-800 border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-brand-500 hover:text-brand-400 transition-colors">
            <Film className="w-8 h-8" />
            <span className="font-black text-2xl tracking-widest text-brand-500 uppercase">SENEFLIX</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/dashboard" className="text-gray-300 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
              <Ticket className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-dark-700"></div>
            <Link to="/login" className="text-gray-300 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
            <Link to="/register" className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg shadow-brand-500/30">
              Sign Up
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
