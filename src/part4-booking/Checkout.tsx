import { Link, useParams } from 'react-router-dom';
import { CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useBookings } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';

export default function Checkout() {
  const { id } = useParams();
  const { addBooking } = useBookings();
  const { user } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('pending_booking');
    if (saved) {
      setBookingData(JSON.parse(saved));
    }
  }, []);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingData && user) {
      addBooking({
        userEmail: user.email,
        movieId: bookingData.movieId,
        movieTitle: bookingData.movieTitle,
        moviePoster: bookingData.moviePoster,
        date: bookingData.date,
        time: bookingData.time,
        cinema: bookingData.cinema,
        seats: bookingData.seats,
        totalPrice: bookingData.totalPrice,
        status: 'upcoming'
      });
      localStorage.removeItem('pending_booking');
    }
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="flex-grow flex items-center justify-center p-4 min-h-[60vh]">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-dark-800 p-8 rounded-2xl text-center max-w-md w-full border border-dark-700"
        >
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Paiement réussi !</h2>
          <p className="text-gray-400 mb-4">Votre réservation a été confirmée.</p>
          {bookingData && (
            <>
              <div className="bg-dark-900 rounded-lg p-4 mb-4 text-left">
                <p className="font-semibold text-lg">{bookingData.movieTitle}</p>
                <p className="text-gray-400 text-sm">{bookingData.date} à {bookingData.time}</p>
                <p className="text-gray-400 text-sm">Places: {bookingData.seats.join(', ')}</p>
              </div>
              <div className="bg-white p-3 rounded-xl inline-block mb-6 shadow-lg">
                <QRCodeSVG 
                  value={`SENEFLIX-TICKET-${Date.now()}-${bookingData.movieTitle}`} 
                  size={120}
                  level="H"
                />
                <p className="text-black text-[10px] mt-2 font-mono uppercase tracking-widest">Scannez pour entrer</p>
              </div>
            </>
          )}
          <div className="space-y-4">
            <Link 
              to="/dashboard"
              className="block w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-3 rounded-xl transition-colors"
            >
              Voir mes billets
            </Link>
            <Link 
              to="/"
              className="block w-full bg-dark-700 hover:bg-dark-600 text-white font-medium py-3 rounded-xl transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 w-full">
      <div className="mb-8">
        <Link to={`/book/${id}/seats`} className="text-gray-400 hover:text-white flex items-center gap-2 mb-2 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour aux places
        </Link>
        <h1 className="text-3xl font-bold">Paiement</h1>
      </div>

            {bookingData && (
        <div className="bg-dark-800 rounded-2xl p-6 mb-8 border border-dark-700">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-500" />
            Récapitulatif de la réservation
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-24 h-32 rounded-lg overflow-hidden shrink-0">
              <img src={bookingData.moviePoster} alt={bookingData.movieTitle} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{bookingData.movieTitle}</h3>
              <p className="text-gray-400">{bookingData.cinema}</p>
              <p className="text-brand-500">{bookingData.date} à {bookingData.time}</p>
              <p className="text-gray-300 mt-2">Places: <span className="font-bold">{bookingData.seats.join(', ')}</span></p>
              <p className="text-xl font-bold mt-2 text-white">Total: {bookingData.totalPrice} FCFA</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-dark-800 rounded-2xl p-6 md:p-8 border border-dark-700">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-dark-700">
          <CreditCard className="w-6 h-6 text-brand-500" />
          <h2 className="text-xl font-bold">Informations de paiement</h2>
        </div>

        <form onSubmit={handlePayment} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="cardName">Nom sur la carte</label>
            <input 
              type="text" 
              id="cardName" 
              required
              className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              placeholder="Nom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="cardNumber">Numéro de carte</label>
            <input 
              type="text" 
              id="cardNumber" 
              required
              maxLength={19}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono tracking-wider"
              placeholder="0000 0000 0000 0000"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="expiry">Date d'expiration</label>
              <input 
                type="text" 
                id="expiry" 
                required
                className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                placeholder="MM/YY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="cvv">CVV</label>
              <input 
                type="text" 
                id="cvv" 
                required
                maxLength={3}
                className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                placeholder="123"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-xl mt-4 transition-all shadow-lg shadow-brand-500/30 text-lg flex items-center justify-center gap-2"
          >
            Payer maintenant
          </button>
          
          <p className="text-gray-500 text-sm text-center mt-4">
            Formulaire de test. Aucune transaction réelle ne sera effectuée.
          </p>
        </form>
      </div>
    </div>
  );
}
