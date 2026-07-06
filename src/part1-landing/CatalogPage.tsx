import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronLeft, Film, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import { movies } from '../data/movies';

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const allGenres = Array.from(
    new Set(movies.flatMap(m => m.genre.split('/').map(g => g.trim())))
  ).sort();

  const filteredMovies = movies
    .filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === 'all' || 
        movie.genre.split('/').map(g => g.trim()).includes(selectedGenre);
      const matchesFilter = 
        selectedFilter === 'all' ||
        (selectedFilter === 'new' && movie.isNew) ||
        (selectedFilter === 'exclusive' && movie.isExclusive);
      
      return matchesSearch && matchesGenre && matchesFilter;
    })
    .sort((a, b) => {
      if (a.isNew !== b.isNew) {
        return a.isNew ? -1 : 1;
      }
      return b.id - a.id;
    });

  // Styles varyant pour les films (alternance)
  const cardVariants = [
    { 
      grid: 'col-span-1', 
      aspect: 'aspect-[2/3]',
      rounded: 'rounded-xl',
      shadow: 'shadow-xl shadow-black/50',
      hover: 'hover:shadow-red-500/30',
      title: 'text-sm',
      badge: 'text-[8px]'
    },
    { 
      grid: 'col-span-1', 
      aspect: 'aspect-[2/3]',
      rounded: 'rounded-2xl',
      shadow: 'shadow-2xl shadow-black/60',
      hover: 'hover:shadow-amber-500/30',
      title: 'text-sm',
      badge: 'text-[8px]'
    },
    { 
      grid: 'col-span-1', 
      aspect: 'aspect-[2/3]',
      rounded: 'rounded-lg',
      shadow: 'shadow-xl shadow-black/40',
      hover: 'hover:shadow-green-500/30',
      title: 'text-sm',
      badge: 'text-[8px]'
    },
    { 
      grid: 'col-span-1', 
      aspect: 'aspect-[2/3]',
      rounded: 'rounded-3xl',
      shadow: 'shadow-2xl shadow-black/70',
      hover: 'hover:shadow-purple-500/30',
      title: 'text-sm',
      badge: 'text-[8px]'
    },
  ];

  // Films "en vedette" avec display différent
  const getMovieDisplay = (movie: typeof movies[0], index: number) => {
    const variant = cardVariants[index % cardVariants.length];
    const isFeatured = movie.isNew || movie.isExclusive;
    const isTopRated = movie.rating >= 8;
    
    return { variant, isFeatured, isTopRated };
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="bg-dark-800 border-b border-dark-700">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 md:py-8">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 md:mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Retour à l'accueil
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center gap-3">
                🎬 Catalogue Films
              </h1>
              <p className="text-gray-400 mt-1 md:mt-2">{movies.length} films disponibles</p>
            </div>
            
            <div className="relative w-full lg:w-[400px] xl:w-[500px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un film..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-900 border border-dark-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-dark-800/50 border-b border-dark-700/50 sticky top-20 z-30">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-3 md:py-4">
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">Tous les genres</option>
                {allGenres.map((genre: string) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-brand-500 text-white'
                    : 'bg-dark-800 text-gray-400 hover:text-white border border-dark-700'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setSelectedFilter('new')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedFilter === 'new'
                    ? 'bg-brand-500 text-white'
                    : 'bg-dark-800 text-gray-400 hover:text-white border border-dark-700'
                }`}
              >
                ✨ Nouveautés
              </button>
              <button
                onClick={() => setSelectedFilter('exclusive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedFilter === 'exclusive'
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black'
                    : 'bg-dark-800 text-gray-400 hover:text-white border border-dark-700'
                }`}
              >
                ⭐ Exclusifs
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 md:py-8">
        <p className="text-gray-400 mb-4 md:mb-6">
          {filteredMovies.length} film{filteredMovies.length > 1 ? 's' : ''} trouvé{filteredMovies.length > 1 ? 's' : ''}
        </p>

        {filteredMovies.length === 0 ? (
          <div className="text-center py-16">
            <Film className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">Aucun film trouvé</h3>
            <p className="text-gray-500 mt-2">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5">
            {filteredMovies.map((movie: typeof movies[0], idx: number) => {
              const { variant, isFeatured, isTopRated } = getMovieDisplay(movie, idx);
              
              return (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`group ${variant.grid}`}
                >
                  {/* Badge pour films en vedette */}
                  <div className={`relative ${variant.aspect} ${variant.rounded} ${variant.shadow} ${variant.hover} overflow-hidden transition-all duration-500`}>
                    <img 
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${movie.id}/400/600`;
                      }}
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Badges - varient selon le film */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
                      {movie.isNew && (
                        <span className={`bg-brand-500 text-white ${variant.badge} font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 ${variant.rounded} shadow-lg flex items-center gap-1`}>
                          <span>✨</span>
                          <span>NOUVEAU</span>
                        </span>
                      )}
                      {movie.isExclusive && (
                        <span className={`bg-gradient-to-r from-yellow-500 to-amber-500 text-black ${variant.badge} font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 ${variant.rounded} shadow-lg flex items-center gap-1`}>
                          <span>🔥</span>
                          <span>EXCLUSIF</span>
                        </span>
                      )}
                      {isTopRated && !movie.isNew && !movie.isExclusive && (
                        <span className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white ${variant.badge} font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 ${variant.rounded} shadow-lg flex items-center gap-1`}>
                          <span>⭐</span>
                          <span>{movie.rating}</span>
                        </span>
                      )}
                    </div>

                    {/* NoteIMDb badge pour les tops */}
                    {isTopRated && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg border border-yellow-500/30">
                          <span className="text-yellow-400 text-[10px] font-bold">IMDb {movie.rating}</span>
                        </div>
                      </div>
                    )}

                    {/* Bouton Réserver */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link
                        to={`/book/${movie.id}/seats`}
                        className={`bg-brand-500 text-white px-4 sm:px-6 py-2 sm:py-3 ${variant.rounded} font-bold text-xs sm:text-sm shadow-lg shadow-brand-500/50 hover:bg-brand-600 transition-colors flex items-center gap-1 sm:gap-2`}
                      >
                        <Ticket className="w-3 h-3 sm:w-4 sm:h-4" />
                        Réserver
                      </Link>
                    </div>

                    {/* Effet glow au hover pour films en vedette */}
                    {isFeatured && (
                      <div className={`absolute inset-0 ${variant.rounded} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-500/20 to-transparent" />
                      </div>
                    )}
                  </div>

                  {/* Info sous l'image */}
                  <div className="mt-2 sm:mt-3">
                    <h3 className={`text-white font-bold ${variant.title} truncate group-hover:text-brand-500 transition-colors`}>
                      {movie.title}
                    </h3>
                    <p className="text-gray-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                      <span>{movie.genre.split('/')[0]}</span>
                      <span>•</span>
                      <span>{movie.duration}</span>
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
