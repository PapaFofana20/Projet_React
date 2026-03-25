import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Star, Info, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

import { movies } from '../data/movies';

const getMovie = (id: string | undefined) => {
  return movies.find(m => m.id.toString() === id) || movies[0];
};

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const movie = getMovie(id);

  const handleBooking = () => {
    if (isAuthenticated) {
      navigate(`/book/${id}/seats`);
    } else {
      navigate('/login', { state: { message: 'Veuillez vous connecter pour réserver vos billets' } });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-[50vh] relative">
        <div className="absolute inset-0">
          <img 
            src={movie.image} 
            alt={movie.title} 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-transparent"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10 w-full mb-20">
        <div className="flex flex-col md:flex-row gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full md:w-1/3 lg:w-1/4 shrink-0 px-4 md:px-0"
          >
            <div className="rounded-xl overflow-hidden shadow-2xl border border-dark-700">
              <img src={movie.poster} alt={movie.title} className="w-full h-auto" />
            </div>
            
            <button 
              onClick={handleBooking}
              className="mt-6 w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/30 text-base sm:text-lg"
            >
              <Ticket className="w-5 h-5 relative -top-0.5" />
              Réserver des Billets
            </button>
          </motion.div>

          <div className="flex-grow pt-4 md:pt-12">
            <motion.h1 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              {movie.title}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap items-center gap-4 text-sm font-medium mb-8"
            >
              <span className="flex items-center gap-1.5 bg-yellow-400/10 text-yellow-400 px-3 py-1.5 rounded-full border border-yellow-400/20">
                <Star className="w-4 h-4 fill-current" />
                Note {movie.rating}
              </span>
              <span className="flex items-center gap-1.5 bg-dark-800 text-gray-300 px-3 py-1.5 rounded-full border border-dark-700">
                <Clock className="w-4 h-4 text-brand-500" />
                {movie.duration}
              </span>
              <span className="flex items-center gap-1.5 bg-dark-800 text-gray-300 px-3 py-1.5 rounded-full border border-dark-700">
                <Info className="w-4 h-4 text-brand-500" />
                {movie.genre}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-3">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed text-lg mb-8 max-w-3xl">
                {movie.description}
              </p>

              <div className="grid grid-cols-2 gap-6 max-w-lg">
                <div>
                  <h3 className="text-gray-400 text-sm font-medium mb-1">Réalisateur</h3>
                  <p className="font-semibold text-white">{movie.director}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm font-medium mb-1">Date de Sortie</h3>
                  <p className="font-semibold text-white">28 Fév 2026</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}

