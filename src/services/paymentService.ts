// Service de paiement API - Mode Test
// Simule un gateway de paiement (comme Stripe/PayPal) pour les tests

export interface PaymentRequest {
  amount: number;
  currency: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
  description?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  timestamp: string;
  paymentMethod: 'test_api';
}

// Mode de test -aucune vraie transaction
const TEST_MODE = true;

// Numéros de carte de test
export const TEST_CARDS = {
  SUCCESS: '4242424242424242',      // Paiement réussi
  DECLINED: '4000000000000002',     // Paiement refusé
  INSUFFICIENT: '4000000000009995', // Fonds insuffisants
  EXPIRED: '4000000000000069',      // Carte expirée
};

// Validation du numéro de carte (algorithme de Luhn)
export function validateCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s/g, '');
  
  if (!/^\d{13,19}$/.test(digits)) {
    return false;
  }
  
  let sum = 0;
  let isEven = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

// Validation de la date d'expiration
export function validateExpiry(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  
  const month = parseInt(match[1], 10);
  const year = parseInt('20' + match[2], 10);
  
  if (month < 1 || month > 12) return false;
  
  const now = new Date();
  const cardDate = new Date(year, month);
  
  return cardDate > now;
}

// Validation du CVV
export function validateCvv(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv);
}

// Générer un ID de transaction
function generateTransactionId(): string {
  const prefix = 'TXN';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Traitement du paiement (mode test)
export async function processPayment(request: PaymentRequest): Promise<PaymentResponse> {
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  if (!TEST_MODE) {
    return {
      success: false,
      message: 'Mode test désactivé. Aucune transaction réelle effectuée.',
      timestamp: new Date().toISOString(),
      paymentMethod: 'test_api'
    };
  }
  
  // Validation de base
  if (!request.cardNumber || !request.cardExpiry || !request.cardCvv) {
    return {
      success: false,
      message: 'Informations de carte incomplètes.',
      timestamp: new Date().toISOString(),
      paymentMethod: 'test_api'
    };
  }
  
  // Analyser le numéro de carte pour déterminer le résultat
  const cleanCardNumber = request.cardNumber.replace(/\s/g, '');
  
  // Cartes de test spécifiques
  if (cleanCardNumber === TEST_CARDS.DECLINED) {
    return {
      success: false,
      message: 'Carte déclinée. Veuillez contacter votre banque.',
      timestamp: new Date().toISOString(),
      paymentMethod: 'test_api'
    };
  }
  
  if (cleanCardNumber === TEST_CARDS.INSUFFICIENT) {
    return {
      success: false,
      message: 'Fonds insuffisants sur la carte.',
      timestamp: new Date().toISOString(),
      paymentMethod: 'test_api'
    };
  }
  
  if (cleanCardNumber === TEST_CARDS.EXPIRED) {
    return {
      success: false,
      message: 'Carte expirée. Veuillez utiliser une autre carte.',
      timestamp: new Date().toISOString(),
      paymentMethod: 'test_api'
    };
  }
  
  // Pour toute autre carte (y compris 4242424242424242), simuler le succès
  if (validateCardNumber(cleanCardNumber) && validateExpiry(request.cardExpiry) && validateCvv(request.cardCvv)) {
    return {
      success: true,
      transactionId: generateTransactionId(),
      message: 'Paiement réussi ! Votre réservation est confirmée.',
      timestamp: new Date().toISOString(),
      paymentMethod: 'test_api'
    };
  }
  
  // Échec de validation
  return {
    success: false,
    message: 'Informations de carte invalides. Veuillez vérifier vos données.',
    timestamp: new Date().toISOString(),
    paymentMethod: 'test_api'
  };
}

// Formater le numéro de carte pour l'affichage
export function formatCardNumber(value: string): string {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];
  
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  
  return parts.length ? parts.join(' ') : value;
}

// Détecter le type de carte
export function detectCardType(cardNumber: string): string {
  const num = cardNumber.replace(/\s/g, '');
  
  const patterns = {
    'Visa': /^4/,
    'Mastercard': /^5[1-5]/,
    'American Express': /^3[47]/,
    'Discover': /^6(?:011|5)/,
  };
  
  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(num)) {
      return type;
    }
  }
  
  return 'Inconnu';
}
