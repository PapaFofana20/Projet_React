import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Armchair, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Veuillez vous connecter pour continuer la réservation' } });
    }
  }, [isAuthenticated, navigate]);

  // Generate 8 rows of 12 seats
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const SEAT_PRICE = 5000;

  const toggleSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length < 6) {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-12 w-full bg-black text-white min-h-screen">
      
      <div className="lg:w-2/3">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to={`/movie/${id}`} className="text-gray-400 hover:text-white flex items-center gap-2 mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Retour au film
            </Link>
            <h1 className="text-3xl font-bold">Sélection des Sièges</h1>
          </div>
        </div>

        <div className="bg-dark-800 rounded-2xl p-8 border border-dark-700 overflow-x-auto">
          <div className="relative h-12 mb-16 mx-auto max-w-2xl">
            <div className="absolute inset-x-0 bottom-0 h-10 border-t-4 border-brand-500/50 rounded-t-[100%] shadow-[0_-10px_30px_rgba(229,9,20,0.3)]"></div>
            <p className="text-center w-full uppercase tracking-[0.3em] text-gray-400 text-sm absolute top-4 font-semibold">Écran</p>
          </div>

          <div className="flex flex-col gap-4 items-center">
            {rows.map((row) => (
              <div key={row} className="flex items-center gap-4">
                <div className="w-6 text-center font-bold text-gray-500">{row}</div>
                <div className="flex gap-2">
                  {[...Array(12)].map((_, col) => {
                    const seatNumber = col + 1;
                    const seatId = `${row}${seatNumber}`;
                    const isSelected = selectedSeats.includes(seatId);
                    
                    const hasAisle = col === 3 || col === 8;

                    return (
                      <div key={seatId} className={`flex ${hasAisle ? 'mr-6' : ''}`}>
                        <button
                          onClick={() => toggleSeat(seatId)}
                          className={`w-8 h-8 rounded-t-lg rounded-b-sm flex items-center justify-center transition-all group ${
                            isSelected 
                              ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/40 relative -top-1' 
                              : 'bg-dark-700 text-transparent hover:bg-brand-500/40'
                          }`}
                        >
                          <Armchair className={`w-5 h-5 ${isSelected ? 'opacity-100' : 'opacity-30 group-hover:opacity-100 text-white'}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="w-6 text-center font-bold text-gray-500">{row}</div>
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
          <h2 className="text-xl font-bold mb-4">Résumé de la Réservation</h2>
          
          <div className="mb-6 pb-6 border-b border-dark-700">
            <h3 className="font-semibold text-lg mb-1">Dune: Part Two</h3>
            <p className="text-gray-400 text-sm">Cinéma Pathé • VF</p>
            <p className="text-brand-500 text-sm font-medium mt-1">Mars 22, 2026 • 19:30</p>
          </div>

          <div className="mb-6 pb-6 border-b border-dark-700 min-h-[100px]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400">Sièges Sélectionnés</span>
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
              <p className="text-sm text-gray-500 italic">Veuillez sélectionner vos sièges pour continuer.</p>
            )}
          </div>

          <div className="flex justify-between items-center mb-8">
            <span className="text-lg text-gray-300">Total</span>
            <span className="text-3xl font-bold">{(selectedSeats.length * SEAT_PRICE)} FCFA</span>
          </div>

          <Link 
            to={`/book/${id}/checkout`}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
              selectedSeats.length > 0 
                ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30' 
                : 'bg-dark-700 text-gray-500 cursor-not-allowed pointer-events-none'
            }`}
          >
            Continuer vers le Paiement
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

    </div>
  );
}
