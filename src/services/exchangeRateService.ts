// Service de conversion de devises avec ExchangeRate API
// API gratuite: https://api.exchangerate-api.com/v4/latest/

export interface ExchangeRates {
  base: string;
  date: string;
  rates: {
    [currency: string]: number;
  };
}

// Cache pour éviter les appels fréquents
let cachedRates: ExchangeRates | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Taux de change par défaut (approximatifs) - utilisés en fallback
const DEFAULT_RATES = {
  EUR: 0.0015,  // 1 FCFA ≈ 0.0015 EUR
  USD: 0.0016,  // 1 FCFA ≈ 0.0016 USD
};

export async function fetchExchangeRates(): Promise<ExchangeRates | null> {
  const now = Date.now();
  
  // Vérifier le cache
  if (cachedRates && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    // Récupérer les taux depuis l'API ExchangeRate
    // On utilise XOF (Franc CFA - Zone FCFA) comme devise de base
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/XOF');
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des taux de change');
    }
    
    const data = await response.json();
    
    cachedRates = data;
    lastFetchTime = now;
    
    return data;
  } catch (error) {
    console.warn('Impossible de récupérer les taux de change depuis l\'API:', error);
    return null;
  }
}

// Conversion de FCFA vers une autre devise
export function convertFromFCFA(fcfaAmount: number, targetCurrency: string, rates: ExchangeRates | null): number {
  if (!rates || !rates.rates || !rates.rates[targetCurrency]) {
    // Utiliser les taux par défaut si l'API échoue
    const rate = DEFAULT_RATES[targetCurrency as keyof typeof DEFAULT_RATES];
    if (rate) {
      return parseFloat((fcfaAmount * rate).toFixed(2));
    }
    return 0;
  }
  
  return parseFloat((fcfaAmount * rates.rates[targetCurrency]).toFixed(2));
}

// Formater un montant avec le symbole de la devise
export function formatCurrency(amount: number, currency: string): string {
  const symbols: { [key: string]: string } = {
    'FCFA': 'FCFA',
    'EUR': '€',
    'USD': '$',
  };
  
  const symbol = symbols[currency] || currency;
  
  if (currency === 'USD') {
    return `$${amount.toFixed(2)}`;
  } else if (currency === 'EUR') {
    return `€${amount.toFixed(2)}`;
  } else {
    return `${amount.toLocaleString('fr-FR')} ${symbol}`;
  }
}

// Obtenir les informations de la devise
export const currencies = [
  { code: 'FCFA', name: 'Franc CFA', flag: '🇸🇳' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'USD', name: 'Dollar US', flag: '🇺🇸' },
];
