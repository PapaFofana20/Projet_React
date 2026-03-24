import { useState } from 'react';

type User = {
  initials: string;
  name: string;
  role: string;
  totalBookings: number;
  points: number;
};

// Carte profil — reçoit un "user" en prop et l'affiche
function ProfileCard({ user }: { user: User }) {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 max-w-sm">

      {/* Avatar + nom */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
          {user.initials}
        </div>
        <div>
          <p className="font-semibold text-white">{user.name}</p>
          <p className="text-sm text-zinc-400">{user.role}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between border-b border-zinc-800 pb-3">
          <span className="text-zinc-400">Total réservations</span>
          <span className="font-semibold text-white">{user.totalBookings}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Points fidélité</span>
          <span className="font-semibold text-red-500">{user.points} pts</span>
        </div>
      </div>

    </div>
  );
}

// Composant principal — crée les données et les passe à ProfileCard
export default function DashboardPage() {

  const user: User = {
    initials: 'JD',
    name: 'John Doe',
    role: 'Membre Cinéphile',
    totalBookings: 5,
    points: 450,
  };

  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Mon Tableau de bord</h1>
        <p className="text-zinc-400 text-sm mt-1">Bienvenue, {user.name}</p>
      </div>

      {/* On passe l'objet "user" à ProfileCard via les props */}
      <ProfileCard user={user} />
    </div>
  );
}