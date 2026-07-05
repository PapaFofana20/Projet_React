import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Film,
  Ticket,
  BarChart3,
  LogOut,
  Award,
  Menu,
  X,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { adminLogout, admin } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, path: '/admin' },
    { id: 'films', label: 'Gestion des Films', icon: Film, path: '/admin/films' },
    { id: 'reservations', label: 'Réservations', icon: Ticket, path: '/admin/reservations' },
    { id: 'analytics', label: 'Analyses', icon: BarChart3, path: '/admin/analytics' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-red-500" />
            <span className="font-bold text-white">SENEFLIX Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-400 hover:text-white"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-dark-800 border-r border-dark-700 z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-dark-700">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-red-500" />
              <div>
                <h1 className="font-bold text-white text-lg">SENEFLIX</h1>
                <p className="text-xs text-gray-400">Administration</p>
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="mx-4 mt-4 p-3 bg-gradient-to-br from-red-600/20 to-red-900/20 rounded-xl border border-red-500/20">
            <p className="text-xs text-gray-400">Connecté en tant que</p>
            <p className="text-sm text-white font-medium">{admin?.name || 'Administrateur'}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      active 
                        ? 'bg-red-600 text-white' 
                        : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-dark-700 space-y-2">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-dark-700 hover:text-white transition-all"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Retour au site</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-dark-700 hover:text-red-500 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
