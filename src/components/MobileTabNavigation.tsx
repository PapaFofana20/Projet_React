import { Link, useLocation } from 'react-router-dom';
import { Home, Film, Ticket, User } from 'lucide-react';

export default function MobileTabNavigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Accueil', icon: Home, path: '/' },
    { label: 'Films', icon: Film, path: '/catalog' },
    { label: 'Tickets', icon: Ticket, path: '/dashboard' },
    { label: 'Profil', icon: User, path: '/profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-xl border-t border-white/5 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300 ${
                active ? 'text-brand-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
