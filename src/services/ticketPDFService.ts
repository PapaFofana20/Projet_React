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
}

export async function generateTicketPDF(ticket: TicketData) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a6',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;

  // Background
  pdf.setFillColor(15, 23, 42); // Dark background
  pdf.roundedRect(0, 0, pageWidth, pageHeight, 3, 3, 'F');

  // Header - Logo / Brand
  pdf.setFillColor(234, 88, 12); // Brand color
  pdf.rect(0, 0, pageWidth, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SENEFLIX', pageWidth / 2, 20, { align: 'center' });

  // Movie Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(ticket.movieTitle, pageWidth / 2, 45, { align: 'center' });

  // Ticket ID
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(156, 163, 175);
  pdf.text(`Billet: ${ticket.id}`, pageWidth / 2, 52, { align: 'center' });

  // Divider
  pdf.setDrawColor(55, 65, 81);
  pdf.setLineWidth(0.5);
  pdf.line(margin, 58, pageWidth - margin, 58);

  // Details Section
  const startY = 68;
  const lineHeight = 7;

  pdf.setTextColor(156, 163, 175);
  pdf.setFontSize(9);
  pdf.text('Cinéma', margin, startY);
  pdf.text('Date', margin, startY + lineHeight);
  pdf.text('Heure', margin, startY + lineHeight * 2);
  pdf.text('Places', margin, startY + lineHeight * 3);
  pdf.text('Prix', margin, startY + lineHeight * 4);
  if (ticket.transactionId) {
    pdf.text('Transaction', margin, startY + lineHeight * 5);
  }

  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text(ticket.cinema, pageWidth / 2, startY);
  pdf.text(ticket.date, pageWidth / 2, startY + lineHeight);
  pdf.text(ticket.time, pageWidth / 2, startY + lineHeight * 2);
  pdf.text(ticket.seats.join(', '), pageWidth / 2, startY + lineHeight * 3);
  pdf.text(`${ticket.totalPrice.toLocaleString()} FCFA`, pageWidth / 2, startY + lineHeight * 4);
  if (ticket.transactionId) {
    pdf.text(ticket.transactionId, pageWidth / 2, startY + lineHeight * 5);
  }

  // QR Code Placeholder (can integrate qrcode.react to SVG then to PDF)
  const qrSize = 30;
  const qrX = (pageWidth - qrSize) / 2;
  const qrY = startY + lineHeight * 7;

  // Add a box for QR
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(qrX, qrY, qrSize, qrSize, 2, 2, 'F');
  pdf.setTextColor(15, 23, 42);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('QR', qrX + qrSize / 2, qrY + qrSize / 2 + 2, { align: 'center' });

  // Footer
  pdf.setTextColor(107, 114, 128);
  pdf.setFontSize(8);
  pdf.text('© 2025 SENEFLIX - Tous droits réservés', pageWidth / 2, pageHeight - 10, { align: 'center' });

  return pdf;
}

export async function downloadTicketPDF(ticket: TicketData) {
  const pdf = await generateTicketPDF(ticket);
  pdf.save(`BILLET-SENEFLIX-${ticket.id}.pdf`);
}
