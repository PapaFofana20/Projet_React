import { Link } from 'react-router-dom';
import { Info, Star, Clock, Ticket, ChevronRight, Sparkles, Flame, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { movies } from '../data/movies';

export default function LandingPage() {
  const featuredMovie = movies[0]; 
  const newReleases = movies.filter(m => m.isNew);
  const exclusiveMovies = movies.filter(m => m.isExclusive);

  return (
    <div className="flex flex-col min-h-screen bg-dark-900">
            <section className="relative h-[80vh] sm:h-screen w-full flex items-end pb-12 sm:pb-20 md:pb-24 overflow-hidden">
                <div className="absolute inset-0">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img 
              src={featuredMovie.image} 
              alt={featuredMovie.title} 
              className="w-full h-full object-cover object-top"
            />
          </motion.div>
          
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-black/30"></div>
          
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-yellow-500/5 animate-pulse"></div>
        </div>

                <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto w-full mb-4 sm:mb-12 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              {featuredMovie.isNew && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-1.5 bg-brand-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg shadow-brand-500/50"
                >
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  NOUVEAU
                </motion.span>
              )}
              {featuredMovie.isExclusive && (
                <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg shadow-yellow-500/30">
                  <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  EXCLUSIF
                </span>
              )}
            </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-2 sm:mb-4 text-white tracking-tighter uppercase leading-none drop-shadow-2xl">
              {featuredMovie.title}
            </h1>
            
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6 text-xs sm:text-sm">
              <span className="flex items-center gap-1 text-green-400 font-bold">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                97% de correspondance
              </span>
              <span className="border border-white/30 text-white/90 px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium">
                {featuredMovie.genre.split('/')[0].trim()}
              </span>
              <span className="text-white/70 flex items-center gap-1">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                {featuredMovie.duration}
              </span>
              <span className="flex items-center gap-1 text-yellow-400 font-bold">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" /> 
                {featuredMovie.rating}
              </span>
            </div>

                        <p className="text-sm sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-2xl drop-shadow-lg line-clamp-2 sm:line-clamp-3">
              {featuredMovie.description}
            </p>

                        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link 
                to={`/book/${featuredMovie.id}/seats`}
                className="group flex items-center gap-2 sm:gap-3 bg-white text-black px-5 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
              >
                <Ticket className="w-5 h-5 sm:w-6 sm:h-6 fill-current group-hover:rotate-12 transition-transform" />
                Réserver
              </Link>
              <Link 
                to={`/movie/${featuredMovie.id}`}
                className="group flex items-center gap-2 sm:gap-3 bg-white/20 backdrop-blur-md text-white px-5 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-lg hover:bg-white/30 transition-all duration-300 border border-white/20"
              >
                <Info className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                Détails
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

            <section className="relative z-20 px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1600px] mx-auto w-full pt-6 sm:pt-8 md:pt-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-brand-500" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Nouveautés</h2>
            <span className="bg-brand-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:py-1 rounded-full">
              {newReleases.length}
            </span>
          </div>
          <Link to="/catalog" className="flex items-center gap-1 text-brand-500 hover:text-brand-400 font-semibold text-xs sm:text-sm transition-colors">
            Voir tout <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
        </div>
        
        <div className="flex gap-3 sm:gap-5 overflow-x-auto pb-6 sm:pb-8 scrollbar-hide snap-x scroll-smooth">
          {newReleases.map((movie, idx) => (
            <motion.div 
              key={movie.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative w-[130px] sm:w-[160px] md:w-[200px] min-w-[130px] sm:min-w-[160px] md:min-w-[200px] shrink-0 snap-start group"
            >
                            <div className="relative aspect-[2/3] rounded-lg sm:rounded-xl overflow-hidden shadow-2xl shadow-black/50 group-hover:shadow-brand-500/20 transition-all duration-500">
                <img 
                  src={movie.poster} 
                  alt={movie.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${movie.id}/400/600`;
                  }}
                />
                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
                  {movie.isNew && (
                    <span className="bg-brand-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">NOUVEAU</span>
                  )}
                  {movie.isExclusive && (
                    <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                      EXCLUSIF
                    </span>
                  )}
                </div>

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link
                    to={`/book/${movie.id}/seats`}
                    className="bg-brand-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-xs sm:text-sm shadow-lg shadow-brand-500/50 hover:bg-brand-600 transition-colors flex items-center gap-1 sm:gap-2"
                  >
                    <Ticket className="w-3 h-3 sm:w-4 sm:h-4" />
                    Réserver
                  </Link>
                </div>
              </div>

                            <div className="mt-2 sm:mt-3">
                <h3 className="text-white font-bold text-xs sm:text-sm md:text-base truncate group-hover:text-brand-500 transition-colors">
                  {movie.title}
                </h3>
                <p className="text-gray-500 text-[10px] sm:text-xs mt-1">{movie.genre.split('/')[0]}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

            <section className="mt-16 sm:mt-20 md:mt-28 px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1600px] mx-auto w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Films Exclusifs</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {exclusiveMovies.map((movie, idx) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-dark-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden border border-white/5 transition-all duration-500"
            >
              <div className="flex flex-col sm:flex-row sm:items-stretch h-full">
                                <Link 
                  to={`/movie/${movie.id}`}
                  className="relative w-full sm:w-32 md:w-40 aspect-[2/3] sm:h-48 md:h-60 shrink-0 overflow-hidden block"
                >
                  <img 
                    src={movie.poster} 
                    alt={movie.title} 
                    className="w-full h-full object-cover transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${movie.id}/400/600`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent sm:from-dark-900 to-transparent sm:block hidden" />
                </Link>
                
                                <div className="flex-1 p-3 sm:p-4 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      {movie.isExclusive && (
                        <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded">
                          EXCLUSIF
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                        <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                        {movie.rating}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-base sm:text-lg transition-colors line-clamp-1">
                      {movie.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">{movie.genre}</p>
                    <p className="text-gray-500 text-[10px] sm:text-xs mt-2 line-clamp-2 sm:line-clamp-3">{movie.description}</p>
                  </div>
                  
                  <Link
                    to={`/movie/${movie.id}`}
                    className="mt-3 sm:mt-4 bg-white/10 hover:bg-brand-500 text-white text-center py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-brand-500/25"
                  >
                    Voir détails
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

            <section className="mt-16 sm:mt-20 md:mt-28 px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1600px] mx-auto w-full">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <span className="text-2xl sm:text-4xl">🔥</span> Top 10 Films
        </h2>
        
        <div className="flex gap-3 sm:gap-5 overflow-x-auto pb-6 sm:pb-8 pt-2 sm:pt-4 scrollbar-hide snap-x">
          {movies.slice(0, 10).map((movie, idx) => (
            <motion.div 
              key={`top-${movie.id}`}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="relative flex items-end min-w-[130px] sm:min-w-[140px] md:min-w-[180px] snap-start shrink-0 cursor-pointer group"
            >
              <div 
                className="absolute left-0 bottom-[-5px] sm:bottom-[-10px] md:bottom-[-20px] text-[80px] sm:text-[100px] md:text-[150px] font-black leading-none z-0 tracking-tighter select-none"
                style={{ 
                  WebkitTextStroke: '3px #444', 
                  color: 'transparent',
                }}
              >
                {idx + 1}
              </div>
              
              <Link
                to={`/movie/${movie.id}`}
                className="relative w-[90px] sm:w-[100px] md:w-[130px] ml-auto aspect-[2/3] rounded-lg overflow-hidden z-10 shadow-[15px_0_25px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-105 group-hover:shadow-brand-500/30"
              >
                <img 
                  src={movie.poster} 
                  alt={movie.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${movie.id}/400/600`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 sm:p-3">
                  <h3 className="text-white font-bold text-[10px] sm:text-xs truncate mb-1 sm:mb-2">{movie.title}</h3>
                  <span className="w-full bg-brand-500 text-white text-center py-1 sm:py-1.5 rounded font-semibold text-[10px] sm:text-xs">
                    Voir détails
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

            <section className="mt-16 sm:mt-20 md:mt-28 px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1600px] mx-auto w-full mb-12 sm:mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-brand-600 via-brand-500 to-red-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center relative overflow-hidden"
        >
                    <div className="absolute top-0 left-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-24 sm:w-36 md:w-48 h-24 sm:h-36 md:h-48 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
          
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 sm:mb-4">
              Prêt pour le cinéma ?
            </h2>
            <p className="text-white/90 text-sm sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
              Rejoignez SENEFLIX et accédez aux meilleures séances, aux places favorites et aux offres exclusives.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link 
                to="/register"
                className="w-full sm:w-auto bg-white text-brand-500 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Créer un compte gratuit
              </Link>
              <Link 
                to="/catalog"
                className="w-full sm:w-auto bg-white/20 backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-lg hover:bg-white/30 transition-all duration-300 border border-white/30"
              >
                Explorer les films
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
