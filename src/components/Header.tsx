import { Link, useLocation } from 'react-router-dom';
import { User, Menu, X, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
                    <Link to="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="SENEFLIX Logo" 
              className="h-16 lg:h-20 w-auto object-contain"
            />
          </Link>

                    <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                isActive('/dashboard')
                  ? 'text-white bg-white/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Tableau de bord
            </Link>

                        <div className="h-6 w-px bg-white/10"></div>

                        {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-2 py-1.5 rounded-full hover:bg-white/5 transition-all duration-300"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-red-600 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-brand-500/20">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium">{user?.name || 'Utilisateur'}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-dark-800/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden"
                    >
                      <div className="p-3 border-b border-white/5">
                        <p className="text-sm font-medium text-white">{user?.name || 'Utilisateur'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{user?.email || 'utilisateur@email.com'}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <User className="w-4 h-4" />
                          Mon Profil
                        </Link>
                      </div>
                      <div className="p-2 border-t border-white/5">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Se déconnecter
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-full text-sm font-medium text-white hover:bg-white/10 transition-all duration-300"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-[#E50914] hover:bg-[#F40612] transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>

                    <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

            <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
className="md:hidden bg-dark-800/98 backdrop-blur-xl border-t border-white/5"
          >
            <div className="px-4 py-6 space-y-2">
              {isAuthenticated && (
                <>
                  <div className="pb-4 border-b border-white/5 mb-4">
                    <div className="flex items-center gap-3 px-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-red-600 rounded-full flex items-center justify-center text-lg font-bold text-white">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user?.name || 'Utilisateur'}</p>
                        <p className="text-xs text-gray-500">{user?.email || 'utilisateur@email.com'}</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive('/dashboard')
                        ? 'text-white bg-white/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Tableau de bord
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive('/profile')
                        ? 'text-white bg-white/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    Mon Profil
                  </Link>

                  <div className="pt-4 border-t border-white/5 mt-4">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut className="w-5 h-5" />
                      Se déconnecter
                    </button>
                  </div>
                </>
              )}

              {!isAuthenticated && (
                <div className="space-y-3 pt-4">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl text-sm font-medium text-white border border-white/20 hover:bg-white/5 transition-all"
                  >
                    <User className="w-5 h-5" />
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl text-sm font-semibold text-white bg-[#E50914] hover:bg-[#F40612] transition-all"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
