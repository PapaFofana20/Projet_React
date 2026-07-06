import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

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

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

const generateQRCodeDataUrl = async (text: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(text, {
      width: 400,
      margin: 2,
      color: {
        dark: '#1a1a2e',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    });
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    return '';
  }
};

// Obtenir le jour de la semaine en français
const getDayOfWeek = (dateStr: string): string => {
  const jours = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  try {
    const date = new Date(dateStr.split('/').reverse().join('-'));
    return jours[date.getDay()];
  } catch {
    return '';
  }
};

// Formater la date complète
const formatDate = (dateStr: string): string => {
  const mois = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUN', 'JUIL', 'AOÛ', 'SEP', 'OCT', 'NOV', 'DÉ'];
  try {
    const parts = dateStr.split('/');
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    return `${day} ${mois[month]}`;
  } catch {
    return dateStr;
  }
};

export async function generateTicketPDF(ticket: TicketData) {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [100, 180], // Format ticket bancaire
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // ============================================
  // BACKGROUND PRINCIPAL
  // ============================================
  // Fond noir profond
  pdf.setFillColor(10, 10, 20);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Dégradé subtil en haut (rouge vers noir)
  for (let i = 0; i < 25; i++) {
    // Calculer la couleur en fonction de l'intensité (sans alpha)
    const intensity = 0.8 - (i * 0.03);
    const r = Math.floor(220 * intensity);
    const g = Math.floor(38 * intensity);
    const b = Math.floor(38 * intensity);
    pdf.setFillColor(r, g, b);
    pdf.rect(0, i, pageWidth, 1, 'F');
  }

  // ============================================
  // BANDEAU SUPÉRIEUR - HEADER
  // ============================================
  const headerY = 8;
  
  // Logo SENEFLIX stylisé
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text('SENEFLIX', 10, headerY + 4);

  // Badge "BILLET NUMÉRIQUE"
  pdf.setFillColor(220, 38, 38);
  pdf.roundedRect(pageWidth - 38, headerY - 2, 30, 8, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(5);
  pdf.setFont('helvetica', 'bold');
  pdf.text('BILLET', pageWidth - 30, headerY + 3, { align: 'center' });
  pdf.text('NUMÉRIQUE', pageWidth - 30, headerY + 6.5, { align: 'center' });

  // Ligne séparatrice
  pdf.setDrawColor(220, 38, 38);
  pdf.setLineWidth(0.5);
  pdf.line(5, 14, pageWidth - 5, 14);

  // ============================================
  // SECTION GAUCHE - AFFICHE FILM
  // ============================================
  const posterX = 8;
  const posterY = 18;
  const posterW = 38;
  const posterH = 54;

  // Cadre de l'affiche avec coins arrondis
  pdf.setFillColor(30, 30, 50);
  pdf.roundedRect(posterX - 1, posterY - 1, posterW + 2, posterH + 2, 3, 3, 'F');
  
  // Ajouter l'affiche (simplifié pour éviter les erreurs)
  pdf.setFillColor(50, 30, 60);
  pdf.rect(posterX, posterY, posterW, posterH, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(6);
  pdf.text('SENEFLIX', posterX + posterW/2, posterY + posterH/2, { align: 'center' });

  // Badge "EXCLUSIF" sur l'affiche
  pdf.setFillColor(251, 191, 36);
  pdf.roundedRect(posterX + 2, posterY + 2, 18, 6, 1, 1, 'F');
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(4);
  pdf.setFont('helvetica', 'bold');
  pdf.text('★ EXCLUSIF', posterX + 11, posterY + 6, { align: 'center' });

  // ============================================
  // SECTION CENTRALE - INFORMATIONS FILM
  // ============================================
  const infoX = posterX + posterW + 8;
  const infoW = pageWidth - infoX - 45;

  // Titre du film
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  
  // Titre sur plusieurs lignes si nécessaire
  const titleLines = pdf.splitTextToSize(ticket.movieTitle, infoW);
  pdf.text(titleLines.slice(0, 2), infoX, posterY + 8);

  // Genre
  if (ticket.genre) {
    pdf.setTextColor(220, 38, 38);
    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'normal');
    pdf.text(ticket.genre.split('/')[0].trim(), infoX, posterY + 14);
  }

  // Numéro de billet
  pdf.setTextColor(100, 100, 120);
  pdf.setFontSize(5);
  pdf.text(`N° ${ticket.id}`, infoX, posterY + 18);

  // Ligne décorative
  pdf.setDrawColor(60, 60, 80);
  pdf.setLineWidth(0.3);
  pdf.line(infoX, posterY + 21, infoX + infoW, posterY + 21);

  // ============================================
  // INFORMATIONS DE LA SÉANCE
  // ============================================
  const detailY = posterY + 26;
  const detailSpacing = 9;

  // Jour de la semaine
  pdf.setTextColor(220, 38, 38);
  pdf.setFontSize(5);
  pdf.setFont('helvetica', 'bold');
  pdf.text('JOUR', infoX, detailY);
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text(getDayOfWeek(ticket.date), infoX, detailY + 4);

  // Date
  pdf.setTextColor(220, 38, 38);
  pdf.setFontSize(5);
  pdf.text('DATE', infoX + 28, detailY);
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.text(formatDate(ticket.date), infoX + 28, detailY + 4);

  // Heure
  pdf.setTextColor(220, 38, 38);
  pdf.setFontSize(5);
  pdf.text('HEURE', infoX + 55, detailY);
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text(ticket.time, infoX + 55, detailY + 4);

  // Cinéma
  pdf.setTextColor(220, 38, 38);
  pdf.setFontSize(5);
  pdf.text('SALLE', infoX, detailY + detailSpacing);
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.text(ticket.cinema, infoX, detailY + detailSpacing + 4);

  // Places
  pdf.setTextColor(220, 38, 38);
  pdf.setFontSize(5);
  pdf.text('PLACES', infoX + 55, detailY + detailSpacing);
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  pdf.text(ticket.seats.join(', '), infoX + 55, detailY + detailSpacing + 4);

  // Prix total
  pdf.setTextColor(251, 191, 36);
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'normal');
  pdf.text('MONTANT PAYÉ', infoX, detailY + detailSpacing * 2);
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${ticket.totalPrice.toLocaleString()} F`, infoX, detailY + detailSpacing * 2 + 5);

  // ============================================
  // PERFORATIONS DÉCORATIVES
  // ============================================
  const perforX = infoX + infoW + 3;
  const perfRadius = 1.5;
  
  for (let y = 20; y < posterY + posterH - 5; y += 8) {
    pdf.setFillColor(10, 10, 20);
    pdf.circle(perforX, y, perfRadius, 'F');
    pdf.setDrawColor(40, 40, 60);
    pdf.circle(perforX, y, perfRadius + 0.3, 'S');
  }

  // ============================================
  // SECTION DROITE - QR CODE
  // ============================================
  const qrSectionX = pageWidth - 42;
  const qrSize = 32;
  const qrY = posterY + 5;

  // Fond du QR avec effet glassmorphism
  pdf.setFillColor(240, 240, 250);
  pdf.roundedRect(qrSectionX - 3, qrY - 3, qrSize + 6, qrSize + 6, 4, 4, 'F');
  
  // Bordure
  pdf.setDrawColor(220, 38, 38);
  pdf.setLineWidth(0.4);
  pdf.roundedRect(qrSectionX - 3, qrY - 3, qrSize + 6, qrSize + 6, 4, 4, 'S');

  // QR Code
  try {
    const qrDataUrl = await generateQRCodeDataUrl(`SENEFLIX-TICKET-${ticket.id}`);
    if (qrDataUrl) {
      pdf.addImage(qrDataUrl, 'PNG', qrSectionX, qrY, qrSize, qrSize);
    } else {
      pdf.setFillColor(240, 240, 240);
      pdf.rect(qrSectionX, qrY, qrSize, qrSize, 'F');
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      pdf.text('QR', qrSectionX + qrSize/2, qrY + qrSize/2, { align: 'center' });
    }
  } catch (e) {
    pdf.setFillColor(240, 240, 240);
    pdf.rect(qrSectionX, qrY, qrSize, qrSize, 'F');
  }

  // Texte sous le QR
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(5);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SCANNEZ', qrSectionX + qrSize/2, qrY + qrSize + 5, { align: 'center' });
  pdf.setTextColor(200, 200, 200);
  pdf.setFontSize(4);
  pdf.text('POUR ENTRER', qrSectionX + qrSize/2, qrY + qrSize + 8, { align: 'center' });

  // Code de validation
  pdf.setTextColor(100, 100, 120);
  pdf.setFontSize(4);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`CODE: SNF-${ticket.id.slice(0, 8).toUpperCase()}`, qrSectionX + qrSize/2, qrY + qrSize + 12, { align: 'center' });

  // ============================================
  // PIED DE PAGE
  // ============================================
  const footerY = pageHeight - 8;

  // Ligne supérieure
  pdf.setDrawColor(40, 40, 60);
  pdf.setLineWidth(0.2);
  pdf.line(5, footerY - 4, pageWidth - 5, footerY - 4);

  // Texte légal
  pdf.setTextColor(80, 80, 100);
  pdf.setFontSize(3.5);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Billet non échangeable, non remboursable. Valable uniquement pour la date et séance indiquées.', 5, footerY - 1);

  // Conditions à droite
  pdf.text('Présentez ce billet à l\'entrée', pageWidth - 5, footerY - 1, { align: 'right' });

  // ============================================
  // EFFETS DÉCORATIFS
  // ============================================
  
  // Coins décoratifs
  pdf.setDrawColor(220, 38, 38);
  pdf.setLineWidth(0.4);
  
  // Coin supérieur gauche
  pdf.line(3, 3, 3, 8);
  pdf.line(3, 3, 8, 3);
  
  // Coin supérieur droit
  pdf.line(pageWidth - 3, 3, pageWidth - 3, 8);
  pdf.line(pageWidth - 8, 3, pageWidth - 3, 3);
  
  // Coin inférieur gauche
  pdf.line(3, pageHeight - 3, 3, pageHeight - 8);
  pdf.line(3, pageHeight - 3, 8, pageHeight - 3);
  
  // Coin inférieur droit
  pdf.line(pageWidth - 3, pageHeight - 3, pageWidth - 3, pageHeight - 8);
  pdf.line(pageWidth - 8, pageHeight - 3, pageWidth - 3, pageHeight - 3);

  return pdf;
}

export async function downloadTicketPDF(ticket: TicketData) {
  try {
    console.log('=== Début du téléchargement du billet ===');
    console.log('Ticket data:', ticket);
    const pdf = await generateTicketPDF(ticket);
    console.log('PDF généré avec succès');
    const filename = `SENEFLIX-${ticket.movieTitle.replace(/\s+/g, '-')}-${ticket.id}.pdf`;
    console.log('Sauvegarde du fichier:', filename);
    pdf.save(filename);
    console.log('=== Téléchargement terminé avec succès ===');
  } catch (error) {
    console.error('ERREUR lors du téléchargement:', error);
    alert('Erreur lors du téléchargement du billet. Voir la console pour plus de détails.');
  }
}
