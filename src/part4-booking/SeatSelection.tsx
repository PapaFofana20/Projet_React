import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Armchair, ArrowRight, ArrowLeft, Tv } from 'lucide-react';
import { movies } from '../data/movies';
import { getCinemaForFilm } from '../data/cinemaLocations';
import { useBookings } from '../context/BookingContext';

// Configuration des layouts pour chaque cinéma
export interface SeatLayout {
  price: number;
  name: string;
  rows: string[];
  cols: number;
  aisles: number[];
  // Configuration de l'écran
  screenShape: 'curved' | 'flat' | 'angled' | 'wide';
  screenColor: string;
  // Zones spéciales
  zones: {
    name: string;
    rows: string[];
    priceModifier: number;
    color: string;
  }[];
  // Points d'entrée/sortie
  exits: { row: string; side: 'left' | 'right' }[];
  // Style visuel
  themeColor: string;
  bgColor: string;
}

const CINEMA_LAYOUTS: Record<string, SeatLayout> = {
  // Pathé Meridien - Grande salle premium
  "Pathé Meridien": {
    price: 6000,
    name: "Pathé Meridien",
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    cols: 16,
    aisles: [4, 10],
    screenShape: 'wide',
    screenColor: '#dc2626',
    zones: [
      { name: 'VIP', rows: ['A', 'B'], priceModifier: 2.5, color: '#fbbf24' },
      { name: 'Standard', rows: ['C', 'D', 'E', 'F', 'G', 'H'], priceModifier: 1, color: '#3b82f6' },
      { name: 'Standard+', rows: ['I', 'J', 'K', 'L'], priceModifier: 1.2, color: '#10b981' },
    ],
    exits: [{ row: 'A', side: 'left' }, { row: 'A', side: 'right' }],
    themeColor: '#dc2626',
    bgColor: 'from-gray-900 to-black',
  },

  // Pathé Mbour - Salle moyenne
  "Pathé Mbour": {
    price: 5000,
    name: "Pathé Mbour",
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    cols: 14,
    aisles: [3, 9],
    screenShape: 'curved',
    screenColor: '#ef4444',
    zones: [
      { name: 'Premium', rows: ['A', 'B', 'C'], priceModifier: 1.8, color: '#f59e0b' },
      { name: 'Standard', rows: ['D', 'E', 'F', 'G', 'H', 'I'], priceModifier: 1, color: '#3b82f6' },
    ],
    exits: [{ row: 'A', side: 'left' }],
    themeColor: '#ef4444',
    bgColor: 'from-gray-900 to-slate-900',
  },

  // Canal+ Plateaux - Salle confortables
  "Canal+ Cinémas Plateaux": {
    price: 4500,
    name: "Canal+ Plateaux",
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    cols: 12,
    aisles: [5],
    screenShape: 'flat',
    screenColor: '#f59e0b',
    zones: [
      { name: 'Confort', rows: ['A', 'B', 'C'], priceModifier: 1.5, color: '#a855f7' },
      { name: 'Standard', rows: ['D', 'E', 'F', 'G', 'H'], priceModifier: 1, color: '#3b82f6' },
    ],
    exits: [{ row: 'A', side: 'right' }],
    themeColor: '#f59e0b',
    bgColor: 'from-gray-900 to-zinc-900',
  },

  // Canal+ Liberté 6 - Salle intimiste
  "Canal+ Liberté 6": {
    price: 4000,
    name: "Canal+ Liberté 6",
    rows: ['A', 'B', 'C', 'D', 'E', 'F'],
    cols: 10,
    aisles: [3, 7],
    screenShape: 'angled',
    screenColor: '#eab308',
    zones: [
      { name: 'Premium', rows: ['A', 'B'], priceModifier: 1.6, color: '#ec4899' },
      { name: 'Standard', rows: ['C', 'D', 'E', 'F'], priceModifier: 1, color: '#3b82f6' },
    ],
    exits: [{ row: 'C', side: 'left' }],
    themeColor: '#eab308',
    bgColor: 'from-gray-900 to-neutral-900',
  },

  // IMAX Dakar - Salle immersive
  "IMAX Dakar": {
    price: 8000,
    name: "IMAX Dakar",
    rows: ['AA', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    cols: 20,
    aisles: [5, 13],
    screenShape: 'curved',
    screenColor: '#8b5cf6',
    zones: [
      { name: 'IMAX Prime', rows: ['AA'], priceModifier: 3, color: '#f43f5e' },
      { name: 'IMAX Standard', rows: ['A', 'B', 'C', 'D'], priceModifier: 1.5, color: '#8b5cf6' },
      { name: 'Standard', rows: ['E', 'F', 'G', 'H', 'I', 'J', 'K'], priceModifier: 1, color: '#3b82f6' },
    ],
    exits: [{ row: 'A', side: 'left' }, { row: 'A', side: 'right' }],
    themeColor: '#8b5cf6',
    bgColor: 'from-purple-950 to-black',
  },

  // Ciné Kaolack - Salle régionale
  "Ciné Kaolack": {
    price: 2500,
    name: "Ciné Kaolack",
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    cols: 10,
    aisles: [2, 7],
    screenShape: 'flat',
    screenColor: '#10b981',
    zones: [
      { name: 'Standard', rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], priceModifier: 1, color: '#10b981' },
    ],
    exits: [{ row: 'D', side: 'left' }],
    themeColor: '#10b981',
    bgColor: 'from-gray-900 to-emerald-950',
  },

  // Sénégal Ciné Thiaroye - Salle populaire
  "Sénégal Ciné Thiaroye": {
    price: 3000,
    name: "Sénégal Ciné Thiaroye",
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    cols: 12,
    aisles: [4],
    screenShape: 'wide',
    screenColor: '#06b6d4',
    zones: [
      { name: 'Avant-scène', rows: ['A', 'B'], priceModifier: 1.4, color: '#14b8a6' },
      { name: 'Standard', rows: ['C', 'D', 'E', 'F', 'G', 'H'], priceModifier: 1, color: '#3b82f6' },
    ],
    exits: [{ row: 'A', side: 'left' }, { row: 'A', side: 'right' }],
    themeColor: '#06b6d4',
    bgColor: 'from-gray-900 to-cyan-950',
  },

  // Le Grand Cinéma - Salle familiale
  "Le Grand Cinéma": {
    price: 3500,
    name: "Le Grand Cinéma",
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    cols: 14,
    aisles: [3, 8],
    screenShape: 'curved',
    screenColor: '#ec4899',
    zones: [
      { name: 'Famille', rows: ['A', 'B', 'C'], priceModifier: 1.5, color: '#f472b6' },
      { name: 'Standard', rows: ['D', 'E', 'F', 'G', 'H', 'I'], priceModifier: 1, color: '#3b82f6' },
    ],
    exits: [{ row: 'A', side: 'left' }],
    themeColor: '#ec4899',
    bgColor: 'from-gray-900 to-pink-950',
  },
};

const getCinemaNameForFilm = (filmId: number): string => {
  const cinema = getCinemaForFilm(filmId);
  const cinemaMapping: Record<string, string> = {
    'pathe-meridien': 'Pathé Meridien',
    'pathe-mbour': 'Pathé Mbour',
    'canal-plus-plateaux': 'Canal+ Cinémas Plateaux',
    'canal-plus-liberté': 'Canal+ Liberté 6',
    'imax-dakar': 'IMAX Dakar',
    'ciné-kaolack': 'Ciné Kaolack',
    'sénégal-cinema-thiaroye': 'Sénégal Ciné Thiaroye',
    'le-grande-cinéma': 'Le Grand Cinéma',
  };
  return cinemaMapping[cinema.id] || 'Pathé Meridien';
};

const getZoneForRow = (row: string, layout: SeatLayout): { name: string; color: string; price: number } => {
  for (const zone of layout.zones) {
    if (zone.rows.includes(row)) {
      return {
        name: zone.name,
        color: zone.color,
        price: Math.round(layout.price * zone.priceModifier),
      };
    }
  }
  return { name: 'Standard', color: '#3b82f6', price: layout.price };
};

// Composant pour l'écran selon le style
const Screen = ({ shape, color }: { shape: string; color: string }) => {
  if (shape === 'curved') {
    return (
      <div className="relative h-16 mb-16 mx-auto max-w-[90%]">
        <div 
          className="absolute inset-x-0 bottom-0 h-12 rounded-t-[100%] shadow-[0_-15px_40px_rgba(var(--color),0.4)]"
          style={{ 
            background: `linear-gradient(to bottom, ${color}30, transparent)`,
            '--color': color.replace('#', '')
          } as React.CSSProperties}
        >
          <div className="absolute inset-x-4 bottom-1 h-1 bg-white/20 rounded-full" />
        </div>
        <p className="text-center uppercase tracking-[0.4em] text-gray-400 text-xs absolute top-0 left-1/2 -translate-x-1/2 font-semibold">
          ÉCRAN
        </p>
      </div>
    );
  }
  
  if (shape === 'wide') {
    return (
      <div className="relative h-12 mb-16 mx-auto max-w-[95%]">
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-white/10 to-transparent">
          <div className="absolute inset-x-6 bottom-1 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-transparent to-white/5" />
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-transparent to-white/5" />
        <p className="text-center uppercase tracking-[0.5em] text-gray-400 text-[10px] absolute top-0 left-1/2 -translate-x-1/2 font-bold">
          ECRAN
        </p>
      </div>
    );
  }
  
  if (shape === 'angled') {
    return (
      <div className="relative h-14 mb-16 mx-auto max-w-[85%]">
        <div 
          className="absolute inset-0"
          style={{
            clipPath: 'polygon(5% 100%, 0% 0%, 100% 0%, 95% 100%)',
            background: `linear-gradient(to bottom, ${color}40, transparent)`
          }}
        />
        <div 
          className="absolute inset-x-0 bottom-0 h-1"
          style={{ background: `${color}60` }}
        />
        <p className="text-center uppercase tracking-[0.3em] text-gray-400 text-xs absolute top-1 left-1/2 -translate-x-1/2 font-semibold">
          ÉCRAN
        </p>
      </div>
    );
  }
  
  // Flat (default)
  return (
    <div className="relative h-12 mb-16 mx-auto max-w-[80%]">
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-t-lg" />
      <div className="absolute inset-x-2 bottom-1 h-0.5 bg-white/20" />
      <p className="text-center uppercase tracking-[0.3em] text-gray-400 text-xs absolute top-2 left-1/2 -translate-x-1/2 font-semibold">
        ÉCRAN
      </p>
    </div>
  );
};

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings } = useBookings();
  const movie = movies.find(m => m.id === Number(id));
  
  // Déterminer le cinéma basé sur le film
  const cinemaName = movie ? getCinemaNameForFilm(movie.id) : 'Pathé Meridien';
  const layout = CINEMA_LAYOUTS[cinemaName] || CINEMA_LAYOUTS['Pathé Meridien'];
  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const dates = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  });
  
  const times = ['14:00', '16:30', '18:15', '20:00', '21:30', '23:00'];
  
  const movieIndex = movie ? movie.id : 0;
  const [selectedDate] = useState(dates[movieIndex % dates.length]);
  const [selectedTime] = useState(times[movieIndex % times.length]);

  // Calculer les sièges déjà occupés
  const occupiedSeats = bookings
    .filter(b => 
      b.movieId === Number(id) && 
      b.cinema === cinemaName && 
      b.date === selectedDate && 
      b.time === selectedTime
    )
    .reduce((acc, b) => [...acc, ...b.seats], [] as string[]);

  useEffect(() => {
    setSelectedSeats([]);
  }, [selectedDate, selectedTime]);

  const toggleSeat = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length < 8) {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length > 0 && movie) {
      // Calculer le prix total basé sur les zones
      let totalPrice = 0;
      selectedSeats.forEach(seat => {
        const rowLetter = seat.replace(/[0-9]/g, '');
        const zone = getZoneForRow(rowLetter, layout);
        totalPrice += zone.price;
      });

      const bookingData = {
        movieId: movie.id,
        movieTitle: movie.title,
        moviePoster: movie.poster,
        cinema: cinemaName,
        date: selectedDate,
        time: selectedTime,
        seats: selectedSeats,
        totalPrice
      };
      localStorage.setItem('pending_booking', JSON.stringify(bookingData));
      navigate(`/book/${id}/checkout`);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${layout.bgColor} py-8`}>
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-8 w-full">
        
        {/* Section gauche - Sélection des places */}
        <div className="lg:w-2/3">
          <div className="mb-6">
            <Link to={`/movie/${id}`} className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Retour au film
            </Link>
            
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${layout.themeColor}20` }}
              >
                <Tv className="w-6 h-6" style={{ color: layout.themeColor }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Sélection des places</h1>
                <p className="text-gray-400 text-sm">{cinemaName}</p>
              </div>
            </div>

            {/* Info sur la séance */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 bg-dark-800/50 px-4 py-2 rounded-lg border border-white/5">
                <span className="text-gray-400">📅</span>
                <span className="text-white">{selectedDate}</span>
              </div>
              <div className="flex items-center gap-2 bg-dark-800/50 px-4 py-2 rounded-lg border border-white/5">
                <span className="text-gray-400">🕐</span>
                <span className="text-white">{selectedTime}</span>
              </div>
            </div>
          </div>

          {/* Carte des places */}
          <div 
            className="bg-dark-800/80 rounded-2xl p-6 border border-white/10 backdrop-blur-sm"
            style={{ boxShadow: `0 0 60px ${layout.themeColor}10` }}
          >
            {/* Écran */}
            <Screen shape={layout.screenShape} color={layout.screenColor} />

            {/* Légende des zones */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {layout.zones.map((zone, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: zone.color }}
                  />
                  <span className="text-gray-400">
                    {zone.name}: {Math.round(layout.price * zone.priceModifier).toLocaleString()} F
                  </span>
                </div>
              ))}
            </div>

            {/* Grille des places */}
            <div className="flex flex-col gap-1 items-center pb-4">
              {layout.rows.map((row) => {
                const zone = getZoneForRow(row, layout);
                
                return (
                  <div key={row} className="flex items-center gap-2">
                    {/* Indicateur de rangée */}
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                      style={{ 
                        backgroundColor: `${zone.color}20`,
                        color: zone.color 
                      }}
                    >
                      {row}
                    </div>

                    {/* Places */}
                    <div className="flex gap-1">
                      {[...Array(layout.cols)].map((_, col) => {
                        const seatNumber = col + 1;
                        const seatId = `${row}${seatNumber}`;
                        const isSelected = selectedSeats.includes(seatId);
                        const isOccupied = occupiedSeats.includes(seatId);
                        const hasAisle = layout.aisles.includes(col);
                        const exitForRow = layout.exits.find(e => e.row === row);

                        return (
                          <div key={seatId} className={`flex ${hasAisle ? 'mr-4' : ''}`}>
                            {/* Indicateur de sortie */}
                            {exitForRow && exitForRow.side === 'left' && col === 0 && (
                              <div className="w-4 h-4 rounded bg-green-500/30 mr-1 flex items-center justify-center">
                                <span className="text-[8px] text-green-400">↓</span>
                              </div>
                            )}
                            
                            <button
                              onClick={() => toggleSeat(seatId)}
                              disabled={isOccupied}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all group relative ${
                                isSelected 
                                  ? 'scale-110 shadow-lg' 
                                  : ''
                              }`}
                              style={{
                                backgroundColor: isSelected 
                                  ? zone.color 
                                  : isOccupied 
                                    ? '#1a1a2e' 
                                    : `${zone.color}30`,
                                border: isOccupied 
                                  ? '2px dashed #333' 
                                  : `2px solid ${zone.color}50`,
                                cursor: isOccupied ? 'not-allowed' : 'pointer',
                              }}
                            >
                              <Armchair 
                                className={`w-4 h-4 ${
                                  isSelected 
                                    ? 'text-white' 
                                    : isOccupied 
                                      ? 'text-gray-600' 
                                      : 'text-gray-400 group-hover:text-white transition-colors'
                                }`} 
                              />
                              
                              {/* Effet hover */}
                              {!isOccupied && !isSelected && (
                                <div 
                                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                  style={{ backgroundColor: `${zone.color}20` }}
                                />
                              )}
                            </button>

                            {/* Indicateur de sortie */}
                            {exitForRow && exitForRow.side === 'right' && col === layout.cols - 1 && (
                              <div className="w-4 h-4 rounded bg-green-500/30 ml-1 flex items-center justify-center">
                                <span className="text-[8px] text-green-400">↓</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Indicateur de rangée (droite) */}
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                      style={{ 
                        backgroundColor: `${zone.color}20`,
                        color: zone.color 
                      }}
                    >
                      {row}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Légende */}
            <div className="flex justify-center gap-8 mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${layout.zones[0]?.color}50` }}
                >
                  <Armchair className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-400">Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: layout.zones[0]?.color }}
                >
                  <Armchair className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-400">Sélectionné</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-dark-900 border-2 border-dashed border-gray-700 flex items-center justify-center">
                  <Armchair className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm text-gray-400">Vendu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section droite - Récapitulatif */}
        <div className="lg:w-1/3">
          <div 
            className="bg-dark-800/80 rounded-2xl p-6 border border-white/10 backdrop-blur-sm sticky top-8"
            style={{ boxShadow: `0 0 40px ${layout.themeColor}10` }}
          >
            <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>
            
            {/* Info film */}
            <div className="mb-6 pb-6 border-b border-white/10">
              <h3 className="font-semibold text-lg mb-1">{movie?.title || 'Film'}</h3>
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-gray-500" />
                <p className="text-gray-400 text-sm">{cinemaName}</p>
              </div>
              <p className="text-sm font-medium mt-2" style={{ color: layout.themeColor }}>
                {selectedDate} • {selectedTime}
              </p>
            </div>

            {/* Places sélectionnées */}
            <div className="mb-6 pb-6 border-b border-white/10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400">Places sélectionnées</span>
                <span className="font-semibold">{selectedSeats.length}</span>
              </div>
              
              {selectedSeats.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map(seat => {
                    const rowLetter = seat.replace(/[0-9]/g, '');
                    const zone = getZoneForRow(rowLetter, layout);
                    return (
                      <div 
                        key={seat} 
                        className="flex items-center gap-2 bg-dark-900 text-white text-xs font-bold px-2 py-1 rounded border"
                        style={{ borderColor: `${zone.color}50` }}
                      >
                        <span>{seat}</span>
                        <span className="text-[10px] text-gray-400">{zone.name}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">Cliquez sur les places pour les sélectionner</p>
              )}
            </div>

            {/* Prix */}
            <div className="space-y-2 mb-6">
              {selectedSeats.map(seat => {
                const rowLetter = seat.replace(/[0-9]/g, '');
                const zone = getZoneForRow(rowLetter, layout);
                return (
                  <div key={seat} className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      Place {seat} ({zone.name})
                    </span>
                    <span className="text-white">{zone.price.toLocaleString()} F</span>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-8 pt-4 border-t border-white/10">
              <span className="text-lg text-gray-300">Total</span>
              <span 
                className="text-3xl font-bold"
                style={{ color: layout.themeColor }}
              >
                {selectedSeats.reduce((sum, seat) => {
                  const rowLetter = seat.replace(/[0-9]/g, '');
                  const zone = getZoneForRow(rowLetter, layout);
                  return sum + zone.price;
                }, 0).toLocaleString()} F
              </span>
            </div>

            <button 
              onClick={handleContinue}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                selectedSeats.length > 0 
                  ? 'text-white shadow-lg' 
                  : 'bg-dark-700 text-gray-500 cursor-not-allowed'
              }`}
              style={{ 
                backgroundColor: selectedSeats.length > 0 ? layout.themeColor : undefined,
                boxShadow: selectedSeats.length > 0 ? `0 10px 30px ${layout.themeColor}40` : undefined
              }}
            >
              Continuer vers le paiement
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Info livraison */}
            <div className="mt-6 p-4 bg-dark-900/50 rounded-xl border border-white/5">
              <p className="text-xs text-gray-400 text-center">
                🎫 Billet électronique - Scannez à l'entrée
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
