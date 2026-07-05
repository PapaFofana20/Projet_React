import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Eye,
  Star,
  Clock,
  MapPin,
  Film as FilmIcon
} from 'lucide-react';
import { useAdminFilms, type Film } from '../../context/AdminFilmContext';
import FilmModal from '../../components/admin/FilmModal';
import FilmDetailsModal from '../../components/admin/FilmDetailsModal';

function FilmsGrid({ films, onEdit, onDelete, onView }: { 
  films: Film[]; 
  onEdit: (film: Film) => void;
  onDelete: (id: number) => void;
  onView: (film: Film) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');

  const filteredFilms = films.filter(film => {
    const matchesSearch = film.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === 'all' || film.genre.toLowerCase().includes(genreFilter.toLowerCase());
    return matchesSearch && matchesGenre;
  });

  const genres = [...new Set(films.flatMap((f: Film) => f.genre.split('/').map((g: string) => g.trim())))];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher un film..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-800 border border-dark-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="bg-dark-800 border border-dark-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="all">Tous les genres</option>
          {genres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>

      {/* Films Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFilms.map((film) => (
          <motion.div
            key={film.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden hover:border-red-500/30 transition-all"
          >
            <div className="relative aspect-[2/3]">
              <img 
                src={film.poster} 
                alt={film.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {film.isNew && (
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    NOUVEAU
                  </span>
                )}
                {film.isExclusive && (
                  <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                    EXCLUSIF
                  </span>
                )}
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 px-2 py-1 rounded-full">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-white text-xs font-bold">{film.rating}</span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-white text-lg truncate">{film.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{film.genre.split('/')[0]}</p>
              
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {film.duration}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {film.cinema}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-700">
                <span className="text-lg font-bold text-red-500">
                  {film.price.toLocaleString()} FCFA
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onView(film)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onEdit(film)}
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(film.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredFilms.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <FilmIcon className="w-20 h-20 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Aucun film trouvé</p>
          {films.length === 0 && (
            <button
              onClick={() => {}}
              className="mt-4 text-red-500 hover:text-red-400"
            >
              Ajouter votre premier film
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminFilms() {
  const { films, addFilm, updateFilm, deleteFilm } = useAdminFilms();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [showFilmModal, setShowFilmModal] = useState(searchParams.get('action') === 'add');
  const [editingFilm, setEditingFilm] = useState<Film | null>(null);
  const [viewingFilm, setViewingFilm] = useState<Film | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  // Handle view from URL params
  useEffect(() => {
    const viewId = searchParams.get('view');
    if (viewId) {
      const film = films.find(f => f.id === parseInt(viewId));
      if (film) {
        setViewingFilm(film);
      }
    }
  }, [searchParams, films]);

  // Clear params when modal closes
  const handleCloseModal = () => {
    setShowFilmModal(false);
    setEditingFilm(null);
    setSearchParams({});
  };

  const handleSaveFilm = (data: Omit<Film, 'id' | 'createdAt'>) => {
    if (editingFilm) {
      updateFilm(editingFilm.id, data);
    } else {
      addFilm(data);
    }
    handleCloseModal();
  };

  const handleDeleteFilm = (id: number) => {
    deleteFilm(id);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Gestion des Films</h1>
          <p className="text-gray-400 mt-1">{films.length} films dans le catalogue</p>
        </div>
        <button
          onClick={() => {
            setEditingFilm(null);
            setShowFilmModal(true);
          }}
          className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Ajouter un Film</span>
        </button>
      </div>

      {/* Films Grid */}
      <FilmsGrid 
        films={films}
        onEdit={(film) => {
          setEditingFilm(film);
          setShowFilmModal(true);
        }}
        onDelete={(id) => setShowDeleteConfirm(id)}
        onView={(film) => setViewingFilm(film)}
      />

      {/* Film Modal */}
      <AnimatePresence>
        {showFilmModal && (
          <FilmModal
            film={editingFilm}
            onClose={handleCloseModal}
            onSave={handleSaveFilm}
          />
        )}
      </AnimatePresence>

      {/* Film Details Modal */}
      <AnimatePresence>
        {viewingFilm && (
          <FilmDetailsModal
            film={viewingFilm}
            onClose={() => setViewingFilm(null)}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-800 rounded-2xl p-6 max-w-md w-full border border-dark-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">Supprimer ce film ?</h3>
              <p className="text-gray-400 text-center mb-6">Cette action est irréversible.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-dark-700 hover:bg-dark-600 text-white font-medium py-3 rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDeleteFilm(showDeleteConfirm)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
