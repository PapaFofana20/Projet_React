import { motion } from 'framer-motion';
import { X, Star, Clock, MapPin } from 'lucide-react';
import { type Film } from '../../context/AdminFilmContext';

interface FilmDetailsModalProps {
  film: Film;
  onClose: () => void;
}

export default function FilmDetailsModal({ film, onClose }: FilmDetailsModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-dark-800 rounded-2xl w-full max-w-2xl border border-dark-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img src={film.poster} alt={film.title} className="w-full h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex gap-2 mb-2">
              {film.isNew && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">NOUVEAU</span>
              )}
              {film.isExclusive && (
                <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">EXCLUSIF</span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white">{film.title}</h2>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-6 text-sm">
            <span className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              {film.rating}/10
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <Clock className="w-4 h-4" />
              {film.duration}
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <MapPin className="w-4 h-4" />
              {film.cinema}
            </span>
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-1">Genre</p>
            <p className="text-white">{film.genre}</p>
          </div>

          {film.director && (
            <div>
              <p className="text-gray-400 text-sm mb-1">Réalisateur</p>
              <p className="text-white">{film.director}</p>
            </div>
          )}

          <div>
            <p className="text-gray-400 text-sm mb-1">Description</p>
            <p className="text-white">{film.description}</p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-dark-700">
            <span className="text-2xl font-bold text-red-500">
              {film.price.toLocaleString()} FCFA
            </span>
            <span className="text-xs text-gray-500">
              Ajouté le {new Date(film.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
