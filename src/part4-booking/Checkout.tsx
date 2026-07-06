import { Link, useParams } from 'react-router-dom';
import { CreditCard, CheckCircle, ArrowLeft, Globe, RefreshCw, AlertCircle, Loader2, ShieldCheck, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useBookings } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { fetchExchangeRates, convertFromFCFA, formatCurrency, currencies } from '../services/exchangeRateService';
import type { ExchangeRates } from '../services/exchangeRateService';
import { processPayment, formatCardNumber, detectCardType, TEST_CARDS, validateCardNumber, validateExpiry, validateCvv } from '../services/paymentService';
import { downloadTicketPDF } from '../services/ticketPDFService';

export default function Checkout() {
  const { id } = useParams();
  const { addBooking } = useBookings();
  const { user } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [isLoadingRates, setIsLoadingRates] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('FCFA');
  const [lastBookingId, setLastBookingId] = useState<string | null>(null);
  
  // États du paiement
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  
  // Données du formulaire
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardType, setCardType] = useState('Inconnu');

  useEffect(() => {
    const saved = localStorage.getItem('pending_booking');
    if (saved) {
      setBookingData(JSON.parse(saved));
    }
  }, []);

  // Charger les taux de change au chargement du composant
  useEffect(() => {
    const loadRates = async () => {
      setIsLoadingRates(true);
      const rates = await fetchExchangeRates();
      setExchangeRates(rates);
      setIsLoadingRates(false);
    };
    loadRates();
  }, []);

  // Rafraîchir les taux de change
  const handleRefreshRates = async () => {
    setIsLoadingRates(true);
    const rates = await fetchExchangeRates();
    setExchangeRates(rates);
    setIsLoadingRates(false);
  };

  // Obtenir le prix dans la devise sélectionnée
  const getPriceInCurrency = (fcfaPrice: number) => {
    if (selectedCurrency === 'FCFA') {
      return formatCurrency(fcfaPrice, 'FCFA');
    }
    return formatCurrency(convertFromFCFA(fcfaPrice, selectedCurrency, exchangeRates), selectedCurrency);
  };

  // Gérer le changement du numéro de carte
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    setCardType(detectCardType(formatted));
  };

  // Gérer le changement de l'expiration
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setCardExpiry(value);
  };

  // Traiter le paiement
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (!bookingData || !user) {
      setPaymentError('Données de réservation manquantes.');
      return;
    }

    // Validation côté client
    if (!cardName.trim()) {
      setPaymentError('Veuillez entrer le nom sur la carte.');
      return;
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (!validateCardNumber(cleanCardNumber)) {
      setPaymentError('Numéro de carte invalide.');
      return;
    }

    if (!validateExpiry(cardExpiry)) {
      setPaymentError('Date d\'expiration invalide ou expirée.');
      return;
    }

    if (!validateCvv(cardCvv)) {
      setPaymentError('CVV invalide.');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await processPayment({
        amount: bookingData.totalPrice,
        currency: selectedCurrency,
        cardNumber: cleanCardNumber,
        cardExpiry: cardExpiry,
        cardCvv: cardCvv,
        cardName: cardName,
        description: `Réservation billet cinéma - ${bookingData.movieTitle}`
      });

      if (response.success) {
        // Sauvegarder la réservation
        const newBookingData = {
          userEmail: user.email,
          movieId: bookingData.movieId,
          movieTitle: bookingData.movieTitle,
          moviePoster: bookingData.moviePoster,
          date: bookingData.date,
          time: bookingData.time,
          cinema: bookingData.cinema,
          seats: bookingData.seats,
          totalPrice: bookingData.totalPrice,
          status: 'upcoming' as const,
          transactionId: response.transactionId
        };
        addBooking(newBookingData);
        
        // Get the last booking id
        const newId = `B-${Date.now().toString().slice(-5)}`;
        setLastBookingId(newId);
        setTransactionId(response.transactionId || null);
        localStorage.removeItem('pending_booking');
        setIsSuccess(true);
      } else {
        setPaymentError(response.message);
      }
    } catch (error) {
      setPaymentError('Une erreur est survenue lors du traitement du paiement.');
    } finally {
      setIsProcessing(false);
    }
  };

  // État de succès
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
          
          {transactionId && (
            <div className="bg-dark-900 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">ID Transaction</p>
              <p className="font-mono text-sm text-brand-400">{transactionId}</p>
            </div>
          )}
          
          {bookingData && (
            <>
              <div className="bg-dark-900 rounded-lg p-4 mb-4 text-left">
                <p className="font-semibold text-lg">{bookingData.movieTitle}</p>
                <p className="text-gray-400 text-sm">{bookingData.date} à {bookingData.time}</p>
                <p className="text-gray-400 text-sm">Places: {bookingData.seats.join(', ')}</p>
              </div>
              <div className="bg-white p-3 rounded-xl inline-block mb-6 shadow-lg">
                <QRCodeSVG 
                  value={`SENEFLIX-TICKET-${transactionId || Date.now()}-${bookingData.movieTitle}`} 
                  size={120}
                  level="H"
                />
                <p className="text-black text-[10px] mt-2 font-mono uppercase tracking-widest">Scannez pour entrer</p>
              </div>
            </>
          )}
          <div className="space-y-4">
            <button 
              onClick={() => {
                if (lastBookingId && bookingData) {
                  downloadTicketPDF({
                    id: lastBookingId,
                    movieTitle: bookingData.movieTitle,
                    moviePoster: bookingData.moviePoster,
                    date: bookingData.date,
                    time: bookingData.time,
                    cinema: bookingData.cinema,
                    seats: bookingData.seats,
                    totalPrice: bookingData.totalPrice,
                    transactionId: transactionId || undefined,
                    userEmail: user?.email
                  });
                }
              }}
              className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl transition-colors"
            >
              <Download className="w-5 h-5" />
              Télécharger le billet
            </button>
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
              
              {/* Sélecteur de devise */}
              <div className="mt-4 p-4 bg-dark-900 rounded-xl border border-dark-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-brand-500" />
                    <span className="text-sm text-gray-400">Prix dans d'autres devises</span>
                    <button
                      onClick={handleRefreshRates}
                      disabled={isLoadingRates}
                      className="p-1 hover:bg-dark-700 rounded transition-colors disabled:opacity-50"
                      title="Rafraîchir les taux"
                    >
                      <RefreshCw className={`w-3 h-3 text-gray-400 ${isLoadingRates ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {currencies.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.flag} {curr.code}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Affichage des prix dans toutes les devises */}
                <div className="grid grid-cols-3 gap-2">
                  {currencies.map((curr) => {
                    const price = curr.code === 'FCFA' 
                      ? bookingData.totalPrice 
                      : convertFromFCFA(bookingData.totalPrice, curr.code, exchangeRates);
                    return (
                      <div 
                        key={curr.code}
                        className={`text-center p-2 rounded-lg ${
                          selectedCurrency === curr.code 
                            ? 'bg-brand-500/20 border border-brand-500/50' 
                            : 'bg-dark-800 border border-dark-700'
                        }`}
                      >
                        <p className="text-xs text-gray-400 mb-1">{curr.flag} {curr.code}</p>
                        <p className="font-bold text-sm">
                          {formatCurrency(
                            curr.code === 'FCFA' ? price : convertFromFCFA(bookingData.totalPrice, curr.code, exchangeRates),
                            curr.code
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
                
                {/* Prix total principal */}
                <div className="mt-4 pt-4 border-t border-dark-700 text-center">
                  <p className="text-sm text-gray-400 mb-1">Prix total</p>
                  <p className="text-2xl font-bold text-white">{getPriceInCurrency(bookingData.totalPrice)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-dark-800 rounded-2xl p-6 md:p-8 border border-dark-700">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-dark-700">
          <CreditCard className="w-6 h-6 text-brand-500" />
          <div className="flex-1">
            <h2 className="text-xl font-bold">Informations de paiement</h2>
            <p className="text-sm text-gray-500">Mode Test API - Paiements simulés</p>
          </div>
          <div className="flex items-center gap-1 text-green-500 text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Sécurisé</span>
          </div>
        </div>

        {/* Message d'erreur */}
        <AnimatePresence>
          {paymentError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-red-400 text-sm">{paymentError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handlePayment} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="cardName">Nom sur la carte</label>
            <input 
              type="text" 
              id="cardName" 
              required
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              placeholder="Ex: Jean Dupont"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="cardNumber">
              Numéro de carte
              <span className="ml-2 text-xs text-gray-500">({cardType})</span>
            </label>
            <input 
              type="text" 
              id="cardNumber" 
              required
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono tracking-wider"
              placeholder="4242 4242 4242 4242"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="expiry">Date d'expiration</label>
              <input 
                type="text" 
                id="expiry" 
                required
                value={cardExpiry}
                onChange={handleExpiryChange}
                maxLength={5}
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
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                placeholder="123"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isProcessing}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-white font-bold py-4 rounded-xl mt-4 transition-all shadow-lg shadow-brand-500/30 text-lg flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Payer maintenant
              </>
            )}
          </button>
          
          {/* Cartes de test disponibles */}
          <div className="mt-6 p-4 bg-dark-900 rounded-xl border border-dark-700">
            <p className="text-xs text-gray-400 mb-3 font-medium">Cartes de test disponibles :</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 bg-dark-800 rounded-lg">
                <span className="font-mono text-green-400">{TEST_CARDS.SUCCESS}</span>
                <span className="text-gray-500">→ Succès</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-dark-800 rounded-lg">
                <span className="font-mono text-red-400">{TEST_CARDS.DECLINED}</span>
                <span className="text-gray-500">→ Refusé</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-dark-800 rounded-lg">
                <span className="font-mono text-yellow-400">{TEST_CARDS.INSUFFICIENT}</span>
                <span className="text-gray-500">→ Fonds insuffisants</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-dark-800 rounded-lg">
                <span className="font-mono text-orange-400">{TEST_CARDS.EXPIRED}</span>
                <span className="text-gray-500">→ Expirée</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-600 mt-3">
              Expiration: 12/28 | CVV: 123 | Tout nom fonctionne
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
