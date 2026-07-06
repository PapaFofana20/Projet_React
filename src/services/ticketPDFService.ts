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

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

const generateQRCodeDataUrl = (_text: string): Promise<string> => {
  return new Promise((resolve) => {
    // Simple manual QR approach using canvas
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      resolve('');
      return;
    }
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = 'black';
    
    // Draw a simple grid pattern as fallback
    const cellSize = 32;
    for (let i = 0; i < size; i += cellSize) {
      for (let j = 0; j < size; j += cellSize) {
        if ((i + j) % (cellSize * 2) === 0) {
          ctx.fillRect(i, j, cellSize, cellSize);
        }
      }
    }
    
    // Draw position patterns (the big squares)
    const posSize = 64;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, posSize, posSize); // TL
    ctx.fillRect(size - posSize, 0, posSize, posSize); // TR
    ctx.fillRect(0, size - posSize, posSize, posSize); // BL
    
    ctx.fillStyle = 'white';
    ctx.fillRect(8, 8, 48, 48);
    ctx.fillRect(size - 56, 8, 48, 48);
    ctx.fillRect(8, size - 56, 48, 48);
    
    ctx.fillStyle = 'black';
    ctx.fillRect(16, 16, 32, 32);
    ctx.fillRect(size - 48, 16, 32, 32);
    ctx.fillRect(16, size - 48, 32, 32);
    
    resolve(canvas.toDataURL('image/png'));
  });
};

export async function generateTicketPDF(ticket: TicketData) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a6',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // --- Background ---
  // Main dark background
  pdf.setFillColor(5, 5, 15); // Very dark
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Accent red gradient effect (top strip)
  pdf.setFillColor(220, 38, 38); // Red-600
  pdf.rect(0, 0, pageWidth, 65, 'F');

  // Add subtle glow lines (decorative)
  pdf.setDrawColor(248, 113, 113); // Red-400
  pdf.setLineWidth(0.2);
  pdf.line(5, 65, pageWidth - 5, 65);

  // --- Movie Poster ---
  let posterY = 10;
  let posterH = 45;
  let posterW = posterH * 0.66; // 2:3 ratio
  let posterX = 5;
  try {
    if (ticket.moviePoster) {
      const img = await loadImage(ticket.moviePoster);
      pdf.addImage(img, 'JPEG' as any, posterX, posterY, posterW, posterH);
    }
  } catch (e) {
    console.error('Failed to load poster', e);
  }

  // --- Movie Title & Info (Right of poster) ---
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  const titleX = posterX + posterW + 5;
  const titleMaxWidth = pageWidth - titleX - 5;
  
  // Split title to fit
  let titleLines: string[] = [];
  let currentLine = '';
  const titleWords = ticket.movieTitle.split(' ');
  titleWords.forEach(word => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    if (pdf.getTextWidth(testLine) <= titleMaxWidth || !currentLine) {
      currentLine = testLine;
    } else {
      titleLines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) titleLines.push(currentLine);
  pdf.text(titleLines.slice(0, 3), titleX, 20);

  // Genre / Tagline
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(252, 165, 165); // Red-200
  pdf.text('CINÉMA EXCLUSIF', titleX, 33);

  // Ticket ID
  pdf.setFontSize(7);
  pdf.setTextColor(229, 231, 235); // Gray-200
  pdf.text(`#${ticket.id}`, titleX, 40);

  // --- Ticket Details Section ---
  const detailsStartY = 80;
  const leftCol = 8;
  const rightCol = pageWidth / 2;
  const lineSpacing = 9;

  // Left column labels
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(156, 163, 175); // Gray-400
  pdf.text('CINÉMA', leftCol, detailsStartY);
  pdf.text('DATE', leftCol, detailsStartY + lineSpacing);
  pdf.text('HEURE', leftCol, detailsStartY + lineSpacing * 2);
  pdf.text('PLACES', leftCol, detailsStartY + lineSpacing * 3);
  pdf.text('TOTAL', leftCol, detailsStartY + lineSpacing * 4);

  // Right column values
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.text(ticket.cinema, rightCol, detailsStartY);
  pdf.text(ticket.date, rightCol, detailsStartY + lineSpacing);
  pdf.text(ticket.time, rightCol, detailsStartY + lineSpacing * 2);
  pdf.text(ticket.seats.join(', '), rightCol, detailsStartY + lineSpacing * 3);
  pdf.text(`${ticket.totalPrice.toLocaleString()} FCFA`, rightCol, detailsStartY + lineSpacing * 4);

  // Divider line
  pdf.setDrawColor(55, 65, 81);
  pdf.setLineWidth(0.3);
  pdf.line(5, detailsStartY + lineSpacing * 5.2, pageWidth - 5, detailsStartY + lineSpacing * 5.2);

  // --- QR Code ---
  const qrSize = 35;
  const qrX = (pageWidth - qrSize) / 2;
  const qrY = detailsStartY + lineSpacing * 6;
  
  // White box for QR
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4, 2, 2, 'F');
  
  try {
    const qrDataUrl = await generateQRCodeDataUrl(`SENEFLIX-${ticket.id}`);
    if (qrDataUrl) {
      pdf.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
    } else {
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.text('QR', qrX + qrSize / 2, qrY + qrSize / 2, { align: 'center' });
    }
  } catch (e) {
    console.error('Failed to add QR', e);
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.text('QR', qrX + qrSize / 2, qrY + qrSize / 2, { align: 'center' });
  }

  // --- Footer ---
  // Brand logo
  pdf.setTextColor(220, 38, 38);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text('SENEFLIX', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Subtle decorative corners
  pdf.setDrawColor(220, 38, 38);
  pdf.setLineWidth(0.5);
  // TL
  pdf.line(3, 3, 3, 10);
  pdf.line(3, 3, 10, 3);
  // TR
  pdf.line(pageWidth - 3, 3, pageWidth - 3, 10);
  pdf.line(pageWidth - 10, 3, pageWidth - 3, 3);
  // BL
  pdf.line(3, pageHeight - 3, 3, pageHeight - 10);
  pdf.line(3, pageHeight - 3, 10, pageHeight - 3);
  // BR
  pdf.line(pageWidth - 3, pageHeight - 3, pageWidth - 3, pageHeight - 10);
  pdf.line(pageWidth - 10, pageHeight - 3, pageWidth - 3, pageHeight - 3);

  return pdf;
}

export async function downloadTicketPDF(ticket: TicketData) {
  const pdf = await generateTicketPDF(ticket);
  pdf.save(`BILLET-SENEFLIX-${ticket.id}.pdf`);
}
