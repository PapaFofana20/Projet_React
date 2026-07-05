import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Crown, Film as FilmIcon } from 'lucide-react';
import { useBookings } from '../../context/BookingContext';
import { useAdminFilms } from '../../context/AdminFilmContext';
import BookingsChart from '../../components/admin/BookingsChart';
import TopMoviesChart from '../../components/admin/TopMoviesChart';

export default function AdminAnalytics() {
  const { bookings } = useBookings();
  const { films } = useAdminFilms();
  
  const calculatedStats = useMemo(() => {
    const totalRevenue = bookings.reduce((sum: number, b: { totalPrice: number }) => sum + b.totalPrice, 0);
    const uniqueMovies = new Set(bookings.map((b: { movieTitle: string }) => b.movieTitle)).size;
    
    return {
      totalRevenue,
      avgTicketPrice: bookings.length > 0 ? Math.round(totalRevenue / bookings.length) : 0,
      uniqueMovies,
      totalBookings: bookings.length,
      occupancyRate: bookings.length > 0 && films.length > 0 ? Math.round((bookings.length / (films.length * 50)) * 100) : 0
    };
  }, [bookings, films]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Analyses Détaillées</h1>
        <p className="text-gray-400 mt-1">Statistiques et performances de la plateforme</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800 rounded-2xl p-6 border border-dark-700"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Prix Moyen</p>
              <p className="text-2xl font-bold text-white">{calculatedStats.avgTicketPrice.toLocaleString()} FCFA</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Par billet vendu</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-800 rounded-2xl p-6 border border-dark-700"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <FilmIcon className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Films Uniques</p>
              <p className="text-2xl font-bold text-white">{calculatedStats.uniqueMovies}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Films réservés</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-800 rounded-2xl p-6 border border-dark-700"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Crown className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Taux d'Occupation</p>
              <p className="text-2xl font-bold text-white">{calculatedStats.occupancyRate}%</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Basé sur 50 places/film</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingsChart bookings={bookings} />
        <TopMoviesChart bookings={bookings} />
      </div>

      {/* Revenue Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-800 rounded-2xl p-6 border border-dark-700"
      >
        <h3 className="text-lg font-bold text-white mb-6">Résumé des Revenus</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-dark-900 rounded-xl">
            <p className="text-3xl font-bold text-green-500">{calculatedStats.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-400 mt-2">Revenus Totaux (FCFA)</p>
          </div>
          <div className="text-center p-4 bg-dark-900 rounded-xl">
            <p className="text-3xl font-bold text-red-500">{calculatedStats.totalBookings}</p>
            <p className="text-sm text-gray-400 mt-2">Réservations Totales</p>
          </div>
          <div className="text-center p-4 bg-dark-900 rounded-xl">
            <p className="text-3xl font-bold text-blue-500">{films.length}</p>
            <p className="text-sm text-gray-400 mt-2">Films au Catalogue</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
