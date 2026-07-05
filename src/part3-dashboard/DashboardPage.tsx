import { useState } from 'react';
import { Ticket, Trash2, Star, Award, Gift, Zap, Film, ChevronRight, Crown, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useBookings } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';

// Niveaux de fidélité
const LOYALTY_TIERS = [
  { name: 'Bronze', minPoints: 0, color: 'text-orange-500', bg: 'bg-orange-500/10', icon: Star },
  { name: 'Argent', minPoints: 500, color: 'text-gray-400', bg: 'bg-gray-400/10', icon: Award },
  { name: 'Or', minPoints: 1500, color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: Crown },
  { name: 'Platine', minPoints: 3000, color: 'text-blue-400', bg: 'bg-blue-400/10', icon: Zap },
  { name: 'Diamant', minPoints: 5000, color: 'text-red-500', bg: 'bg-red-500/10', icon: Gift },
];

// Avantages du programme
const REWARDS = [
  { icon: Ticket, title: 'Billet gratuit', description: '1 place offerte pour la séance de votre choix', points: 1000 },
  { icon: Star, title: 'Combo Popcorn', description: 'Popcorn géant + 2 boissons', points: 500 },
  { icon: Crown, title: 'Accès Coupe-file', description: "File d'attente prioritaire", points: 750 },
  { icon: Zap, title: 'Surclassement VIP', description: 'Place VIP offerte au prix normal', points: 2000 },
];

// Composant du Hero de Fidélité
function LoyaltyHero({ points, user }: { points: number, user: any }) {
  const currentTier = LOYALTY_TIERS.find(t => points >= t.minPoints) || LOYALTY_TIERS[0];
  const nextTierIndex = LOYALTY_TIERS.findIndex(t => t.minPoints > points);
  const nextTier = nextTierIndex !== -1 ? LOYALTY_TIERS[nextTierIndex] : null;
  
  const progressToNext = nextTier 
    ? ((points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100 
    : 100;

  const TierIcon = currentTier.icon;

  return (
    <div className="bg-black rounded-3xl p-8 border-2 border-red-600 relative overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.2)]">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 justify-between">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-black text-black shadow-lg">
            {user?.name?.charAt(0).toUpperCase() || 'C'}
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Bonjour, {user?.name || 'Client'}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${currentTier.bg} ${currentTier.color}`}>
                <TierIcon className="w-4 h-4" />
                Membre {currentTier.name}
              </span>
              <span className="text-gray-400 text-sm">Depuis 2024</span>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-md w-full bg-[#111] p-6 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Points SENEFLIX</p>
              <p className="text-4xl font-black text-white">{points.toLocaleString()}</p>
            </div>
            {nextTier && (
              <div className="text-right">
                <p className="text-sm font-medium text-white">{nextTier.name}</p>
                <p className="text-xs text-red-500 font-bold">{nextTier.minPoints - points} pts restants</p>
              </div>
            )}
          </div>
          
          {nextTier && (
            <div className="h-3 bg-black rounded-full overflow-hidden border border-white/10 relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="absolute top-0 left-0 h-full bg-red-600"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Portefeuille de billets (Wallet Style)
function WalletBookings({ bookings, onDelete }: { bookings: any[], onDelete: (id: string) => void }) {
  const upcomingBookings = bookings.filter(b => b.status === 'upcoming');
  const pastBookings = bookings.filter(b => b.status !== 'upcoming');
  const [showPast, setShowPast] = useState(false);

  if (bookings.length === 0) {
    return (
      <div className="text-center py-20 bg-black rounded-3xl border border-white/10">
        <Ticket className="w-20 h-20 text-white/20 mx-auto mb-6" />
        <h3 className="text-2xl font-black text-white mb-3">Aucun billet dans votre portefeuille</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">Vos prochains billets de cinéma apparaîtront ici. Découvrez nos films à l'affiche !</p>
        <Link 
          to="/catalog"
          className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105"
        >
          <Film className="w-5 h-5 mr-2" />
          Réserver un film
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <AnimatePresence>
          {upcomingBookings.map((booking, index) => (
            <motion.div 
              key={booking.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black rounded-3xl overflow-hidden border border-red-600 shadow-2xl flex flex-col md:flex-row relative"
            >
              {/* Côté Image */}
              <div className="w-full md:w-1/3 h-48 md:h-auto shrink-0 relative">
                <img 
                  src={booking.moviePoster} 
                  alt={booking.movieTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black" />
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                  À venir
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6 md:w-2/3 flex flex-col justify-between relative z-10 bg-black">
                <div>
                  <h3 className="text-2xl font-black text-white mb-4 line-clamp-1">{booking.movieTitle}</h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Date & Heure</p>
                      <p className="text-sm text-white font-medium">{booking.date} à {booking.time}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Cinéma</p>
                      <p className="text-sm text-white font-medium">{booking.cinema}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Places</p>
                      <p className="text-sm text-red-500 font-bold">{booking.seats.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total</p>
                      <p className="text-sm text-white font-bold">{booking.totalPrice.toLocaleString()} FCFA</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="bg-white p-2 rounded-lg">
                    <QRCodeSVG 
                      value={`SENEFLIX-${booking.id}`}
                      size={60}
                      level="H"
                    />
                  </div>
                  <button 
                    onClick={() => onDelete(booking.id)}
                    className="p-3 bg-[#111] hover:bg-red-600 text-white rounded-full transition-colors border border-white/10"
                    title="Annuler la réservation"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Effet Ticket Perforé (Design purement CSS) */}
              <div className="hidden md:flex absolute top-0 bottom-0 left-[33%] -ml-3 flex-col justify-between py-2 z-20">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-[#0a0a0a] border-r border-red-600/50 -translate-x-3" />
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {pastBookings.length > 0 && (
        <div className="mt-12 pt-8 border-t border-white/10">
          <button 
            onClick={() => setShowPast(!showPast)}
            className="flex items-center gap-2 text-white font-bold text-xl hover:text-red-500 transition-colors"
          >
            Historique de réservations
            <ChevronRight className={`w-6 h-6 transition-transform ${showPast ? 'rotate-90' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showPast && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pastBookings.map(booking => (
                    <div key={booking.id} className="bg-black p-4 rounded-2xl border border-white/10 flex gap-4 opacity-75 hover:opacity-100 transition-opacity">
                      <img src={booking.moviePoster} alt={booking.movieTitle} className="w-16 h-24 object-cover rounded-lg" />
                      <div>
                        <h4 className="font-bold text-white text-sm line-clamp-1">{booking.movieTitle}</h4>
                        <p className="text-xs text-gray-400 mt-1">{booking.date}</p>
                        <p className="text-xs font-bold text-gray-500 mt-2">Terminé</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// Section Récompenses Redesign
function RewardsGallery({ points }: { points: number }) {
  return (
    <div className="bg-black rounded-3xl p-8 border border-white/10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-black text-white">Catalogue de Récompenses</h3>
          <p className="text-gray-400 mt-1">Échangez vos points contre des cadeaux exclusifs</p>
        </div>
        <div className="bg-[#111] px-6 py-3 rounded-xl border border-white/20">
          <span className="text-gray-400 text-sm mr-2">Solde:</span>
          <span className="text-2xl font-black text-white">{points.toLocaleString()} <span className="text-red-500">pts</span></span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {REWARDS.map((reward, index) => {
          const isUnlocked = points >= reward.points;
          const progress = Math.min((points / reward.points) * 100, 100);
          
          return (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
                isUnlocked 
                  ? 'bg-red-600/10 border-2 border-red-600 hover:bg-red-600/20' 
                  : 'bg-[#111] border border-white/10 opacity-70'
              }`}
            >
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-lg ${
                  isUnlocked ? 'bg-red-600 text-white' : 'bg-black text-gray-500 border border-white/10'
                }`}>
                  <reward.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-lg mb-2">{reward.title}</h4>
                <p className="text-sm text-gray-400 mb-6 min-h-[40px]">{reward.description}</p>
                
                <div className="flex items-center justify-between font-black">
                  <span className={isUnlocked ? 'text-red-500' : 'text-gray-500'}>
                    {reward.points} pts
                  </span>
                  {isUnlocked && (
                    <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full uppercase">Débloqué</span>
                  )}
                </div>
              </div>
              
              {!isUnlocked && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black">
                  <div className="h-full bg-red-600/50" style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Paramètres Simplifiés
function SettingsPanel({ user }: { user: any }) {
  return (
    <div className="max-w-3xl mx-auto bg-black rounded-3xl p-8 border border-white/10 space-y-8">
      <div>
        <h3 className="text-2xl font-black text-white mb-6">Informations du Profil</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Nom Complet</label>
            <input 
              type="text" 
              defaultValue={user?.name || ''}
              className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white font-medium focus:border-red-600 focus:outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Adresse Email</label>
            <input 
              type="email" 
              defaultValue={user?.email || ''}
              className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white font-medium focus:border-red-600 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>
      
      <div className="pt-8 border-t border-white/10">
        <h3 className="text-2xl font-black text-white mb-6">Préférences</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-[#111] rounded-xl cursor-pointer hover:bg-white/10 transition-colors border border-white/5">
            <div>
              <p className="font-bold text-white">Recevoir les offres par email</p>
              <p className="text-sm text-gray-400">Restez informé de nos nouveautés et promotions</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-red-600" />
          </label>
          <label className="flex items-center justify-between p-4 bg-[#111] rounded-xl cursor-pointer hover:bg-white/10 transition-colors border border-white/5">
            <div>
              <p className="font-bold text-white">Notifications SMS</p>
              <p className="text-sm text-gray-400">Rappels avant vos séances</p>
            </div>
            <input type="checkbox" className="w-5 h-5 accent-red-600" />
          </label>
        </div>
      </div>
      
      <div className="pt-8 flex justify-end">
        <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function DashboardPage() {
  const { bookings, removeBooking } = useBookings();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Filtrer les réservations de l'utilisateur
  const userBookings = bookings.filter(b => b.userEmail === user?.email);

  // Calculer les statistiques
  const totalSpent = userBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const loyaltyPoints = Math.floor(totalSpent / 100); // 1 point par 100 FCFA dépensé

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir annuler ce billet ?')) {
      removeBooking(id);
    }
  };

  const navTabs = [
    { id: 'overview', label: 'Accueil', icon: Crown },
    { id: 'tickets', label: 'Mes Billets', icon: Ticket },
    { id: 'rewards', label: 'Récompenses', icon: Gift },
    { id: 'settings', label: 'Profil', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Navigation Horizontale (Tabs) */}
      <div className="bg-black border-b border-white/10 sticky top-[64px] lg:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar gap-8">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-5 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-red-600 text-white font-bold' 
                    : 'border-transparent text-gray-500 hover:text-white font-medium'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <main>
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <LoyaltyHero points={loyaltyPoints} user={user} />
                
                {/* Séances à venir - Raccourci */}
                {userBookings.filter(b => b.status === 'upcoming').length > 0 && (
                  <div className="bg-[#111] p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-black text-white">Votre Prochaine Séance</h3>
                      <button onClick={() => setActiveTab('tickets')} className="text-red-500 hover:text-white font-bold text-sm transition-colors">Voir tout</button>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 items-center bg-black p-6 rounded-2xl border border-white/10">
                      <img 
                        src={userBookings.filter(b => b.status === 'upcoming')[0].moviePoster} 
                        alt="Affiche"
                        className="w-24 h-36 object-cover rounded-xl"
                      />
                      <div className="flex-1 text-center md:text-left">
                        <h4 className="text-xl font-bold text-white">{userBookings.filter(b => b.status === 'upcoming')[0].movieTitle}</h4>
                        <p className="text-gray-400 mt-2">{userBookings.filter(b => b.status === 'upcoming')[0].date} à {userBookings.filter(b => b.status === 'upcoming')[0].time}</p>
                        <p className="text-red-500 font-bold mt-1">Sièges : {userBookings.filter(b => b.status === 'upcoming')[0].seats.join(', ')}</p>
                      </div>
                      <Link to={`/movie/${userBookings.filter(b => b.status === 'upcoming')[0].movieId}`} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-colors border-2 border-red-600">
                        Détails du film
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'tickets' && (
              <motion.div
                key="tickets"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-8">
                  <h1 className="text-4xl font-black text-white">Portefeuille de Billets</h1>
                  <p className="text-gray-400 mt-2">Gérez vos réservations et accédez à vos QR Codes</p>
                </div>
                <WalletBookings bookings={userBookings} onDelete={handleDelete} />
              </motion.div>
            )}

            {activeTab === 'rewards' && (
              <motion.div
                key="rewards"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <RewardsGallery points={loyaltyPoints} />
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <SettingsPanel user={user} />
                <div className="max-w-3xl mx-auto text-center">
                  <button 
                    onClick={logout}
                    className="inline-flex items-center justify-center gap-2 text-gray-500 hover:text-red-500 font-bold transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Se déconnecter de SENEFLIX
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
