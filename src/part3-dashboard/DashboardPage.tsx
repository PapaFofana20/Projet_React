import { useState } from 'react';
import { Calendar, Clock, MapPin, QrCode, Ticket, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Bookings
const INITIAL_BOOKINGS = [
  {
    id: "B-10492",
    movieTitle: "Dune: Part Two",
    date: "Mars 22, 2026",
    time: "19:30",
    cinema: "Grand Rex Paris",
    seats: ["J12", "J13"],
    status: "upcoming"
  },
  {
    id: "B-09281",
    movieTitle: "Oppenheimer",
    date: "Février 15, 2026",
    time: "18:00",
    cinema: "UGC Les Halles",
    seats: ["E05"],
    status: "past"
  }
];

export default function DashboardPage() {
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);

  const handleDelete = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
        <p className="text-gray-400">Manage your bookings and view your tickets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - User Stats / Menu */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center text-xl font-bold">
                JD
              </div>
              <div>
                <h2 className="text-xl font-semibold">John Doe</h2>
                <p className="text-gray-400 text-sm">Cinephile Member</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-dark-700">
                <span className="text-gray-400">Total Bookings</span>
                <span className="font-semibold">{bookings.length}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Reward Points</span>
                <span className="font-semibold text-brand-500">450 pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Tickets & Bookings */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Ticket className="w-6 h-6 text-brand-500" />
            My Tickets
          </h2>
          
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-12 bg-dark-800 rounded-xl border border-dark-700">
                <Ticket className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400">No tickets found</h3>
              </div>
            ) : bookings.map((booking, idx) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-dark-800 rounded-xl overflow-hidden border ${booking.status === 'upcoming' ? 'border-brand-500/50' : 'border-dark-700'} flex flex-col sm:flex-row`}
              >
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wider ${booking.status === 'upcoming' ? 'bg-brand-500/20 text-brand-500' : 'bg-dark-700 text-gray-400'}`}>
                        {booking.status}
                      </span>
                      <h3 className="text-xl font-bold mt-2">{booking.movieTitle}</h3>
                      <span className="text-sm text-gray-400 font-mono">Booking #{booking.id}</span>
                    </div>
                    <button 
                      onClick={() => handleDelete(booking.id)}
                      className="p-2 text-gray-500 hover:text-brand-500 hover:bg-dark-700 rounded-full transition-colors"
                      title="Delete ticket"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm mt-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-4 h-4 text-brand-500" />
                      {booking.date}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4 text-brand-500" />
                      {booking.time}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 col-span-2">
                      <MapPin className="w-4 h-4 text-brand-500" />
                      {booking.cinema}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 col-span-2">
                      <span className="font-semibold text-white mr-1">Seats:</span>
                      {booking.seats.join(', ')}
                    </div>
                  </div>
                </div>
                
                <div className="bg-dark-900 p-6 sm:w-48 flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-dark-700 border-dashed">
                  <div className="bg-white p-2 rounded-lg mb-3">
                    <QrCode className="w-20 h-20 text-black" />
                  </div>
                  <button className="text-sm text-brand-500 hover:text-brand-400 font-medium">
                    Download PDF
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
