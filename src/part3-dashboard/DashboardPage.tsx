import { useState, useEffect, useRef } from 'react';
import { PartyPopper, Film, Wallet, Sparkles, Calendar, Clock, MapPin, Armchair, Gift, User, Mail, Bell, LogOut, Download, Navigation, Globe, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useBookings } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { downloadTicketPDF } from '../services/ticketPDFService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cinemas } from '../data/cinemaLocations';
import type { CinemaLocation } from '../data/cinemaLocations';

// Niveaux de fidélité
const LOYALTY_TIERS = [
  { name: 'Bronze', minPoints: 0, color: 'from-orange-600 to-orange-500', textColor: 'text-orange-500' },
  { name: 'Argent', minPoints: 500, color: 'from-gray-400 to-gray-300', textColor: 'text-gray-400' },
  { name: 'Or', minPoints: 1500, color: 'from-yellow-500 to-amber-500', textColor: 'text-yellow-500' },
  { name: 'Platine', minPoints: 3000, color: 'from-blue-500 to-cyan-400', textColor: 'text-blue-400' },
  { name: 'Diamant', minPoints: 5000, color: 'from-red-600 to-pink-500', textColor: 'text-red-500' },
];

// Récompenses avec icônes
const REWARDS = [
  { icon: 'ticket', title: 'Billet offert', description: 'Une place gratuite pour le film de ton choix', points: 1000, color: 'from-red-600 to-red-500' },
  { icon: 'gift', title: 'Combo Popcorn', description: 'Popcorn XXL + 2 sodas', points: 500, color: 'from-amber-600 to-amber-500' },
  { icon: 'star', title: 'Accès VIP', description: 'Passe la file d\'attente', points: 750, color: 'from-purple-600 to-purple-500' },
  { icon: 'sparkles', title: 'Surclassement', description: 'Place premium au prix normal', points: 2000, color: 'from-green-600 to-green-500' },
];

// Styles de carte pour les cinémas
const CINEMA_CARD_STYLES = [
  { 
    gradient: 'from-red-600/20 to-red-900/10', 
    border: 'border-red-500/30',
    accent: 'text-red-400',
    icon: 'film',
    badge: 'bg-red-500'
  },
  { 
    gradient: 'from-amber-600/20 to-amber-900/10', 
    border: 'border-amber-500/30',
    accent: 'text-amber-400',
    icon: 'map',
    badge: 'bg-amber-500'
  },
  { 
    gradient: 'from-green-600/20 to-green-900/10', 
    border: 'border-green-500/30',
    accent: 'text-green-400',
    icon: 'navigation',
    badge: 'bg-green-500'
  },
  { 
    gradient: 'from-purple-600/20 to-purple-900/10', 
    border: 'border-purple-500/30',
    accent: 'text-purple-400',
    icon: 'star',
    badge: 'bg-purple-500'
  },
  { 
    gradient: 'from-pink-600/20 to-pink-900/10', 
    border: 'border-pink-500/30',
    accent: 'text-pink-400',
    icon: 'globe',
    badge: 'bg-pink-500'
  },
  { 
    gradient: 'from-cyan-600/20 to-cyan-900/10', 
    border: 'border-cyan-500/30',
    accent: 'text-cyan-400',
    icon: 'location',
    badge: 'bg-cyan-500'
  },
];

// Messages sympas selon le niveau
const TIER_MESSAGES: { [key: string]: string[] } = {
  'Bronze': ['Bien joué pour le début !', 'Chaque film compte', 'La culture c\'est bien !'],
  'Argent': ['Tu prends goût hein !', 'On reconnaît les vrais cinéphiles', 'Continue comme ça !'],
  'Or': ['Waouh, tu gères !', 'Le cinéma n\'a plus de secrets pour toi', 'Membre doré, bravo !'],
  'Platine': ['Tu es un(e) addict du cinéma !', 'On t\'a déjà vu(e) ici... beaucoup !', 'Le niveau Platine, respect !'],
  'Diamant': ['Légende de SENEFLIX !', 'Tu vis dans cette salle !', 'Incroyable, champion(e) !'],
};

// Styles de cartes pour varier les affichages
const CARD_STYLES = [
  { class: 'rounded-2xl', label: 'standard' },
  { class: 'rounded-3xl', label: 'soft' },
  { class: 'rounded-lg', label: 'sharp' },
  { class: 'rounded-2xl border-2 border-white/20', label: 'bordered' },
];

// Sidebar gauche - avec nouvelles icônes Lucide
function LeftSidebar({ points, user, totalSpent, ticketCount }: { points: number, user: any, totalSpent: number, ticketCount: number }) {
  const currentTier = LOYALTY_TIERS.find(t => points >= t.minPoints) || LOYALTY_TIERS[0];
  const nextTierIndex = LOYALTY_TIERS.findIndex(t => t.minPoints > points);
  const nextTier = nextTierIndex !== -1 ? LOYALTY_TIERS[nextTierIndex] : null;
  
  const progressToNext = nextTier 
    ? ((points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100 
    : 100;

  // Message aléatoire
  const tierMessages = TIER_MESSAGES[currentTier.name] || TIER_MESSAGES['Bronze'];
  const randomMessage = tierMessages[Math.floor(Math.random() * tierMessages.length)];

  // Déterminer l'icône du niveau
  const tierIcons: { [key: string]: string } = {
    'Bronze': '●',
    'Argent': '◆',
    'Or': '★',
    'Platine': '♦',
    'Diamant': '♔',
  };

  return (
    <div className="space-y-6">
      {/* Profil */}
      <div className="bg-gradient-to-b from-gray-900 to-black rounded-3xl p-6 border border-white/5">
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${currentTier.color} flex items-center justify-center shadow-lg`}>
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white truncate">{user?.name || 'Cinéphile'}</h2>
            <p className={`text-sm ${currentTier.textColor} font-medium`}>
              <span className="mr-1">{tierIcons[currentTier.name]}</span>
              {currentTier.name}
            </p>
          </div>
        </div>
        
        <p className="text-gray-400 text-sm italic">"{randomMessage}"</p>
      </div>

      {/* Stats avec icônes Lucide */}
      <div className="space-y-3">
        <div className="bg-gray-900/50 rounded-2xl p-5 border border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 flex items-center justify-center">
              <Film className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-gray-500 text-xs">Films vus</p>
              <p className="text-3xl font-black text-white">{ticketCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 rounded-2xl p-5 border border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-600/20 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-gray-500 text-xs">Dépensé au cinéma</p>
              <p className="text-3xl font-black text-white">{totalSpent.toLocaleString()} F</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-600/20 to-amber-500/10 rounded-2xl p-5 border border-amber-500/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-gray-500 text-xs">Points fidélité</p>
              <p className="text-3xl font-black text-amber-400">{points.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progression */}
      {nextTier && (
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Prochain niveau</span>
            <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${nextTier.color} text-white text-xs font-bold`}>
              {tierIcons[nextTier.name]} {nextTier.name}
            </span>
          </div>
          
          <div className="mb-3">
            <span className="text-3xl font-black text-white">{points}</span>
            <span className="text-gray-500 text-sm ml-2">/ {nextTier.minPoints} pts</span>
          </div>
          
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressToNext}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full"
            />
          </div>
          
          <p className="text-gray-500 text-xs mt-3">
            Plus que <span className="text-red-400 font-bold">{nextTier.minPoints - points}</span> points !
          </p>
        </div>
      )}

      {/* Si niveau max */}
      {!nextTier && (
        <div className="bg-gradient-to-b from-amber-600/20 to-amber-500/5 rounded-2xl p-6 border border-amber-500/20 text-center">
          <PartyPopper className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <p className="text-xl font-black text-white mb-1">Niveau maximum !</p>
          <p className="text-gray-400 text-sm">Tu es une vraie légende du cinéma</p>
        </div>
      )}

      {/* Paliers */}
      <div className="bg-gray-900/30 rounded-2xl p-5 border border-white/5">
        <p className="text-gray-500 text-xs mb-4 uppercase tracking-wider">Les niveaux</p>
        <div className="flex justify-between">
          {LOYALTY_TIERS.map((tier, i) => (
            <div key={i} className="text-center">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${tier.color} mx-auto mb-1 flex items-center justify-center text-sm ${points >= tier.minPoints ? 'opacity-100 shadow-lg' : 'opacity-30'}`}>
                {tierIcons[tier.name]}
              </div>
              <span className={`text-[10px] ${tier.textColor}`}>{tier.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Billet avec icônes Lucide
function TicketItem({ booking, onDelete, index }: { booking: any, onDelete: (id: string) => void, index: number }) {
  const cardStyle = CARD_STYLES[index % CARD_STYLES.length];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-gradient-to-b from-gray-900 to-gray-950 ${cardStyle.class} border border-white/5 overflow-hidden`}
    >
      <div className="flex flex-col md:flex-row">
        {/* Affiche */}
        <div className="w-full md:w-48 shrink-0">
          <img 
            src={booking.moviePoster} 
            alt={booking.movieTitle}
            className="w-full h-48 md:h-full object-cover"
          />
        </div>
        
        {/* Infos */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-black text-white mb-1">{booking.movieTitle}</h3>
              <span className="inline-flex items-center gap-1.5 bg-red-600/20 text-red-400 text-xs font-bold px-3 py-1 rounded-full">
                <Film className="w-3 h-3" />
                À venir
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-gray-500 text-[10px] uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Date
              </p>
              <p className="text-white font-bold">{booking.date}</p>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] uppercase flex items-center gap-1">
                <Clock className="w-3 h-3" /> Heure
              </p>
              <p className="text-white font-bold">{booking.time}</p>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] uppercase flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Salle
              </p>
              <p className="text-white font-bold">{booking.cinema}</p>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] uppercase flex items-center gap-1">
                <Armchair className="w-3 h-3" /> Places
              </p>
              <p className="text-red-400 font-bold">{booking.seats.join(', ')}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-lg">
                <QRCodeSVG value={`SENEFLIX-${booking.id}`} size={60} level="H" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Payé</p>
                <p className="text-2xl font-black text-white">{booking.totalPrice.toLocaleString()} F</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => downloadTicketPDF(booking)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button 
                onClick={() => onDelete(booking.id)}
                className="p-2 bg-white/5 hover:bg-red-600 text-gray-400 hover:text-white rounded-lg transition-colors"
                title="Supprimer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Mini carte pour les cinémas
function CinemaMiniMap({ cinema }: { cinema: CinemaLocation }) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const tileLayer = cinema.mapStyle === 'dark' 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : cinema.mapStyle === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    mapRef.current = L.map(mapContainerRef.current, {
      center: [cinema.lat, cinema.lng],
      zoom: 14,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      attributionControl: false,
    });

    L.tileLayer(tileLayer, {
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Marqueur simple
    const icon = L.divIcon({
      className: 'mini-marker',
      html: `<div style="width:20px;height:20px;background:${cinema.markerColor};border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    L.marker([cinema.lat, cinema.lng], { icon }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [cinema]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}

// Récompenses avec icônes Lucide
function RewardCard({ reward, points }: { reward: any, points: number }) {
  const isUnlocked = points >= reward.points;
  const progress = Math.min((points / reward.points) * 100, 100);
  
  // Mapper les noms d'icônes aux composants
  const iconMap: { [key: string]: any } = {
    'ticket': <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>,
    'gift': <Gift className="w-6 h-6" />,
    'star': <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
    'sparkles': <Sparkles className="w-6 h-6" />,
  };
  
  return (
    <div className={`bg-gray-900/50 rounded-2xl p-6 border ${isUnlocked ? 'border-green-500/30 bg-green-600/5' : 'border-white/5'}`}>
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${reward.color} ${
          isUnlocked ? 'text-white' : 'text-white/50'
        }`}>
          {iconMap[reward.icon] || <Gift className="w-6 h-6" />}
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-white mb-1">{reward.title}</h4>
          <p className="text-sm text-gray-400 mb-4">{reward.description}</p>
          
          <div className="flex items-center justify-between">
            <span className={`text-xl font-black ${isUnlocked ? 'text-green-400' : 'text-gray-500'}`}>
              {reward.points} pts
            </span>
            {isUnlocked ? (
              <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                Dispo
              </span>
            ) : (
              <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
            )}
          </div>
          
          {!isUnlocked && (
            <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${reward.color} rounded-full`} style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Dashboard
export default function DashboardPage() {
  const { bookings, removeBooking } = useBookings();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tickets');

  const userBookings = bookings.filter(b => b.userEmail === user?.email);
  const upcomingBookings = userBookings.filter(b => b.status === 'upcoming');
  const totalSpent = userBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const loyaltyPoints = Math.floor(totalSpent / 100);

  const handleDelete = (id: string) => {
    if (confirm('Tu es sûr(e) de vouloir supprimer ce billet ?')) {
      removeBooking(id);
    }
  };

  const tabs = [
    { id: 'tickets', label: 'Mes billets', icon: 'ticket' },
    { id: 'rewards', label: 'Récompenses', icon: 'gift' },
    { id: 'cinemas', label: 'Nos salles', icon: 'map' },
    { id: 'settings', label: 'Mon compte', icon: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Layout principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* SIDEBAR GAUCHE */}
          <div className="w-full lg:w-96 shrink-0">
            <LeftSidebar 
              points={loyaltyPoints} 
              user={user} 
              totalSpent={totalSpent}
              ticketCount={userBookings.length}
            />
          </div>

          {/* CONTENU DROITE */}
          <div className="flex-1 min-w-0">
            {/* Header + Tabs */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-black text-white">
                    {activeTab === 'tickets' && 'Mes billets'}
                    {activeTab === 'rewards' && 'Récompenses'}
                    {activeTab === 'settings' && 'Mon compte'}
                  </h1>
                  <p className="text-gray-500 mt-1">
                    {activeTab === 'tickets' && `${userBookings.length} réservation(s) dont ${upcomingBookings.length} à venir`}
                    {activeTab === 'rewards' && 'Échange tes points contre des surprises'}
                    {activeTab === 'settings' && 'Gère tes infos perso'}
                  </p>
                </div>
                
                <Link 
                  to="/catalog"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg"
                >
                  🎬 Voir les films
                </Link>
              </div>

              {/* Onglets avec icônes Lucide */}
              <div className="flex gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${
                      activeTab === tab.id 
                        ? 'bg-red-600 text-white' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tab.icon === 'ticket' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>}
                    {tab.icon === 'gift' && <Gift className="w-4 h-4" />}
                    {tab.icon === 'settings' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    {tab.label}
                    {tab.id === 'tickets' && upcomingBookings.length > 0 && (
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                        {upcomingBookings.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Contenu onglets */}
            <AnimatePresence mode="wait">
              {/* Billets */}
              {activeTab === 'tickets' && (
                <motion.div
                  key="tickets"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5"
                >
                  {userBookings.length === 0 ? (
                    <div className="bg-gray-900/50 rounded-3xl p-16 text-center border border-white/5">
                      <div className="w-20 h-20 rounded-full bg-red-600/20 flex items-center justify-center mx-auto mb-6">
                        <Film className="w-10 h-10 text-red-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">Pas encore de billets</h3>
                      <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        Prends un peu de popcorn et va voir un film !
                      </p>
                      <Link 
                        to="/catalog"
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
                        Choisir un film
                      </Link>
                    </div>
                  ) : (
                    userBookings.map((booking, index) => (
                      <TicketItem key={booking.id} booking={booking} onDelete={handleDelete} index={index} />
                    ))
                  )}
                </motion.div>
              )}

              {/* Récompenses */}
              {activeTab === 'rewards' && (
                <motion.div
                  key="rewards"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="bg-gradient-to-r from-amber-600/20 to-amber-500/10 rounded-2xl p-6 mb-8 border border-amber-500/20">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500/30 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Ton solde</p>
                        <p className="text-4xl font-black text-amber-400">{loyaltyPoints.toLocaleString()} <span className="text-lg text-gray-400">pts</span></p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {REWARDS.map((reward, i) => (
                      <RewardCard key={i} reward={reward} points={loyaltyPoints} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Nos salles */}
              {activeTab === 'cinemas' && (
                <motion.div
                  key="cinemas"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-red-600/20 to-red-500/10 rounded-2xl p-6 mb-8 border border-red-500/20">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-red-500/30 flex items-center justify-center">
                        <Globe className="w-8 h-8 text-red-500" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Réseau SENEFLIX</p>
                        <p className="text-3xl font-black text-white">{cinemas.length} <span className="text-lg text-gray-400">salles en Côte d'Ivoire</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Grille de cinémas avec styles différents */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {cinemas.map((cinema, index) => {
                      const style = CINEMA_CARD_STYLES[index % CINEMA_CARD_STYLES.length];
                      return (
                        <motion.div
                          key={cinema.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`bg-gradient-to-b ${style.gradient} rounded-2xl p-6 border ${style.border} hover:scale-[1.02] transition-transform`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div 
                              className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.badge} bg-opacity-20`}
                              style={{ backgroundColor: `${cinema.markerColor}20` }}
                            >
                              <MapPin className="w-6 h-6" style={{ color: cinema.markerColor }} />
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${style.badge} text-white`}>
                              {cinema.mapStyle === 'dark' ? 'Nuit' : cinema.mapStyle === 'satellite' ? 'Satellite' : 'Streets'}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-white mb-2">{cinema.name}</h3>
                          <p className="text-gray-400 text-sm mb-4">{cinema.address}</p>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-300">
                              <Navigation className={`w-4 h-4 ${style.accent}`} />
                              <span>{cinema.city}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span>{cinema.hours}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <span>{cinema.phone}</span>
                            </div>
                          </div>

                          {/* Mini carte */}
                          <div className="mt-4 rounded-xl overflow-hidden h-24 border border-white/10 relative">
                            <CinemaMiniMap cinema={cinema} />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Paramètres */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gray-900/50 rounded-3xl p-8 border border-white/5"
                >
                  <div className="flex items-center gap-5 mb-8 pb-6 border-b border-white/5">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{user?.name || 'Cinéphile'}</h3>
                      <p className="text-gray-400">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                          <User className="w-4 h-4" /> Nom
                        </label>
                        <input 
                          type="text" 
                          defaultValue={user?.name || ''}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-red-600 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4" /> Email
                        </label>
                        <input 
                          type="email" 
                          defaultValue={user?.email || ''}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-red-600 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                        <Bell className="w-4 h-4" /> Notifications
                      </p>
                      <div className="space-y-3">
                        {[
                          { icon: <Mail className="w-5 h-5" />, title: 'Promos par email', desc: 'Offres especiales', checked: true },
                          { icon: <Bell className="w-5 h-5" />, title: 'Rappels', desc: '24h avant ton film', checked: true },
                          { icon: <Gift className="w-5 h-5" />, title: 'Récompenses', desc: 'Quand tu gagnes des points', checked: false },
                        ].map((item, i) => (
                          <label key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="text-gray-400">{item.icon}</span>
                              <div>
                                <p className="font-medium text-white">{item.title}</p>
                                <p className="text-xs text-gray-400">{item.desc}</p>
                              </div>
                            </div>
                            <input type="checkbox" defaultChecked={item.checked} className="w-5 h-5 accent-red-600" />
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-6 flex gap-3">
                      <button className="px-6 py-3 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-colors">
                        Annuler
                      </button>
                      <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors">
                        Sauvegarder
                      </button>
                    </div>
                    
                    <div className="pt-6 border-t border-white/5 mt-6">
                      <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 font-medium transition-colors">
                        <LogOut className="w-4 h-4" /> Se déconnecter
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
