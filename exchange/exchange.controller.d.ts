import { ExchangeService } from './exchange.service';
export declare class ExchangeController {
    private readonly exchangeService;
    constructor(exchangeService: ExchangeService);
    getRates(): Promise<import("./exchange.service").ExchangeRates>;
    convert(amount: number): Promise<{
        source: string;
        amount: number;
        converted: {
            XOF: number;
            EUR: number;
            USD: number;
        };
        symbol: {
            XOF: string;
            EUR: string;
            USD: string;
        };
    }>;
}
