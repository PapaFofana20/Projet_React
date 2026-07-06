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
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAdminFilms } from '../../context/AdminFilmContext';
import { useBookings } from '../../context/BookingContext';

function StatCard({ 
  icon: Icon, 
  label, 
  value,
  delay,
  color
}: { 
  icon: any; 
  label: string; 
  value: string | number; 
  delay: number;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all duration-500"
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
        <p className="text-gray-500 text-sm uppercase tracking-widest mb-2">{label}</p>
        <p className="text-4xl font-black text-white">{value}</p>
      </div>
    </motion.div>
  );
}

function TopMovieCard({ movie, rank }: { movie: any; rank: number }) {
  const rankStyles = [
    { bg: 'bg-red-600', border: 'border-red-500', text: 'text-red-500' },
    { bg: 'bg-white/10', border: 'border-white/20', text: 'text-white' },
    { bg: 'bg-white/5', border: 'border-white/10', text: 'text-white' },
  ];
  const style = rankStyles[rank];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + rank * 0.15 }}
      className={`group bg-gradient-to-r from-gray-900 to-black rounded-2xl p-5 border ${style.border} flex items-center gap-5`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl bg-black border ${style.border}`}>
        {rank + 1}
      </div>
      
      <div className="w-20 h-28 rounded-xl overflow-hidden border border-white/10 shadow-xl">
        <img 
          src={movie.poster} 
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="flex-1">
        <h4 className="font-black text-xl text-white mb-2 truncate">{movie.title}</h4>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-red-600/20 px-3 py-1 rounded-full">
            <Ticket className="w-4 h-4 text-red-500" />
            <span className="text-sm font-bold text-red-400">{movie.count}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RecentFilmCard({ film, index }: { film: any; index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7 + index * 0.08 }}
      className="group relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
    >
      <img 
        src={film.poster} 
        alt={film.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h4 className="text-white font-black truncate mb-2">{film.title}</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Clock className="w-4 h-4" />
            <span className="font-bold">{film.duration}</span>
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white px-8 py-10">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="h-10 w-2 bg-red-600 rounded-full" />
          <p className="text-red-500 font-bold uppercase tracking-widest">SENEFILIX ADMIN</p>
        </div>
        <h1 className="text-6xl font-black mb-3">
          <span className="text-white">Tableau de bord</span> <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">GLOBAL</span>
        </h1>
        <p className="text-gray-400 text-xl">Suivez en temps réel les performances de votre cinéma</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        <StatCard 
          icon={Ticket} 
          label="Total des réservations" 
          value={stats.totalBookings}
          delay={0.1}
          color="bg-red-600"
        />
        <StatCard 
          icon={DollarSign} 
          label="Revenus totaux" 
          value={`${stats.totalRevenue.toLocaleString()} FCFA`}
          delay={0.2}
          color="bg-white/10"
        />
        <StatCard 
          icon={FilmIcon} 
          label="Films au catalogue" 
          value={stats.totalFilms}
          delay={0.3}
          color="bg-red-600/70"
        />
        <StatCard 
          icon={Calendar} 
          label="Séances à venir" 
          value={stats.upcomingBookings}
          delay={0.4}
          color="bg-white/5"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Graphique des réservations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/5 rounded-3xl p-8"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-3xl font-black text-white flex items-center gap-4">
                  <div className="p-3 bg-red-600/20 rounded-xl">
                    <TrendingUp className="w-7 h-7 text-red-500" />
                  </div>
                  Évolution des réservations
                </h3>
                <p className="text-gray-500 mt-3 text-lg">Activité sur les 7 derniers jours</p>
              </div>
            </div>
            
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorResa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#333" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 14, fontWeight: 'bold' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 14, fontWeight: 'bold' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#000', 
                      border: '2px solid #dc2626',
                      borderRadius: '16px',
                      color: 'white',
                      padding: '16px'
                    }}
                    itemStyle={{ color: '#dc2626', fontWeight: 'black', fontSize: '18px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="réservations" 
                    stroke="#dc2626" 
                    strokeWidth={5}
                    fill="url(#colorResa)" 
                    activeDot={{ r: 10, fill: '#dc2626', stroke: '#000', strokeWidth: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Top 3 Films */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/5 rounded-3xl p-8"
        >
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-3xl font-black text-white mb-8">Top 3 des films</h3>
            
            <div className="flex-1 space-y-5">
              {topMovies.length === 0 ? (
                <div className="text-center py-16 text-gray-500 bg-white/5 rounded-2xl">
                  <FilmIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-sm font-bold uppercase tracking-wider">Aucune donnée disponible</p>
                </div>
              ) : (
                topMovies.map((movie, index) => (
                  <TopMovieCard key={movie.title} movie={movie} rank={index} />
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Films Récents */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/5 rounded-3xl p-8"
      >
        <div className="absolute left-1/2 bottom-0 w-96 h-32 bg-red-600/10 rounded-full blur-3xl -translate-x-1/2" />
        <div className="relative z-10">
          <h3 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
            <FilmIcon className="w-7 h-7 text-red-600" />
            Derniers films ajoutés
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {films.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-500 bg-white/5 rounded-2xl">
                <FilmIcon className="w-24 h-24 mx-auto mb-6 opacity-30" />
                <p className="text-xl font-bold uppercase tracking-wider">Catalogue vide</p>
              </div>
            ) : (
              films.slice(0, 6).map((film, index) => (
                <RecentFilmCard key={film.id} film={film} index={index} />
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
