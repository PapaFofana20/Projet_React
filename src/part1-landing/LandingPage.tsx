import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Info, Star, Clock, Ticket, Sparkles, Flame, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { movies } from '../data/movies';

// Données des images du carrousel (dossier public/carousel) - avec infos complètes du film
const carouselImages = [
  { 
    id: 19, 
    src: '/carousel/spider-man-brand-new-day.jpg', 
    title: 'Spider Man: Brand New Day',
    movieId: 31,
    isNew: true,
    isExclusive: true,
    genre: 'Action / Aventure / Science-Fiction',
    duration: '2h 30m',
    rating: 8.5,
    description: "Peter Parker entame un nouveau chapitre de sa vie avec de nouveaux pouvoirs et de nouveaux defis."
  },
  { 
    id: 18, 
    src: '/carousel/Who_carrosel.png', 
    title: 'WHO',
    movieId: 30,
    isNew: true,
    isExclusive: true,
    genre: 'Thriller / Mystère',
    duration: '1h 45m',
    rating: 7.0,
    description: "Un thriller haletant qui explore les profondeurs de l'identité et de la vérité."
  },
  { 
    id: 17, 
    src: '/carousel/micheal-carousel.jpg', 
    title: 'Micheal',
    movieId: 28,
    isNew: true,
    isExclusive: true,
    genre: 'Drame / Biographie',
    duration: '2h 15m',
    rating: 8.2,
    description: 'Lhistoire vraie et tragique de la légende du king of pop.'
  },
  { 
    id: 15, 
    src: '/carousel/shelter.jpg', 
    title: 'Shelter',
    movieId: 29,
    isNew: true,
    isExclusive: false,
    genre: 'Drame / Romance',
    duration: '1h 55m',
    rating: 6.8,
    description: 'Une histoire émouvante sur lamour, le sacrifice et le sens de la vie.'
  },
  { 
    id: 14, 
    src: '/carousel/furiosa.jpg', 
    title: 'Furiosa',
    movieId: 25,
    isNew: true,
    isExclusive: false,
    genre: 'Action / Aventure / Science-Fiction',
    duration: '2h 28m',
    rating: 7.6,
    description: 'Lhistoire de Furiosa avant les événements de Mad Max: Fury Road.'
  },
  { 
    id: 13, 
    src: '/carousel/afterburn.jpg', 
    title: 'Afterburn',
    movieId: 27,
    isNew: true,
    isExclusive: false,
    genre: 'Action / Thriller',
    duration: '1h 54m',
    rating: 6.8,
    description: 'Un pompier héroïque devient obsédé par la recherche de vérité après avoir survécu à un incident tragique.'
  },
  { 
    id: 12, 
    src: '/carousel/deadpool-wolverine.png', 
    title: 'Deadpool & Wolverine',
    movieId: 3,
    isNew: true,
    isExclusive: true,
    genre: 'Action / Comédie / Science-Fiction',
    duration: '2h 7m',
    rating: 7.6,
    description: 'Lexistence paisible de Deadpool souvire lorsquil est recruté par la Time Variance Authority.'
  },
  { 
    id: 11, 
    src: '/carousel/sinners.jpg', 
    title: 'Sinners',
    movieId: 21,
    isNew: true,
    isExclusive: true,
    genre: 'Horreur / Thriller / Surnaturel',
    duration: '2h 18m',
    rating: 7.5,
    description: 'En 1932, deux jumeaux reviennent dans leur ville natale du Mississippi et découvrent une présence maléfique.'
  },
  { 
    id: 10, 
    src: '/carousel/vaiana.jpg', 
    title: 'Vaiana 2',
    movieId: 26,
    isNew: true,
    isExclusive: true,
    genre: 'Animation / Aventure / Comédie',
    duration: '1h 40m',
    rating: 7.3,
    description: 'Moana et Maui sont de retour pour une nouvelle aventure aux confins des océans du Pacifique.'
  },
  { 
    id: 9, 
    src: '/carousel/zootopie-2.jpg', 
    title: 'Zootopie 2',
    movieId: 18,
    isNew: true,
    isExclusive: true,
    genre: 'Animation / Aventure / Comédie',
    duration: '1h 48m',
    rating: 7.4,
    description: 'Judy Hopps et Nick Wilde reviennent pour une nouvelle aventure palpitante.'
  },
  { 
    id: 8, 
    src: '/carousel/wicked.jpg', 
    title: 'Wicked',
    movieId: 4,
    isNew: true,
    isExclusive: false,
    genre: 'Fantastique / Musical',
    duration: '2h 40m',
    rating: 7.4,
    description: 'Lextraordinaire sorcière de lOuest et Glinda la Bonne occupent le devant de la scène.'
  },
  { 
    id: 7, 
    src: '/carousel/mission-impossible.jpg', 
    title: 'Mission: Impossible',
    movieId: 16,
    isNew: true,
    isExclusive: true,
    genre: 'Action / Thriller',
    duration: '2h 49m',
    rating: 7.2,
    description: 'Ethan Hunt et son équipe du FMI se lancent dans leur mission la plus dangereuse à ce jour.'
  },
  { 
    id: 6, 
    src: '/carousel/gladiator-ii.jpg', 
    title: 'Gladiator II',
    movieId: 1,
    isNew: true,
    isExclusive: true,
    genre: 'Action / Drame / Historique',
    duration: '2h 28m',
    rating: 6.5,
    description: 'Lucius est forcé dentrer dans le Colisée pour affronter les empereurs tyranniques qui dirigent Rome.'
  },
  { 
    id: 5, 
    src: '/carousel/captain-america.jpg', 
    title: 'Captain America',
    movieId: 20,
    isNew: true,
    isExclusive: true,
    genre: 'Action / Aventure / Science-Fiction',
    duration: '1h 58m',
    rating: 6.3,
    description: 'Sam Wilson prend le bouclier de Captain America et se retrouve au milieu dun incident international.'
  },
  { 
    id: 4, 
    src: '/carousel/kaamelott.webp', 
    title: 'Kaamelott',
    movieId: 17,
    isNew: true,
    isExclusive: false,
    genre: 'Comédie / Aventure / Fantastique',
    duration: '2h 19m',
    rating: 6.1,
    description: 'Arthur doit prouver sa légitimité en tant que roi face à de nouvelles menaces venues des dieux celtes.'
  },
  { 
    id: 3, 
    src: '/carousel/joker-folie-a-deux.jpg', 
    title: 'Joker: Folie à Deux',
    movieId: 22,
    isNew: true,
    isExclusive: false,
    genre: 'Crime / Drame / Thriller',
    duration: '2h 18m',
    rating: 5.2,
    description: 'Arthur Fleck est emprisonné à Arkham en attendant son procès pour les crimes commis en tant que Joker.'
  },
  { 
    id: 2, 
    src: '/carousel/les-4-fantastiques.jpg', 
    title: 'Les 4 Fantastiques',
    movieId: 23,
    isNew: true,
    isExclusive: false,
    genre: 'Action / Aventure / Science-Fiction',
    duration: '1h 54m',
    rating: 7.3,
    description: 'Les Quatre Fantastiques doivent maîtriser leur pouvoir extraordinaire et affronter Galactus.'
  },
  { 
    id: 1, 
    src: '/carousel/superman.jpg', 
    title: 'Superman', 
    movieId: 19,
    isNew: true,
    isExclusive: true,
    genre: 'Action / Aventure / Drame',
    duration: '2h 9m',
    rating: 7.5,
    description: 'Superman, le dernier fils de Krypton, découvre sa vraie identité et embrasse son destin de héros.'
  },
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const newReleases = movies.filter(m => m.isNew);
  const exclusiveMovies = movies.filter(m => m.isExclusive);

  // Auto-scroll du carrousel
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);



  return (
    <div className="flex flex-col min-h-screen bg-dark-900">
      {/* Carrousel Principal - Page d'Accueil */}
      <section 
        className="relative h-[70vh] sm:h-[80vh] md:h-[85vh] w-full overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {carouselImages.map((slide, index) => (
            <div key={slide.id} className="relative w-full h-[70vh] sm:h-[80vh] md:h-[85vh] flex-shrink-0">
              <img 
                src={slide.src} 
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-dark-900/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-dark-900/90 via-dark-900/50 to-transparent sm:from-dark-900/80 sm:via-dark-900/30" />
              
              {/* Contenu du film */}
              <div className="absolute bottom-6 sm:bottom-10 md:bottom-14 lg:bottom-20 left-3 sm:left-6 md:left-12 right-3 sm:right-6 md:right-12 lg:right-[30%]">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: index === currentSlide ? 1 : 0, y: index === currentSlide ? 0 : 30 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-3xl"
                >
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2 sm:mb-3 md:mb-4">
                    {slide.isNew && (
                      <span className="inline-flex items-center gap-1 bg-brand-500 text-white text-[8px] sm:text-[10px] md:text-xs font-bold px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-full shadow-lg shadow-brand-500/50">
                        <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />
                        NOUVEAU
                      </span>
                    )}
                    {slide.isExclusive && (
                      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-[8px] sm:text-[10px] md:text-xs font-bold px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-full shadow-lg shadow-yellow-500/30">
                        <Flame className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />
                        EXCLUSIF
                      </span>
                    )}
                  </div>

                  {/* Titre */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-2 sm:mb-3 md:mb-4 text-white tracking-tighter uppercase leading-tight drop-shadow-2xl">
                    {slide.title}
                  </h1>
                  
                  {/* Infos */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-4 mb-3 sm:mb-4 md:mb-6 text-[10px] sm:text-xs md:text-sm">
                    <span className="border border-white/30 text-white/90 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] md:text-xs font-medium">
                      {slide.genre.split('/')[0].trim()}
                    </span>
                    <span className="text-white/70 flex items-center gap-0.5 sm:gap-1">
                      <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                      {slide.duration}
                    </span>
                    <span className="flex items-center gap-0.5 sm:gap-1 text-yellow-400 font-bold">
                      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 fill-current" /> 
                      {slide.rating}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[12px] sm:text-sm md:text-base text-white/90 mb-4 sm:mb-5 md:mb-8 leading-relaxed max-w-2xl drop-shadow-lg line-clamp-2 sm:line-clamp-3">
                    {slide.description}
                  </p>

                  {/* Boutons */}
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 md:gap-4">
                    <Link 
                      to={`/book/${slide.movieId}/seats`}
                      className="group flex items-center gap-1.5 sm:gap-2 md:gap-3 bg-red-600 text-white px-4 sm:px-5 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg font-bold text-xs sm:text-sm md:text-lg hover:bg-red-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
                    >
                      <Ticket className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 fill-current group-hover:rotate-12 transition-transform" />
                      Réserver
                    </Link>
                    <Link 
                      to={`/movie/${slide.movieId}`}
                      className="group flex items-center gap-1.5 sm:gap-2 md:gap-3 bg-white/20 backdrop-blur-md text-white px-4 sm:px-5 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg font-bold text-xs sm:text-sm md:text-lg hover:bg-white/30 transition-all duration-300 border border-white/20"
                    >
                      <Info className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                      Détails
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section Title */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-20 px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1600px] mx-auto w-full pt-8 sm:pt-12 md:pt-16 text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter">
          Ne ratez plus aucune <span className="text-red-600">émotion</span>.
        </h2>
      </motion.section>

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
                    className="bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-xs sm:text-sm shadow-lg shadow-red-600/50 hover:bg-red-700 transition-colors flex items-center gap-1 sm:gap-2"
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
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Films Exclusifs</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {exclusiveMovies.map((movie, idx) => (
            <motion.div 
              key={movie.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
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
                    className="bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-xs sm:text-sm shadow-lg shadow-red-600/50 hover:bg-red-700 transition-colors flex items-center gap-1 sm:gap-2"
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
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" /> Top 10 Films
        </h2>
        
        <div className="flex gap-6 sm:gap-8 overflow-x-auto pb-8 pt-4 scrollbar-hide snap-x scroll-smooth">
          {movies.slice(0, 10).map((movie, idx) => (
            <motion.div 
              key={`top-${movie.id}`}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="relative flex items-center shrink-0 snap-start group w-auto"
            >
              {/* Giant Rank Number */}
              <div 
                className="text-[120px] sm:text-[150px] md:text-[180px] font-black leading-none tracking-tighter z-0 -mr-6 sm:-mr-10 md:-mr-12 select-none text-gray-400 drop-shadow-[0_0_15px_rgba(0,0,0,1)]"
                style={{ 
                  WebkitTextStroke: '2px #1f2937'
                }}
              >
                {idx + 1}
              </div>

              <div className="relative flex flex-col z-10 w-[140px] sm:w-[180px] md:w-[220px]">
                {/* Image Container with Badges */}
                <Link
                  to={`/movie/${movie.id}`}
                  className="relative w-full aspect-[2/3] rounded-xl overflow-hidden block transition-transform duration-500 group-hover:scale-[1.02] shadow-2xl shadow-black/80"
                >
                  <img 
                    src={movie.poster} 
                    alt={movie.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${movie.id}/400/600`;
                    }}
                  />
                  
                  {/* Badges - styled after the image provided */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-20">
                    {movie.isNew && (
                      <span className="bg-[#E50914] text-white text-[8px] lg:text-[10px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-wider w-fit">
                        NOUVEAU
                      </span>
                    )}
                    {movie.isExclusive && (
                      <span className="bg-[#EBC024] text-black text-[8px] lg:text-[10px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-wider w-fit">
                        EXCLUSIF
                      </span>
                    )}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                </Link>
                
                {/* Movie Info - Left Aligned */}
                <div className="mt-3 flex flex-col items-start px-0.5">
                  <h3 className="text-white font-bold text-sm lg:text-base line-clamp-1 group-hover:text-brand-400 transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-400 text-[10px] lg:text-xs font-medium uppercase tracking-tight">
                      {movie.genre.split(' / ')[0]}
                    </p>
                    <span className="w-1 h-1 bg-gray-600 rounded-full" />
                    <div className="flex items-center gap-0.5 text-yellow-500">
                      <Star className="w-2.5 h-2.5 lg:w-3 lg:h-3 fill-current" />
                      <span className="text-[10px] lg:text-xs font-bold">{movie.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
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
