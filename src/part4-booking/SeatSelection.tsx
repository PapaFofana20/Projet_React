import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Armchair, ArrowRight, ArrowLeft } from 'lucide-react';
import { movies } from '../data/movies';
import { useBookings } from '../context/BookingContext';

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings } = useBookings();
  const movie = movies.find(m => m.id === Number(id));
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const CINEMA_LAYOUTS: Record<string, { price: number; rows: string[]; cols: number; aisles: number[] }> = {
    "Cinéma Pathé": { price: 5000, rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], cols: 14, aisles: [3, 9] },
    "Seanema": { price: 4000, rows: ['A', 'B', 'C', 'D', 'E', 'F'], cols: 10, aisles: [4] },
    "CanalOlympia": { price: 3000, rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], cols: 12, aisles: [3, 8] },
    "Institut Français de Dakar": { price: 2500, rows: ['A', 'B', 'C', 'D', 'E'], cols: 8, aisles: [3] },
    "Centre Yennenga": { price: 2000, rows: ['A', 'B', 'C', 'D'], cols: 6, aisles: [2] },
    "Ciné Banlieue": { price: 1500, rows: ['A', 'B', 'C', 'D', 'E', 'F'], cols: 8, aisles: [] },
    "Cinéma El Hilal": { price: 2000, rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], cols: 10, aisles: [2, 7] },
  };

  const CINEMAS = Object.keys(CINEMA_LAYOUTS);
  const [selectedCinema] = useState(CINEMAS[0]);

  const dates = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  });
  
  const times = ['16:00', '17:30', '18:15', '19:00', '20:00'];
  
  const movieIndex = movie ? movie.id : 0;
  const [selectedDate] = useState(dates[movieIndex % dates.length]);
  const [selectedTime] = useState(times[movieIndex % times.length]);

  const currentLayout = CINEMA_LAYOUTS[selectedCinema];

  // Calculer les sièges déjà occupés pour cette séance (tous les utilisateurs)
  const occupiedSeats = bookings
    .filter(b => 
      b.movieId === Number(id) && 
      b.cinema === selectedCinema && 
      b.date === selectedDate && 
      b.time === selectedTime
    )
    .reduce((acc, b) => [...acc, ...b.seats], [] as string[]);

  useEffect(() => {
    setSelectedSeats([]);
  }, [selectedCinema, selectedDate, selectedTime]);

  const toggleSeat = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return; // Empêcher la sélection si occupé

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length < 6) {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length > 0 && movie) {
      
      const bookingData = {
        movieId: movie.id,
        movieTitle: movie.title,
        moviePoster: movie.poster,
        cinema: selectedCinema,
        date: selectedDate,
        time: selectedTime,
        seats: selectedSeats,
        totalPrice: selectedSeats.length * currentLayout.price
      };
      localStorage.setItem('pending_booking', JSON.stringify(bookingData));
      navigate(`/book/${id}/checkout`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-12 w-full">
      
            <div className="lg:w-2/3">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to={`/movie/${id}`} className="text-gray-400 hover:text-white flex items-center gap-2 mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Retour au film
            </Link>
            <h1 className="text-3xl font-bold">Sélectionner les places</h1>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="cinema-select" className="block text-sm font-medium text-gray-400 mb-2">Cinéma</label>
                <div
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg py-2.5 px-4 text-gray-400 cursor-not-allowed"
                >
                  {selectedCinema}
                </div>
              </div>
              
              <div>
                <label htmlFor="date-select" className="block text-sm font-medium text-gray-400 mb-2">Date</label>
                <div
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg py-2.5 px-4 text-gray-400 cursor-not-allowed"
                >
                  {selectedDate}
                </div>
              </div>

              <div>
                <label htmlFor="time-select" className="block text-sm font-medium text-gray-400 mb-2">Heure</label>
                <div
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg py-2.5 px-4 text-gray-400 cursor-not-allowed"
                >
                  {selectedTime}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-2xl p-4 sm:p-8 border border-dark-700 overflow-x-auto">
                    <div className="relative h-12 mb-16 mx-auto max-w-2xl">
            <div className="absolute inset-x-0 bottom-0 h-10 border-t-4 border-brand-500/50 rounded-t-[100%] shadow-[0_-10px_30px_rgba(14,165,233,0.3)]"></div>
            <p className="text-center w-full uppercase tracking-[0.3em] text-gray-400 text-sm absolute top-4 font-semibold">Écran</p>
          </div>

          <div className="flex flex-col gap-2 sm:gap-4 items-center min-w-max mx-auto pb-4">
            {currentLayout.rows.map((row) => (
              <div key={row} className="flex items-center gap-2 sm:gap-4">
                <div className="w-4 sm:w-6 text-center font-bold text-gray-500 text-xs sm:text-base">{row}</div>
                <div className="flex gap-1 sm:gap-2">
                  {[...Array(currentLayout.cols)].map((_, col) => {
                    const seatNumber = col + 1;
                    const seatId = `${row}${seatNumber}`;
                    const isSelected = selectedSeats.includes(seatId);
                    const isOccupied = occupiedSeats.includes(seatId);

                    const hasAisle = currentLayout.aisles.includes(col);

                    return (
                      <div key={seatId} className={`flex ${hasAisle ? 'mr-3 sm:mr-6' : ''}`}>
                        <button
                          onClick={() => toggleSeat(seatId)}
                          disabled={isOccupied}
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-t-md sm:rounded-t-lg rounded-b-sm flex items-center justify-center transition-all group ${
                            isSelected 
                              ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/40 relative -top-0.5 sm:-top-1' 
                              : isOccupied
                                ? 'bg-dark-900 border border-dark-700 text-white/10 cursor-not-allowed'
                                : 'bg-dark-700 text-transparent hover:bg-brand-500/40'
                          }`}
                        >
                          <Armchair className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${
                            isSelected 
                              ? 'opacity-100' 
                              : isOccupied
                                ? 'opacity-10'
                                : 'opacity-30 group-hover:opacity-100 text-white'
                          }`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="w-4 sm:w-6 text-center font-bold text-gray-500 text-xs sm:text-base">{row}</div>
              </div>
            ))}
          </div>

                    <div className="flex justify-center gap-8 mt-12 pt-8 border-t border-dark-700">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-dark-700 flex items-center justify-center"><Armchair className="w-4 h-4 text-white/30" /></div>
              <span className="text-sm text-gray-400">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-brand-500 flex items-center justify-center"><Armchair className="w-4 h-4 text-white" /></div>
              <span className="text-sm text-gray-400">Sélectionné</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-dark-900 border border-dark-700 flex items-center justify-center"><Armchair className="w-4 h-4 text-white/10" /></div>
              <span className="text-sm text-gray-400">Vendu</span>
            </div>
          </div>
        </div>
      </div>

            <div className="lg:w-1/3">
        <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700 sticky top-24">
          <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>
          
          <div className="mb-6 pb-6 border-b border-dark-700">
            <h3 className="font-semibold text-lg mb-1">{movie?.title || 'Film'}</h3>
            <p className="text-gray-400 text-sm">{selectedCinema} • VF</p>
            <p className="text-brand-500 text-sm font-medium mt-1">{selectedDate} • {selectedTime}</p>
          </div>

          <div className="mb-6 pb-6 border-b border-dark-700 min-h-[100px]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400">Places sélectionnées</span>
              <span className="font-semibold">{selectedSeats.length}</span>
            </div>
            {selectedSeats.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map(seat => (
                  <span key={seat} className="bg-dark-900 text-white text-xs font-bold px-2 py-1 rounded border border-dark-700">
                    {seat}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Veuillez sélectionner vos places pour continuer.</p>
            )}
          </div>

          <div className="flex justify-between items-center mb-8">
            <span className="text-lg text-gray-300">Total</span>
            <span className="text-3xl font-bold">{(selectedSeats.length * currentLayout.price)} FCFA</span>
          </div>

          <button 
            onClick={handleContinue}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
              selectedSeats.length > 0 
                ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 cursor-pointer' 
                : 'bg-dark-700 text-gray-500 cursor-not-allowed pointer-events-none'
            }`}
          >
            Continuer vers le paiement
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  );
}
