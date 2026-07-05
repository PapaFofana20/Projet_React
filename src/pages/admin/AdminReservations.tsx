import { Ticket } from 'lucide-react';
import { useBookings } from '../../context/BookingContext';

export default function AdminReservations() {
  const { bookings } = useBookings();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Réservations</h1>
        <p className="text-gray-400 mt-1">{bookings.length} réservations au total</p>
      </div>

      {/* Reservations Table */}
      <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-900">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Film</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Client</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Date</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Places</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Montant</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                    <Ticket className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Aucune réservation</p>
                    <p className="text-sm mt-2">Les réservations apparaîtront ici</p>
                  </td>
                </tr>
              ) : bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-dark-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={booking.moviePoster} 
                        alt={booking.movieTitle}
                        className="w-10 h-14 object-cover rounded"
                      />
                      <span className="font-medium text-white">{booking.movieTitle}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{booking.userEmail}</td>
                  <td className="px-6 py-4 text-gray-400">{booking.date}</td>
                  <td className="px-6 py-4 text-gray-400">
                    <div className="flex flex-wrap gap-1">
                      {booking.seats.map((seat: string, index: number) => (
                        <span key={index} className="bg-dark-700 px-2 py-1 rounded text-xs">
                          {seat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-red-500 font-medium">{booking.totalPrice.toLocaleString()} FCFA</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'upcoming' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {booking.status === 'upcoming' ? 'À venir' : 'Passé'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
