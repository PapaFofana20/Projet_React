import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Crown, Film as FilmIcon } from 'lucide-react';

interface TopMoviesChartProps {
  bookings: any[];
}

export default function TopMoviesChart({ bookings }: TopMoviesChartProps) {
  const topMovies = useMemo(() => {
    const counts: { [key: string]: { count: number; title: string; poster: string } } = {};
    bookings.forEach(booking => {
      if (!counts[booking.movieTitle]) {
        counts[booking.movieTitle] = { count: 0, title: booking.movieTitle, poster: booking.moviePoster };
      }
      counts[booking.movieTitle].count++;
    });
    
    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((movie, index) => ({
        ...movie,
        rank: index + 1
      }));
  }, [bookings]);

  const COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

  return (
    <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
        <Crown className="w-5 h-5 text-yellow-500" />
        Top 3 Films les Plus Réservés
      </h3>
      
      {topMovies.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FilmIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Aucune donnée disponible</p>
        </div>
      ) : (
        <div className="space-y-4">
          {topMovies.map((movie, index) => (
            <motion.div
              key={movie.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 bg-dark-900 rounded-xl"
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                style={{ backgroundColor: COLORS[index], color: index === 0 ? '#000' : '#fff' }}
              >
                {index + 1}
              </div>
              <img 
                src={movie.poster} 
                alt={movie.title}
                className="w-12 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-white text-sm">{movie.title}</h4>
                <p className="text-xs text-gray-400">{movie.count} réservations</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-red-500">{movie.count}</p>
                <p className="text-[10px] text-gray-500">billets</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
