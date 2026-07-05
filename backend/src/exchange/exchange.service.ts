import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface ExchangeRates {
  source: string;
  base: string;
  rates: {
    XOF: number;  // FCFA - Franc CFA (devise commune pour plusieurs pays africains)
    EUR: number;  // Euro
    USD: number;  // Dollar américain
  };
  lastUpdated: string;
}

@Injectable()
export class ExchangeService {
  // API ExchangeRate (gratuite avec clé API)
  // Alternative gratuite: exchangerate-api.com
  private readonly API_URL = 'https://api.exchangerate-api.com/v4/latest/XOF';

  async getExchangeRates(): Promise<ExchangeRates> {
    try {
      const response = await axios.get(this.API_URL, {
        timeout: 10000,
      });

      const data = response.data;
      
      return {
        source: 'ExchangeRate API',
        base: 'XOF', // FCFA comme base
        rates: {
          XOF: 1, // 1 XOF = 1 XOF
          EUR: data.rates.EUR || 0.00152, // Taux par défaut si non disponible
          USD: data.rates.USD || 0.00165, // Taux par défaut si non disponible
        },
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      // En cas d'erreur, retourner des taux par défaut (taux approximatifs)
      console.error('Erreur lors de la récupération des taux de change:', error);
      return this.getDefaultRates();
    }
  }

  convertPrice(amountInXOF: number, targetCurrency: 'XOF' | 'EUR' | 'USD'): number {
    // Les taux sont approximatifs (peuvent être mis à jour via l'API)
    const rates = {
      XOF: 1,
      EUR: 0.00152, // 1 XOF ≈ 0.00152 EUR
      USD: 0.00165, // 1 XOF ≈ 0.00165 USD
    };

    const rate = rates[targetCurrency];
    const converted = amountInXOF * rate;
    
    // Arrondir à 2 décimales
    return Math.round(converted * 100) / 100;
  }

  convertAll(amountInXOF: number): { XOF: number; EUR: number; USD: number } {
    return {
      XOF: amountInXOF,
      EUR: this.convertPrice(amountInXOF, 'EUR'),
      USD: this.convertPrice(amountInXOF, 'USD'),
    };
  }

  private getDefaultRates(): ExchangeRates {
    return {
      source: 'Default Rates',
      base: 'XOF',
      rates: {
        XOF: 1,
        EUR: 0.00152,
        USD: 0.00165,
      },
      lastUpdated: new Date().toISOString(),
    };
  }
}
