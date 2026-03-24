import { useState } from 'react';
import { Calendar, Clock, MapPin, QrCode, Ticket, Trash2, TrendingUp, Award, Wallet, Heart, CreditCard, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import CircularChart, { MultiDoughnut } from '../components/CircularChart';
import ActivityChart from '../components/ActivityChart';
import { useAuth } from '../context/AuthContext';

const INITIAL_BOOKINGS = [
  {
    id: "B-10492",
    movieTitle: "Dune: Deuxième Partie",
    date: "22 Mars 2026",
    time: "19:30",
    cinema: "Cinéma Pathé",
    seats: ["J12", "J13"],
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop"
  },
  {
    id: "B-09281",
    movieTitle: "Oppenheimer",
    date: "15 Février 2026",
    time: "18:00",
    cinema: "Cinéma Awa",
    seats: ["E05"],
    status: "past",
    image: "https://images.unsplash.com/photo-1461360228754-6e81c478dc88?q=80&w=2076&auto=format&fit=crop"
  },
  {
    id: "B-11053",
    movieTitle: "Festival de Musique d'Été",
    date: "05 Juillet 2026",
    time: "21:00",
    cinema: "Stade Olympique",
    seats: ["VIP-A2"],
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1459749411177-042180ce673f?q=80&w=2070&auto=format&fit=crop"
  }
];

const GENRE_DATA = [
  { label: "Action", value: 12, color: "#E50914" },
  { label: "S-F", value: 8, color: "#B20710" },
  { label: "Concerts", value: 5, color: "#555555" },
  { label: "Autre", value: 3, color: "#333333" }
];

const STATUS_DATA = [
  { label: "À venir", value: 2, color: "#E50914" },
  { label: "Passé", value: 1, color: "#333333" },
  { label: "Annulé", value: 0, color: "#000000" }
];


const ACTIVITY_DATA = [12, 19, 15, 22, 18, 25, 30];
const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jui", "Jul"];

export default function DashboardPage() {
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const { user } = useAuth();

  const handleDelete = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full bg-black min-h-screen text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 italic">
            Centre de <span className="text-brand-500">Commande</span>
          </h1>
          <p className="text-gray-400">Bon retour, {user?.name.split(' ')[0] || 'Nom'}. Voici l'aperçu de votre activité cinéma.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-4 flex items-center gap-3">
            <Wallet className="w-6 h-6 text-brand-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Solde</p>
              <p className="text-lg font-bold">675 FCFA</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Réservations", value: "48", icon: Ticket, sub: "+12% ce mois", color: "brand-500" },
          { label: "Points Fidélité", value: "450", icon: Award, sub: "Niveau Élite", color: "brand-500" },
          { label: "Économies Annuelles", value: "152500 FCFA", icon: CreditCard, sub: "-5% vs an dernier", color: "brand-500" },
          { label: "Statut Actif", value: "En ligne", icon: Zap, sub: "Série : 12j", color: "brand-500" }
        ].map((card, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-dark-800 rounded-2xl p-6 border border-dark-700 hover:border-brand-500/50 transition-colors group"
          >
            <div className="flex justify-between items-start mb-4">
               <div className={`p-3 bg-brand-500/10 rounded-xl text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-all`}>
                  <card.icon className="w-6 h-6" />
               </div>
               <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest">{card.sub}</span>
            </div>
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{card.label}</h4>
            <p className="text-3xl font-black uppercase italic">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-4 space-y-8">
          
          <div className="bg-dark-800 rounded-3xl p-8 border border-dark-700 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-500/20 transition-all" />
            <div className="relative z-10 flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-900 rounded-full flex items-center justify-center text-2xl font-black border-4 border-dark-800 shadow-xl">
                {user?.name.charAt(0).toUpperCase() || 'N'}
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{user?.name || 'Nom'}</h2>
                <div className="flex items-center gap-2 text-brand-500 text-sm font-bold uppercase tracking-widest">
                  <Award className="w-4 h-4" />
                  Membre Élite
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <CircularChart 
                 value={450} 
                 total={500} 
                 label="Points de Fidélité" 
                 subLabel="Prochain Niveau" 
                 size={100} 
                 strokeWidth={8}
               />
                <CircularChart 
                  value={bookings.length} 
                  total={20} 
                  label="Objectif Annuel" 
                  subLabel="Billets" 
                  size={100} 
                  strokeWidth={8}
                  color="#E50914"
                />
            </div>
          </div>

          <div className="bg-dark-800 rounded-3xl p-8 border border-dark-700">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-brand-500" />
              Distribution des Genres
            </h3>
            <MultiDoughnut data={GENRE_DATA} centerLabel="Genre Préféré: Action" />
          </div>

          <div className="bg-dark-800 rounded-3xl p-8 border border-dark-700">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-500" />
              Statut des Réservations
            </h3>
            <MultiDoughnut data={STATUS_DATA} size={140} centerLabel="Taux de Réussite: 95%" />
          </div>

        </div>

        <div className="lg:col-span-8 space-y-8">
          
          <h2 className="text-2xl font-bold mb-6">Activité Mensuelle</h2>
          <ActivityChart data={ACTIVITY_DATA} labels={MONTHS} />

          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Ticket className="w-8 h-8 text-brand-500" />
              Prochaines Réservations
            </h2>
            <button className="text-brand-500 text-sm font-bold uppercase tracking-widest hover:underline">
              Voir l'historique
            </button>
          </div>
          
          <div className="space-y-6">
            {bookings.length === 0 ? (
              <div className="text-center py-20 bg-dark-800 rounded-3xl border-2 border-dashed border-dark-700">
                <Ticket className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-500 italic uppercase">No Missions Scheduled</h3>
                <button className="mt-6 bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-brand-500/20">
                   Book Now
                </button>
              </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                {bookings.map((booking, idx) => (
                        <motion.div 
                            key={booking.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.15 }}
                            className={`group bg-dark-800 rounded-3xl overflow-hidden border-2 transition-all hover:scale-[1.01] ${booking.status === 'upcoming' ? 'border-brand-500/30 hover:border-brand-500 shadow-lg shadow-brand-500/5' : 'border-dark-700 opacity-60'} flex flex-col lg:flex-row h-full`}
                        >
                            <div className={`w-full h-2 lg:h-auto lg:w-3 ${booking.status === 'upcoming' ? 'bg-brand-500' : 'bg-dark-600'}`} />
                            
                            <div className="p-8 flex-grow">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${booking.status === 'upcoming' ? 'bg-brand-500 text-white' : 'bg-dark-600 text-gray-400'}`}>
                                    {booking.status}
                                </span>
                                <h3 className="text-3xl font-black mt-3 uppercase italic leading-none">{booking.movieTitle}</h3>
                                <div className="mt-2 text-xs font-mono text-gray-500 uppercase tracking-widest">
                                    Ref: <span className="text-gray-300">#{booking.id}</span>
                                </div>
                                </div>
                                <button 
                                onClick={() => handleDelete(booking.id)}
                                className="p-3 text-gray-600 hover:text-accent-500 hover:bg-accent-500/10 rounded-2xl transition-all"
                                title="Abort mission"
                                >
                                <Trash2 className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 p-4 bg-dark-900/50 rounded-2xl border border-dark-700">
                                <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Date</p>
                                <div className="flex items-center gap-2 text-sm font-bold">
                                    <Calendar className="w-4 h-4 text-accent-500" />
                                    {booking.date}
                                </div>
                                </div>
                                <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Heure</p>
                                <div className="flex items-center gap-2 text-sm font-bold">
                                    <Clock className="w-4 h-4 text-accent-500" />
                                    {booking.time}
                                </div>
                                </div>
                                <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Sièges</p>
                                <div className="flex items-center gap-2 text-sm font-bold">
                                    <Award className="w-4 h-4 text-accent-500" />
                                    {booking.seats.join(', ')}
                                </div>
                                </div>
                                <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Lieu</p>
                                <div className="flex items-center gap-2 text-sm font-bold truncate">
                                    <MapPin className="w-4 h-4 text-accent-500" />
                                    {booking.cinema}
                                </div>
                                </div>
                            </div>
                            </div>
                            
                            <div className="bg-dark-900 p-8 lg:w-60 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-dark-700 border-dashed relative">
                            <div className="absolute -top-3 -left-3 w-6 h-6 bg-dark-900 rounded-full hidden lg:block" />
                            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-dark-900 rounded-full hidden lg:block" />
                            
                            <div className="bg-white p-3 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                <QrCode className="w-24 h-24 text-black" />
                            </div>
                            <button className="text-xs font-black uppercase tracking-widest text-brand-500 hover:text-accent-500 transition-colors">
                                Billet Digital
                            </button>
                            </div>
                        </motion.div>
                ))}
                </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}


