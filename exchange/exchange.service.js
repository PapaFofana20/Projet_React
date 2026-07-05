"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangeService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let ExchangeService = class ExchangeService {
    constructor() {
        this.API_URL = 'https://api.exchangerate-api.com/v4/latest/XOF';
    }
    async getExchangeRates() {
        try {
            const response = await axios_1.default.get(this.API_URL, {
                timeout: 10000,
            });
            const data = response.data;
            return {
                source: 'ExchangeRate API',
                base: 'XOF',
                rates: {
                    XOF: 1,
                    EUR: data.rates.EUR || 0.00152,
                    USD: data.rates.USD || 0.00165,
                },
                lastUpdated: new Date().toISOString(),
            };
        }
        catch (error) {
            console.error('Erreur lors de la récupération des taux de change:', error);
            return this.getDefaultRates();
        }
    }
    convertPrice(amountInXOF, targetCurrency) {
        const rates = {
            XOF: 1,
            EUR: 0.00152,
            USD: 0.00165,
        };
        const rate = rates[targetCurrency];
        const converted = amountInXOF * rate;
        return Math.round(converted * 100) / 100;
    }
    convertAll(amountInXOF) {
        return {
            XOF: amountInXOF,
            EUR: this.convertPrice(amountInXOF, 'EUR'),
            USD: this.convertPrice(amountInXOF, 'USD'),
        };
    }
    getDefaultRates() {
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
};
exports.ExchangeService = ExchangeService;
exports.ExchangeService = ExchangeService = __decorate([
    (0, common_1.Injectable)()
], ExchangeService);
//# sourceMappingURL=exchange.service.js.map