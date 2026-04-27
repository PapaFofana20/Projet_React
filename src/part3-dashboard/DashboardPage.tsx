import { Calendar, Clock, MapPin, Ticket, Trash2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useBookings, type Booking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';

function generatePDF(booking: Booking) {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a5',
    orientation: 'portrait'
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  
  doc.setFillColor(250, 250, 252);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setFillColor(14, 165, 233);
  doc.circle(pageWidth / 2, 28, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('S', pageWidth / 2, 30.5, { align: 'center' });
  
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('SENEFLIX', pageWidth / 2, 50, { align: 'center' });
  
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('BILLET DE CINÉMA', pageWidth / 2, 57, { align: 'center' });
  
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, 63, pageWidth - margin, 63);
  
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, 68, pageWidth - margin * 2, 35, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, 68, pageWidth - margin * 2, 35, 3, 3, 'S');
  
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('FILM', margin + 5, 76);
  
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(booking.movieTitle, pageWidth - margin * 2 - 10);
  doc.text(titleLines, margin + 5, 82);
  
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`N° ${booking.id}`, pageWidth - margin - 5, 76, { align: 'right' });
  
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, 108, (pageWidth - margin * 2) / 2 - 2, 30, 2, 2, 'F');
  doc.roundedRect(margin + (pageWidth - margin * 2) / 2 + 2, 108, (pageWidth - margin * 2) / 2 - 2, 30, 2, 2, 'F');
  
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.text('DATE', margin + 4, 116);
  doc.text('HEURE', pageWidth / 2 + 4, 116);
  
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.date, margin + 4, 123);
  doc.text(booking.time, pageWidth / 2 + 4, 123);
  
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('CINÉMA', margin + 4, 132);
  doc.text('SIÈGES', pageWidth / 2 + 4, 132);
  
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  const cinemaLines = doc.splitTextToSize(booking.cinema, (pageWidth - margin * 2) / 2 - 8);
  doc.text(cinemaLines, margin + 4, 137);
  doc.text(booking.seats.join(', '), pageWidth / 2 + 4, 137);
  
  doc.setFillColor(14, 165, 233);
  doc.roundedRect(margin, 145, pageWidth - margin * 2, 18, 2, 2, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('MONTANT TOTAL', pageWidth / 2, 151, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`${booking.totalPrice} FCFA`, pageWidth / 2, 159, { align: 'center' });
  
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.text('Arrivez 15 minutes avant la séance', pageWidth / 2, 172, { align: 'center' });
  doc.text('Ce billet est personnel et non transférable', pageWidth / 2, 177, { align: 'center' });
  
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, 185, pageWidth - margin, 185);
  
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageWidth / 2 - 18, 188, 36, 36, 2, 2, 'F');
  
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(5);
  doc.setFont('helvetica', 'normal');
  doc.text('SCANNEZ', pageWidth / 2, 227, { align: 'center' });
  
  doc.setFontSize(4);
  doc.text(`TICKET-${booking.id}`, pageWidth / 2, 231, { align: 'center' });
  
  doc.save(`SENEFLIX_BILLET_${booking.id}.pdf`);
}

export default function DashboardPage() {
  const { bookings, removeBooking } = useBookings();
  const { user } = useAuth();

  // Ne montrer que les billets de l'utilisateur connecté
  const userBookings = bookings.filter(b => b.userEmail === user?.email);

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce billet ?')) {
      removeBooking(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mon Tableau de Bord</h1>
          <p className="text-gray-400">Gérez vos réservations et consultez vos billets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
                <div className="lg:col-span-1 space-y-6">
          <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center text-xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'N'}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user?.name || 'Client'}</h2>
                <p className="text-gray-400 text-sm">Accès aux meilleures séances</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-dark-700">
                <span className="text-gray-400">Total des réservations</span>
                <span className="font-semibold">{userBookings.length}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Billets actifs</span>
                <span className="font-semibold text-brand-500">
                  {userBookings.filter(b => b.status === 'upcoming').length}
                </span>
              </div>
            </div>
          </div>
        </div>

                <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Ticket className="w-6 h-6 text-brand-500" />
            Mes Billets
          </h2>
          
          <div className="space-y-4">
            {userBookings.length === 0 ? (
              <div className="text-center py-16 bg-dark-800 rounded-xl border border-dark-700">
                <Ticket className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">Aucun billet trouvé</h3>
                <p className="text-gray-500 mb-6">Vous n'avez pas encore de réservations</p>
                <Link 
                  to="/"
                  className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-medium px-6 py-3 rounded-xl transition-colors"
                >
                  Explorer les films
                </Link>
              </div>
            ) : userBookings.map((booking, idx) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-dark-800 rounded-xl overflow-hidden border ${
                  booking.status === 'upcoming' ? 'border-brand-500/50' : 'border-dark-700'
                } flex flex-col sm:flex-row`}
              >
                                <div className="w-full sm:w-32 md:w-40 shrink-0">
                  <img 
                    src={booking.moviePoster} 
                    alt={booking.movieTitle}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${booking.movieId}/400/600`;
                    }}
                  />
                </div>

                                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wider ${
                        booking.status === 'upcoming' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-dark-700 text-gray-400'
                      }`}>
                        {booking.status === 'upcoming' ? 'À venir' : 'Passé'}
                      </span>
                      <h3 className="text-xl font-bold mt-2">{booking.movieTitle}</h3>
                      <span className="text-sm text-gray-400 font-mono">Réservation #{booking.id}</span>
                    </div>
                    <button 
                      onClick={() => handleDelete(booking.id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-dark-700 rounded-full transition-colors"
                      title="Supprimer le billet"
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
                      <span className="font-semibold text-white mr-1">Places:</span>
                      {booking.seats.join(', ')}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 col-span-2">
                      <span className="font-semibold text-brand-500 mr-1">Prix:</span>
                      {booking.totalPrice} FCFA
                    </div>
                  </div>
                </div>
                
                <div className="bg-dark-900 p-6 sm:w-48 flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-dark-700 border-dashed">
                  <div className="bg-white p-2 rounded-lg mb-3">
                    <QRCodeSVG 
                      value={`SENEFLIX-TICKET-${booking.id}-${booking.movieTitle}`} 
                      size={80}
                      level="H"
                    />
                  </div>
                  <button 
                    onClick={() => generatePDF(booking)}
                    className="flex items-center gap-2 text-sm text-brand-500 hover:text-brand-400 font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Téléchargez votre billet
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