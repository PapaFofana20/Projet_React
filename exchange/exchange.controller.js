"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const exchange_service_1 = require("./exchange.service");
let ExchangeController = class ExchangeController {
    constructor(exchangeService) {
        this.exchangeService = exchangeService;
    }
    async getRates() {
        return this.exchangeService.getExchangeRates();
    }
    async convert(amount) {
        return {
            source: 'XOF',
            amount: amount,
            converted: this.exchangeService.convertAll(amount),
            symbol: {
                XOF: 'FCFA',
                EUR: '€',
                USD: '$',
            },
        };
    }
};
exports.ExchangeController = ExchangeController;
__decorate([
    (0, common_1.Get)('rates'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les taux de change actuels' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Taux de change pour XOF, EUR, USD'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExchangeController.prototype, "getRates", null);
__decorate([
    (0, common_1.Get)('convert'),
    (0, swagger_1.ApiOperation)({ summary: 'Convertir un montant XOF en autres devises' }),
    (0, swagger_1.ApiQuery)({
        name: 'amount',
        required: true,
        description: 'Montant en FCFA (XOF)',
        type: Number
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Montant converti en EUR et USD'
    }),
    __param(0, (0, common_1.Query)('amount', new common_1.DefaultValuePipe(0), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ExchangeController.prototype, "convert", null);
exports.ExchangeController = ExchangeController = __decorate([
    (0, swagger_1.ApiTags)('Exchange'),
    (0, common_1.Controller)('exchange'),
    __metadata("design:paramtypes", [exchange_service_1.ExchangeService])
], ExchangeController);
//# sourceMappingURL=exchange.controller.js.map