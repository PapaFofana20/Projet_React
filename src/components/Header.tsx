import { Link, useNavigate } from 'react-router-dom';
import { User, Ticket, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-black/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex items-center gap-3 group relative">
            <span className="font-black text-4xl tracking-[ -0.05em] uppercase italic bg-gradient-to-b from-[#E50914] to-[#B20710] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300">
              SENEFLIX
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/dashboard" className="text-gray-300 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
              <Ticket className="w-5 h-5" />
              <span>Tableau de Bord</span>
            </Link>
            <div className="h-6 w-px bg-white/10"></div>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-[10px] font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-200">{user?.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">Connexion</span>
                </Link>
                <Link to="/register" className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-md text-sm font-bold transition-colors shadow-lg shadow-brand-500/30 uppercase tracking-widest">
                  Inscription
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
