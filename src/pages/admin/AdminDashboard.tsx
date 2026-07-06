import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Ticket, 
  DollarSign, 
  Calendar,
  Film as FilmIcon,
  TrendingUp,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAdminFilms } from '../../context/AdminFilmContext';
import { useBookings } from '../../context/BookingContext';

function StatCard({ 
  icon: Icon, 
  label, 
  value,
  delay
}: { 
  icon: any; 
  label: string; 
  value: string | number; 
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="bg-black border border-white/10 rounded-2xl p-6 hover:border-red-600/60 transition-all duration-300"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-black text-white">{value}</p>
    </motion.div>
  );
}

function TopMovieCard({ movie, rank }: { movie: any; rank: number }) {
  const isTop1 = rank === 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + rank * 0.1 }}
      className={`bg-black rounded-2xl p-4 border ${isTop1 ? 'border-red-600' : 'border-white/10'} flex items-center gap-4`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl ${isTop1 ? 'bg-red-600 text-white' : 'bg-white/10 text-white'}`}>
        {rank + 1}
      </div>
      
      <div className="w-16 h-20 rounded-lg overflow-hidden border border-white/20">
        <img 
          src={movie.poster} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1">
        <h4 className="font-bold text-lg text-white truncate">{movie.title}</h4>
        <div className="flex items-center gap-2 mt-1">
          <Ticket className="w-4 h-4 text-red-500" />
          <p className="text-sm text-gray-400">{movie.count} réservations</p>
        </div>
      </div>
    </motion.div>
  );
}

function RecentFilmCard({ film, index }: { film: any; index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 + index * 0.05 }}
      className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/10"
    >
      <img 
        src={film.poster} 
        alt={film.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h4 className="text-white font-bold truncate">{film.title}</h4>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-300">
          <Clock className="w-3 h-3" />
          <span>{film.duration}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { films } = useAdminFilms();
  const { bookings } = useBookings();
  
  // Calcul des statistiques
  const stats = useMemo(() => {
    const totalRevenue = bookings.reduce((sum: number, b: { totalPrice: number }) => sum + b.totalPrice, 0);
    const upcomingBookings = bookings.filter((b: { status: string }) => b.status === 'upcoming').length;
    
    return {
      totalBookings: bookings.length,
      totalRevenue,
      upcomingBookings,
      totalFilms: films.length,
    };
  }, [bookings, films]);

  // Top 3 films les plus réservés
  const topMovies = useMemo(() => {
    const counts: { [key: string]: { count: number; title: string; poster: string } } = {};
    bookings.forEach((booking: any) => {
      if (!counts[booking.movieTitle]) {
        counts[booking.movieTitle] = { 
          count: 0, 
          title: booking.movieTitle, 
          poster: booking.moviePoster 
        };
      }
      counts[booking.movieTitle].count++;
    });
    
    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [bookings]);

  // Données du graphique des 7 derniers jours
  const chartData = useMemo(() => {
    const days: { [key: string]: number } = {};
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      last7Days.push(key);
      days[key] = 0;
    }
    
    bookings.forEach((booking: any) => {
      const date = new Date(booking.createdAt);
      const key = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      if (days[key] !== undefined) {
        days[key]++;
      }
    });
    
    return last7Days.map(day => ({
      name: day,
      réservations: days[day] || 0
    }));
  }, [bookings]);

  return (
    <div className="bg-black min-h-screen text-white p-8 pb-16">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-5xl font-black mb-2">
          <span className="text-white">Tableau de bord</span> <span className="text-red-600">Admin</span>
        </h1>
        <p className="text-gray-400 text-lg">Aperçu de toutes vos activités</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <StatCard 
          icon={Ticket} 
          label="Total des réservations" 
          value={stats.totalBookings}
          delay={0.1}
        />
        <StatCard 
          icon={DollarSign} 
          label="Revenus totaux" 
          value={`${stats.totalRevenue.toLocaleString()} FCFA`}
          delay={0.2}
        />
        <StatCard 
          icon={FilmIcon} 
          label="Films au catalogue" 
          value={stats.totalFilms}
          delay={0.3}
        />
        <StatCard 
          icon={Calendar} 
          label="Séances à venir" 
          value={stats.upcomingBookings}
          delay={0.4}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Graphique des réservations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-black border border-white/10 rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-red-600" />
                Graphique des réservations
              </h3>
              <p className="text-gray-500 mt-1">7 derniers jours</p>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#888', fontSize: 12, fontWeight: 500 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#888', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000', 
                    border: '1px solid #dc2626',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  itemStyle={{ color: '#dc2626', fontWeight: 'bold' }}
                />
                <Bar 
                  dataKey="réservations" 
                  fill="#dc2626" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top 3 Films */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-black border border-white/10 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Top 3 films les plus réservés</h3>
          
          <div className="space-y-4">
            {topMovies.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-white/5 rounded-xl">
                <FilmIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm uppercase tracking-wider">Aucune donnée</p>
              </div>
            ) : (
              topMovies.map((movie, index) => (
                <TopMovieCard key={movie.title} movie={movie} rank={index} />
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Films Récents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-black border border-white/10 rounded-2xl p-8"
      >
        <h3 className="text-2xl font-bold text-white mb-6">Films récents</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {films.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-500 bg-white/5 rounded-xl">
              <FilmIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-bold uppercase tracking-wider">Catalogue vide</p>
            </div>
          ) : (
            films.slice(0, 6).map((film, index) => (
              <RecentFilmCard key={film.id} film={film} index={index} />
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
