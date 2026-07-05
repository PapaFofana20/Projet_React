import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Ticket, 
  DollarSign, 
  Calendar,
  Film as FilmIcon,
  Crown,
  TrendingUp,
  Star
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden bg-[#0a0a0a] backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-red-600/50 transition-all duration-300 group shadow-lg"
    >
      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity bg-red-600" />
      <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full blur-3xl opacity-5 bg-white" />
      
      <div className="flex items-center gap-5 relative z-10">
        <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center bg-[#111] border border-white/5 group-hover:border-red-600/30 group-hover:scale-110 transition-transform duration-300 shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Icon className="w-7 h-7 text-white group-hover:text-red-500 transition-colors relative z-10" />
        </div>
        <div className="flex-1">
          <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-1">{label}</p>
          <p className="text-3xl font-black text-white">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

function TopMovieCard({ movie, rank }: { movie: any; rank: number }) {
  // Styles unifiés Noir/Rouge/Blanc au lieu des médailles or/argent/bronze
  const rankStyles = rank === 0 
    ? { border: 'border-red-600', text: 'text-red-600', glow: 'bg-red-600/20' }
    : { border: 'border-white/20', text: 'text-white', glow: 'bg-white/5' };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + rank * 0.1 }}
      className={`relative overflow-hidden bg-[#0a0a0a] rounded-2xl p-4 border flex items-center gap-4 hover:bg-[#111] transition-colors group ${rank === 0 ? 'border-red-600/50' : 'border-white/10'}`}
    >
      {rank === 0 && (
        <div className="absolute -left-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 bg-red-600" />
      )}
      
      <div className={`z-10 w-12 h-12 rounded-full flex items-center justify-center font-black text-xl border-2 shadow-lg transition-transform group-hover:scale-110 ${rankStyles.border} ${rankStyles.text} bg-black`}>
        {rank + 1}
      </div>
      
      <div className="z-10 w-16 h-20 rounded-lg overflow-hidden shrink-0 shadow-lg border border-white/10">
        <img 
          src={movie.poster} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="z-10 flex-1 min-w-0">
        <h4 className="font-bold text-lg text-white truncate">{movie.title}</h4>
        <div className="flex items-center gap-2 mt-1">
          <Ticket className="w-4 h-4 text-red-600" />
          <p className="text-sm font-bold text-gray-400">{movie.count} réservations</p>
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
      className="group relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer shadow-2xl border border-white/10"
    >
      <img 
        src={film.poster} 
        alt={film.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
      
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        {film.isNew && (
          <span className="inline-block bg-red-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded-full mb-2 tracking-widest">
            NOUVEAU
          </span>
        )}
        <h4 className="text-white text-base font-bold truncate mb-2">{film.title}</h4>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-white text-xs font-bold bg-white/10 px-2 py-1 rounded-lg backdrop-blur-md">
            <Star className="w-3.5 h-3.5 text-red-600 fill-red-600" />
            {film.rating}
          </span>
          <span className="text-gray-300 text-xs font-bold bg-white/10 px-2 py-1 rounded-lg backdrop-blur-md">
            {film.duration}
          </span>
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
      const key = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
      last7Days.push(key);
      days[key] = 0;
    }
    
    bookings.forEach((booking: any) => {
      const date = new Date(booking.createdAt);
      const key = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
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
    <div className="space-y-10 pb-12 bg-black min-h-screen text-white">
      {/* Header with animated text */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative border-b border-red-600/30 pb-6"
      >
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <h1 className="relative z-10 text-4xl lg:text-5xl font-black uppercase tracking-wider text-white">
          Tableau de Bord <span className="text-red-600">Admin</span>
        </h1>
        <p className="relative z-10 text-gray-400 mt-2 text-sm font-bold uppercase tracking-widest">
          Aperçu global des performances
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">
        <StatCard 
          icon={Ticket} 
          label="Total Réservations" 
          value={stats.totalBookings}
          delay={0.1}
        />
        <StatCard 
          icon={DollarSign} 
          label="Revenus Totaux" 
          value={`${stats.totalRevenue.toLocaleString()} FCFA`}
          delay={0.2}
        />
        <StatCard 
          icon={FilmIcon} 
          label="Films au Catalogue" 
          value={stats.totalFilms}
          delay={0.3}
        />
        <StatCard 
          icon={Calendar} 
          label="Séances à Venir" 
          value={stats.upcomingBookings}
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Graphique des réservations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 relative overflow-hidden bg-[#0a0a0a] rounded-3xl p-8 border border-white/10 shadow-2xl"
        >
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black text-white flex items-center gap-3 uppercase">
                <TrendingUp className="w-6 h-6 text-red-600" />
                Évolution des Réservations
              </h3>
              <p className="text-gray-500 font-medium mt-1">Données des 7 derniers jours</p>
            </div>
            <div className="bg-red-600/10 border border-red-600 text-red-500 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Tendance
            </div>
          </div>
          
          <div className="h-80 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorResa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 'bold' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 'bold' }}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000000', 
                    border: '1px solid #dc2626',
                    borderRadius: '12px',
                    color: 'white',
                    boxShadow: '0 0 20px rgba(220, 38, 38, 0.2)'
                  }}
                  itemStyle={{ color: '#dc2626', fontWeight: '900' }}
                  formatter={(value) => [`${value} réservations`, '']}
                  labelStyle={{ color: '#9CA3AF', marginBottom: '4px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="réservations" 
                  stroke="#dc2626" 
                  strokeWidth={4}
                  fill="url(#colorResa)" 
                  activeDot={{ r: 6, fill: '#dc2626', stroke: '#000000', strokeWidth: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top 3 Films */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="relative overflow-hidden bg-[#0a0a0a] rounded-3xl p-8 border border-white/10 shadow-2xl flex flex-col"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 mb-8">
            <h3 className="text-2xl font-black text-white flex items-center gap-3 uppercase">
              <Crown className="w-6 h-6 text-white" />
              Top 3 Films
            </h3>
            <p className="text-gray-500 font-medium mt-1">Les plus réservés de la semaine</p>
          </div>
          
          <div className="relative z-10 space-y-4 flex-1 flex flex-col justify-center">
            {topMovies.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-[#111] rounded-2xl border border-white/5">
                <FilmIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-wider">Aucune donnée</p>
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
        className="relative overflow-hidden bg-[#0a0a0a] rounded-3xl p-8 border border-white/10 shadow-2xl mt-12"
      >
        <div className="absolute left-1/2 bottom-0 w-1/2 h-40 bg-red-600/5 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-white/10 pb-6">
          <div>
            <h3 className="text-2xl font-black text-white flex items-center gap-3 uppercase">
              <FilmIcon className="w-6 h-6 text-red-600" />
              Films Récents
            </h3>
            <p className="text-gray-500 font-medium mt-1">Derniers ajouts au catalogue SENEFLIX</p>
          </div>
        </div>
        
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {films.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-[#111] rounded-2xl border border-white/5">
              <FilmIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg text-gray-500 font-bold uppercase tracking-wider">Catalogue vide</p>
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
