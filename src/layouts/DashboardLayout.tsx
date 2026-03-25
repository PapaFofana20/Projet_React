import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Film, Ticket, LogOut, Settings, Menu, X, Search, Sun, RotateCcw, Bell, Star, Home } from 'lucide-react';
import { useState } from 'react';

const NAV_SECTIONS = [
  {
    label: 'Favoris',
    items: [
      { to: '/dashboard', icon: Home, label: 'Accueil' },
      { to: '/dashboard/films', icon: Film, label: 'Mes films' },
    ],
  },
  {
    label: 'Tableau de bord',
    items: [
      { to: '/dashboard', icon: Ticket, label: 'Vue d\'ensemble', end: true },
      { to: '/dashboard/reservations', icon: Ticket, label: 'Réservations' },
      { to: '/dashboard/favoris', icon: Star, label: 'Favoris' },
    ],
  },
  {
    label: 'Compte',
    items: [
      { to: '/dashboard/settings', icon: Settings, label: 'Paramètres' },
    ],
  },
];

function NavItem({ to, icon: Icon, label, end }: { to: string; icon: any; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 group ${
          isActive
            ? 'bg-[#f4f4f6] text-[#1a1a2e] font-medium'
            : 'text-[#8a8a9a] hover:text-[#1a1a2e] hover:bg-[#f4f4f6]/60'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
              isActive ? 'bg-[#1a1a2e]' : 'bg-[#d1d1d8] group-hover:bg-[#8a8a9a]'
            }`}
          />
          <Icon className="w-4 h-4 flex-shrink-0" />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

function SidebarContent({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      onClose?.();
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* User profile */}
      <div className="p-5 flex items-center justify-between border-b border-[#e5e5ea]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            YT
          </div>
          <span className="font-semibold text-sm text-[#1a1a2e]">YellowTicket</span>
        </div>
        {mobile && (
          <button
            onClick={onClose}
            className="text-[#8a8a9a] hover:text-[#1a1a2e]"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-5 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#c0c0cc]">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem
                  key={item.to + item.label}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  end={item.end}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#e5e5ea]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#ef4444] hover:bg-red-50 transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-300 flex-shrink-0" />
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f4f6] flex">
      {/* Desktop sidebar */}
      <aside className="w-56 flex-shrink-0 hidden md:block sticky top-0 h-screen border-r border-[#e5e5ea]">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 w-56 h-full border-r border-[#e5e5ea] shadow-xl">
            <SidebarContent mobile onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 bg-white border-b border-[#e5e5ea]">
          {/* Left: hamburger (mobile) + breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden rounded-lg p-1.5 text-[#8a8a9a] hover:bg-[#f4f4f6]"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center gap-2 text-sm">
              <button className="p-1.5 rounded-lg text-[#8a8a9a] hover:bg-[#f4f4f6]">
                <Menu className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg text-[#8a8a9a] hover:bg-[#f4f4f6]">
                <Star className="w-4 h-4" />
              </button>
              <span className="text-[#c0c0cc]">/</span>
              <span className="text-[#8a8a9a]">Tableau de bord</span>
              <span className="text-[#c0c0cc]">/</span>
              <span className="font-medium text-[#1a1a2e]">Vue d'ensemble</span>
            </div>
          </div>

          {/* Right: search + icons */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-[#e5e5ea] bg-[#f4f4f6] px-3 py-1.5 text-sm text-[#8a8a9a]">
              <Search className="w-3.5 h-3.5" />
              <span>Rechercher</span>
              <kbd className="ml-2 rounded border border-[#e5e5ea] bg-white px-1.5 py-0.5 text-[10px] font-mono text-[#c0c0cc]">/</kbd>
            </div>
            <button className="rounded-lg p-1.5 text-[#8a8a9a] hover:bg-[#f4f4f6]"><Sun className="w-4 h-4" /></button>
            <button className="rounded-lg p-1.5 text-[#8a8a9a] hover:bg-[#f4f4f6]"><RotateCcw className="w-4 h-4" /></button>
            <button className="rounded-lg p-1.5 text-[#8a8a9a] hover:bg-[#f4f4f6]"><Bell className="w-4 h-4" /></button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-5 md:p-7">
          <Outlet />
        </div>
      </main>
    </div>
  );
}