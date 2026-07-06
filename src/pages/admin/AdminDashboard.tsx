import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Ticket, 
  DollarSign, 
  Calendar,
  Film as FilmIcon,
  TrendingUp,
  Clock,
  Award,
  Play,
  ChevronRight,
  Activity,
  BarChart3,
  Star
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAdminFilms } from '../../context/AdminFilmContext';
import { useBookings } from '../../context/BookingContext';

// Animation variants
const cardVariant = {
  hidden: { opacity: 0, y: 60, rotateX: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 }
  }
};

// Stat Card avec design Floating Card
function StatCard({ icon: Icon, label, value, delay, accentColor }: { icon: any; label: string; value: string | number; delay: number; accentColor: string }) {
  return (
    <motion.div
      variants={cardVariant}
      className="group relative"
    >
      {/* Outer glow */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${accentColor} rounded-[1.8rem] blur-lg opacity-0 group-hover:opacity-40 transition-all duration-700`} />
      
      {/* Card */}
      <div className={`relative h-full bg-gradient-to-b from-gray-900/90 to-black/95 border border-white/10 rounded-[1.5rem] p-8 backdrop-blur-xl overflow-hidden`}>
        {/* Animated background gradient */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${accentColor} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}
          animate={{
            background: [
              `linear-gradient(135deg, transparent 0%, transparent 100%)`,
              `linear-gradient(135deg, rgba(220,38,38,0.1) 0%, transparent 100%)`,
              `linear-gradient(135deg, transparent 0%, transparent 100%)`
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Top accent bar */}
        <div className={`absolute top-0 left-8 right-8 h-[3px] bg-gradient-to-r ${accentColor} rounded-full opacity-60`} />
        
        {/* Corner decoration */}
        <div className="absolute top-4 right-4 w-8 h-8">
          <div className={`absolute inset-0 border-2 border-white/10 rounded-xl rotate-45`} />
        </div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${accentColor} flex items-center justify-center shadow-xl`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-xs font-bold text-green-500">+12%</span>
            </div>
          </div>
          
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">{label}</p>
          <p className="text-4xl font-black text-white tracking-tight">{value}</p>
          
          {/* Progress bar */}
          <div className="mt-auto pt-6">
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full bg-gradient-to-r ${accentColor} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ delay: delay + 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Top Movie Card avec poster proéminent
function TopMovieCard({ movie, rank }: { movie: any; rank: number }) {
  const medals = ['🥇', '🥈', '🥉'];
  const borderColors = ['border-amber-500/50', 'border-gray-400/50', 'border-amber-700/50'];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -80, scale: 0.85 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: 0.3 + rank * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ x: 10, transition: { duration: 0.3 } }}
      className="group relative"
    >
      {/* Glow line */}
      <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-16 bg-gradient-to-b ${rank === 0 ? 'from-amber-500 via-amber-400 to-transparent' : 'from-white/30 to-transparent'} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className={`relative flex items-center gap-6 bg-gradient-to-r from-gray-900/80 to-black/90 border ${borderColors[rank]} rounded-2xl p-5 backdrop-blur-sm`}>
        {/* Rank */}
        <div className="flex flex-col items-center justify-center w-16">
          <span className="text-3xl">{medals[rank]}</span>
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider mt-1">Top {rank + 1}</span>
        </div>
        
        {/* Poster */}
        <div className="relative w-16 h-24 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl shadow-black">
          <img 
            src={movie.poster} 
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-black text-lg text-white truncate mb-2">{movie.title}</h4>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              <Ticket className="w-4 h-4 text-red-400" />
              <span className="text-sm font-bold text-white">{movie.count}</span>
            </div>
            <span className="text-xs text-gray-500">réservations</span>
          </div>
        </div>
        
        {/* Arrow */}
        <motion.div
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronRight className="w-6 h-6 text-white/50" />
        </motion.div>
      </div>
    </motion.div>
  );
}

// Recent Film Card - poster uniquement
function RecentFilmCard({ film, index }: { film: any; index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.6, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.08, y: -8 }}
      className="group relative cursor-pointer"
    >
      {/* Glow ring */}
      <div className="absolute -inset-2 bg-gradient-to-br from-red-600/30 to-transparent rounded-[1.2rem] blur-md opacity-0 group-hover:opacity-100 transition-all duration-500" />
      
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
        <img 
          src={film.poster} 
          alt={film.title}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
        {/* Badge */}
        <div className="absolute top-2 left-2">
          <div className="bg-red-600/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-black text-white uppercase tracking-wider">
            Nouveau
          </div>
        </div>
        
        {/* Bottom info - visible on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400 bg-gradient-to-t from-black/95 to-transparent">
          <h4 className="font-black text-sm text-white truncate mb-1">{film.title}</h4>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{film.duration}</span>
          </div>
        </div>
        
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Play className="w-6 h-6 text-white ml-1" />
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Diagonal light streaks */}
        <div className="absolute top-0 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-red-600/5 to-transparent rotate-12 blur-[100px]" />
        <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] bg-gradient-to-tl from-red-500/5 to-transparent -rotate-12 blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[120px]" />
      </div>

      {/* Subtle dot grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative z-10 px-6 py-8 max-w-[1600px] mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-600" />
            <span className="text-red-500 font-black text-xs uppercase tracking-[0.5em]">Administration</span>
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-6xl font-black tracking-tight mb-3">
                <span className="bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">Tableau de </span>
                <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">Bord</span>
              </h1>
              <p className="text-gray-500 text-base font-medium">Vue d'ensemble de votre cinéma</p>
            </div>
            
            {/* Quick actions */}
            <div className="flex items-center gap-3">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white/80 hover:bg-white/10 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Exporter
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10"
        >
          <StatCard 
            icon={Ticket} 
            label="Total des réservations" 
            value={stats.totalBookings}
            delay={0.1}
            accentColor="from-red-600 to-red-500"
          />
          <StatCard 
            icon={DollarSign} 
            label="Revenus totaux" 
            value={`${stats.totalRevenue.toLocaleString()} F`}
            delay={0.2}
            accentColor="from-emerald-600 to-emerald-500"
          />
          <StatCard 
            icon={FilmIcon} 
            label="Films au catalogue" 
            value={stats.totalFilms}
            delay={0.3}
            accentColor="from-purple-600 to-purple-500"
          />
          <StatCard 
            icon={Calendar} 
            label="Séances à venir" 
            value={stats.upcomingBookings}
            delay={0.4}
            accentColor="from-blue-600 to-blue-500"
          />
        </motion.div>

        {/* Main Content - Chart + Top Movies */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
          {/* Graphique principal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="lg:col-span-3 relative group"
          >
            {/* Card glow */}
            <div className="absolute -inset-px bg-gradient-to-r from-red-600/20 via-transparent to-red-600/20 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative bg-gradient-to-b from-gray-900/90 to-black/95 border border-white/10 rounded-[1.5rem] p-8 backdrop-blur-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Activité</h3>
                    <p className="text-gray-500 text-xs font-medium">7 derniers jours</p>
                  </div>
                </div>
                
                {/* Period selector */}
                <div className="flex gap-2">
                  {['Jour', 'Semaine', 'Mois'].map((period, i) => (
                    <button 
                      key={period}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        i === 1 ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Chart */}
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#dc2626" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#1a1a1a" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: '#666', fontSize: 11, fontWeight: 'bold' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: '#666', fontSize: 11, fontWeight: 'bold' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0a0a0a', 
                        border: '1px solid rgba(220,38,38,0.5)',
                        borderRadius: '12px',
                        color: 'white',
                        padding: '12px'
                      }}
                      itemStyle={{ color: '#dc2626', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="réservations" 
                      stroke="#dc2626" 
                      strokeWidth={3}
                      fill="url(#areaGradient)" 
                      activeDot={{ r: 8, fill: '#dc2626', stroke: '#000', strokeWidth: 3 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Top 3 Films */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="lg:col-span-2 relative group"
          >
            <div className="absolute -inset-px bg-gradient-to-b from-amber-500/20 via-transparent to-transparent rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative h-full bg-gradient-to-b from-gray-900/90 to-black/95 border border-white/10 rounded-[1.5rem] p-8 backdrop-blur-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <Award className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Top Films</h3>
                  <p className="text-gray-500 text-xs font-medium">Les plus populaires</p>
                </div>
              </div>
              
              {/* Films list */}
              <div className="space-y-4">
                {topMovies.length === 0 ? (
                  <div className="text-center py-12 bg-white/5 rounded-2xl">
                    <FilmIcon className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                    <p className="text-sm font-bold text-gray-500">Aucune donnée</p>
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
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="relative group"
        >
          <div className="absolute -inset-px bg-gradient-to-r from-purple-500/20 via-transparent to-purple-500/20 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative bg-gradient-to-b from-gray-900/90 to-black/95 border border-white/10 rounded-[1.5rem] p-8 backdrop-blur-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Films Récents</h3>
                  <p className="text-gray-500 text-xs font-medium">Derniers ajoutés au catalogue</p>
                </div>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white/80 hover:bg-white/10 transition-colors"
              >
                Voir tout
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
            
            {/* Films grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {films.length === 0 ? (
                <div className="col-span-full text-center py-16 bg-white/5 rounded-2xl">
                  <FilmIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-base font-bold text-gray-500">Aucun film dans le catalogue</p>
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
    </div>
  );
}
