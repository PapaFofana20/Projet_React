import { jsPDF } from 'jspdf';

export interface TicketData {
  id: string;
  movieTitle: string;
  moviePoster?: string;
  date: string;
  time: string;
  cinema: string;
  seats: string[];
  totalPrice: number;
  transactionId?: string;
  userEmail?: string;
  genre?: string;
  director?: string;
}

export function downloadTicketPDF(ticket: TicketData) {
  try {
    console.log('=== Début du téléchargement du billet ===');
    console.log('Ticket data:', ticket);
    
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a5'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Fond noir
    pdf.setFillColor(15, 15, 30);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Titre SENEFLIX
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    pdf.text('SENEFLIX', 20, 25);

    // Titre du film
    pdf.setFontSize(16);
    pdf.setTextColor(255, 255, 255);
    pdf.text(ticket.movieTitle, 20, 40);

    // Informations
    pdf.setFontSize(11);
    pdf.setTextColor(200, 200, 200);
    pdf.text(`Date: ${ticket.date}`, 20, 55);
    pdf.text(`Heure: ${ticket.time}`, 20, 65);
    pdf.text(`Cinéma: ${ticket.cinema}`, 20, 75);
    pdf.text(`Places: ${ticket.seats.join(', ')}`, 20, 85);
    pdf.text(`Prix: ${ticket.totalPrice.toLocaleString()} F`, 20, 95);

    // Numéro de billet
    pdf.setTextColor(150, 150, 150);
    pdf.setFontSize(9);
    pdf.text(`Billet n°: ${ticket.id}`, 20, 110);

    // Sauvegarder
    const filename = `SENEFLIX-${ticket.movieTitle.replace(/\s+/g, '-')}.pdf`;
    pdf.save(filename);
    
    console.log('=== Téléchargement terminé avec succès ===');
  } catch (error) {
    console.error('ERREUR lors du téléchargement:', error);
    alert('Erreur lors du téléchargement du billet. Voir la console pour plus de détails.');
  }
}
