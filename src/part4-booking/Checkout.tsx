import { Link, useParams } from 'react-router-dom';
import { CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Checkout() {
  const { id } = useParams();
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
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
          <h2 className="text-3xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-gray-400 mb-8">Your tickets have been confirmed and sent to your email.</p>
          <div className="space-y-4">
            <Link 
              to="/dashboard"
              className="block w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-3 rounded-xl transition-colors"
            >
              View My Tickets
            </Link>
            <Link 
              to="/"
              className="block w-full bg-dark-700 hover:bg-dark-600 text-white font-medium py-3 rounded-xl transition-colors"
            >
              Back to Home
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
          Back to Seats
        </Link>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <div className="bg-dark-800 rounded-2xl p-6 md:p-8 border border-dark-700">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-dark-700">
          <CreditCard className="w-6 h-6 text-brand-500" />
          <h2 className="text-xl font-bold">Payment Details (Mock)</h2>
        </div>

        <form onSubmit={handlePayment} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="cardName">Name on Card</label>
            <input 
              type="text" 
              id="cardName" 
              required
              className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="cardNumber">Card Number</label>
            <input 
              type="text" 
              id="cardNumber" 
              required
              className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono tracking-wider"
              placeholder="0000 0000 0000 0000"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="expiry">Expiry Date</label>
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
                className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                placeholder="123"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-xl mt-4 transition-all shadow-lg shadow-brand-500/30 text-lg flex items-center justify-center gap-2"
          >
            Pay Now
          </button>
          
          <p className="text-gray-500 text-sm text-center mt-4">
            This is a mock payment form for the student project. No real transactions will occur.
          </p>
        </form>
      </div>
    </div>
  );
}
