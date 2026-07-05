export interface ExchangeRates {
    source: string;
    base: string;
    rates: {
        XOF: number;
        EUR: number;
        USD: number;
    };
    lastUpdated: string;
}
export declare class ExchangeService {
    private readonly API_URL;
    getExchangeRates(): Promise<ExchangeRates>;
    convertPrice(amountInXOF: number, targetCurrency: 'XOF' | 'EUR' | 'USD'): number;
    convertAll(amountInXOF: number): {
        XOF: number;
        EUR: number;
        USD: number;
    };
    private getDefaultRates;
}
