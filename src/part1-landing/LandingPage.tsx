import { Link } from 'react-router-dom';
import { Play, Info, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { movies } from '../data/movies';

export default function LandingPage() {
  const featuredMovie = movies[0]; // Dune Part Two
  const trendingMovies = movies.slice(1);

  return (
    <div className="flex flex-col min-h-screen bg-dark-900 pb-20">
      {/* Featured Hero Section */}
      <section className="relative h-[80vh] w-full flex items-end pb-10 md:pb-16">
        <div className="absolute inset-0">
          <img 
            src={featuredMovie.image} 
            alt={featuredMovie.title} 
            className="w-full h-full object-cover"
          />
          {/* Enhanced Netflix Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-dark-900"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-4 text-white tracking-tighter uppercase leading-none">
              {featuredMovie.title}
            </h1>
            
            <div className="flex items-center justify-center gap-6 mb-6 text-sm md:text-base font-bold tracking-wide">
              <span className="text-green-500">98% Match</span>
              <span className="border border-white/40 px-2.5 py-0.5 rounded-sm text-white/90">12+</span>
              <span className="text-white/80">{featuredMovie.duration}</span>
              <span className="flex items-center gap-1.5 text-yellow-500">
                <Star className="w-5 h-5 fill-current" /> {featuredMovie.rating}
              </span>
            </div>

            <p className="text-base md:text-lg text-white/90 mb-8 line-clamp-3 leading-relaxed max-w-2xl mx-auto">
              {featuredMovie.description}
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link 
                to={`/book/${featuredMovie.id}/seats`}
                className="flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded font-black text-lg hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                <Play className="w-5 h-5 fill-current" />
                Voir salle
              </Link>
              <Link 
                to={`/movie/${featuredMovie.id}`}
                className="flex items-center gap-2 bg-white/20 text-white px-8 py-3.5 rounded font-black text-lg hover:bg-white/30 transition-all hover:scale-105 active:scale-95 backdrop-blur-md border border-white/10"
              >
                <Info className="w-5 h-5" />
                Plus d'infos
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending Now Horizontal Carousel */}
      <section className="relative z-20 mt-4 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto w-full">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-white/90 px-1">Tendances actuelles</h2>
        
        <div className="flex gap-4 overflow-x-auto pb-8 pt-4 scrollbar-hide snap-x">
          {trendingMovies.map((movie, idx) => (
            <motion.div 
              key={movie.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative w-[100px] md:w-[140px] min-w-[100px] md:min-w-[140px] shrink-0 aspect-[2/3] rounded-md overflow-hidden group snap-start cursor-pointer"
            >
              <img 
                src={movie.poster} 
                alt={movie.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold truncate mb-2">{movie.title}</h3>
                <Link 
                  to={`/movie/${movie.id}`}
                  className="w-full bg-brand-500 text-white text-center py-2 rounded font-semibold text-sm hover:bg-brand-600 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Another Category Section */}
      <section className="mt-8 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto w-full">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-white/90 px-1">Top 10 des films aujourd'hui</h2>
        <div className="flex gap-4 overflow-x-auto pb-8 pt-4 scrollbar-hide snap-x">
          {movies.slice().reverse().map((movie, idx) => (
            <motion.div 
              key={`acclaimed-${movie.id}`}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="relative flex items-end min-w-[160px] md:min-w-[240px] snap-start shrink-0 cursor-pointer group pt-4"
            >
              <div 
                className="absolute left-0 bottom-[-15px] md:bottom-[-25px] text-[130px] md:text-[200px] font-black leading-none z-0 tracking-tighter"
                style={{ 
                  WebkitTextStroke: '4px #555', 
                  color: '#1a1a1a',
                }}
              >
                {idx + 1}
              </div>
              <div className="relative w-[100px] md:w-[140px] ml-auto aspect-[2/3] rounded-md overflow-hidden z-10 shadow-[20px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-105">
                <img 
                  src={movie.poster} 
                  alt={movie.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 md:p-3">
                  <Link 
                    to={`/movie/${movie.id}`}
                    className="w-full bg-white text-black text-center py-1.5 md:py-2 rounded font-semibold text-xs md:text-sm hover:bg-gray-200 transition-colors"
                  >
                    Tickets
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
