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
exports.WeatherController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const weather_service_1 = require("./weather.service");
const public_decorator_1 = require("../common/decorators/public.decorator");
let WeatherController = class WeatherController {
    constructor(weatherService) {
        this.weatherService = weatherService;
    }
    getCurrentWeather(city) {
        return this.weatherService.getCurrentWeather(city);
    }
    getForecast(city, days) {
        const validDays = Math.min(Math.max(days || 5, 1), 5);
        return this.weatherService.getForecast(city, validDays);
    }
    getWeatherByCoords(lat, lon) {
        return this.weatherService.getWeatherByCoordinates(lat, lon);
    }
    getDefaultCity() {
        return { city: this.weatherService.getDefaultCity() };
    }
};
exports.WeatherController = WeatherController;
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir la météo actuelle' }),
    (0, swagger_1.ApiQuery)({ name: 'city', required: false, description: 'Ville (défaut: Dakar)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Données météo actuelles',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Ville non trouvée',
    }),
    (0, swagger_1.ApiResponse)({
        status: 503,
        description: 'API OpenWeather non configurée',
    }),
    __param(0, (0, common_1.Query)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WeatherController.prototype, "getCurrentWeather", null);
__decorate([
    (0, common_1.Get)('forecast'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les prévisions météo' }),
    (0, swagger_1.ApiQuery)({ name: 'city', required: false, description: 'Ville (défaut: Dakar)' }),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, description: 'Nombre de jours (1-5)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Prévisions météo',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Ville non trouvée',
    }),
    __param(0, (0, common_1.Query)('city')),
    __param(1, (0, common_1.Query)('days', new common_1.DefaultValuePipe(5), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], WeatherController.prototype, "getForecast", null);
__decorate([
    (0, common_1.Get)('coords'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir la météo par coordonnées' }),
    (0, swagger_1.ApiQuery)({ name: 'lat', required: true, description: 'Latitude' }),
    (0, swagger_1.ApiQuery)({ name: 'lon', required: true, description: 'Longitude' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Données météo',
    }),
    __param(0, (0, common_1.Query)('lat', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('lon', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], WeatherController.prototype, "getWeatherByCoords", null);
__decorate([
    (0, common_1.Get)('default-city'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir la ville par défaut' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ville par défaut configurée',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WeatherController.prototype, "getDefaultCity", null);
exports.WeatherController = WeatherController = __decorate([
    (0, swagger_1.ApiTags)('Weather'),
    (0, common_1.Controller)('weather'),
    __metadata("design:paramtypes", [weather_service_1.WeatherService])
], WeatherController);
//# sourceMappingURL=weather.controller.js.map