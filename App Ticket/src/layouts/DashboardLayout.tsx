import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/dashboard',              emoji: '🏠', label: "Vue d'ensemble", end: true },
  { to: '/dashboard/reservations', emoji: '🎫', label: 'Réservations' },
  { to: '/dashboard/favoris',      emoji: '⭐', label: 'Favoris' },
  { to: '/dashboard/settings',     emoji: '⚙️', label: 'Paramètres' },
];

// NavLink = lien qui sait s'il est actif ou non
function NavItem({ to, emoji, label, end }: { to: string; emoji: string; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `
        flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors
        ${isActive
          ? 'bg-red-600 text-white font-medium'
          : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
        }
      `}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </NavLink>
  );
}

export default function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 flex">

      {/* Sidebar desktop */}
      <aside className="w-52 flex-shrink-0 hidden md:flex flex-col bg-zinc-900 border-r border-zinc-800">

        {/* Logo */}
        <div className="p-5 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              YT
            </div>
            <span className="font-semibold text-sm text-white">YellowTicket</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-0.5">
          {NAV_ITEMS.map(item => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

      </aside>

      {/* Sidebar mobile */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <aside className="relative z-50 w-52 h-full bg-zinc-900 border-r border-zinc-800 flex flex-col">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  YT
                </div>
                <span className="font-semibold text-sm text-white">YellowTicket</span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="text-zinc-400">✕</button>
            </div>
            <nav className="p-3 space-y-0.5">
              {NAV_ITEMS.map(item => (
                <NavItem key={item.to} {...item} />
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Zone principale */}
      <main className="flex-1 flex flex-col">

        {/* Header */}
        <header className="bg-zinc-900 border-b border-zinc-800 px-5 py-3 flex items-center justify-between">
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-zinc-400 text-lg"
          >
            ☰
          </button>
          <span className="text-sm font-medium text-white">Tableau de bord</span>
          {/* Avatar */}
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            JD
          </div>
        </header>

        {/* <Outlet /> = ici s'affiche la page active */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>

      </main>
    </div>
  );
}