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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let WeatherService = class WeatherService {
    constructor(configService) {
        this.configService = configService;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.apiKey = this.configService.get('OPENWEATHER_API_KEY', '');
        this.defaultCity = this.configService.get('OPENWEATHER_DEFAULT_CITY', 'Dakar');
    }
    async getCurrentWeather(city) {
        if (!this.apiKey) {
            throw new common_1.HttpException('OpenWeather API key non configurée', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
        const cityName = city || this.defaultCity;
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/weather`, {
                params: {
                    q: cityName,
                    appid: this.apiKey,
                    units: 'metric',
                    lang: 'fr',
                },
            });
            const data = response.data;
            return {
                temperature: Math.round(data.main.temp),
                feelsLike: Math.round(data.main.feels_like),
                humidity: data.main.humidity,
                description: data.weather[0].description,
                icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                city: data.name,
                country: data.sys.country,
                windSpeed: Math.round(data.wind.speed * 3.6),
                visibility: Math.round((data.visibility || 10000) / 1000),
                pressure: data.main.pressure,
            };
        }
        catch (error) {
            if (error.response?.status === 404) {
                throw new common_1.HttpException(`Ville "${cityName}" non trouvée`, common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('Erreur lors de la récupération de la météo', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getForecast(city, days = 5) {
        if (!this.apiKey) {
            throw new common_1.HttpException('OpenWeather API key non configurée', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
        const cityName = city || this.defaultCity;
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/forecast`, {
                params: {
                    q: cityName,
                    appid: this.apiKey,
                    units: 'metric',
                    lang: 'fr',
                    cnt: days * 8,
                },
            });
            const dailyData = new Map();
            response.data.list.forEach((item) => {
                const date = new Date(item.dt * 1000);
                const dateKey = date.toISOString().split('T')[0];
                if (!dailyData.has(dateKey)) {
                    dailyData.set(dateKey, {
                        date,
                        tempMin: item.main.temp_min,
                        tempMax: item.main.temp_max,
                        description: item.weather[0].description,
                        icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
                    });
                }
                else {
                    const existing = dailyData.get(dateKey);
                    existing.tempMin = Math.min(existing.tempMin, item.main.temp_min);
                    existing.tempMax = Math.max(existing.tempMax, item.main.temp_max);
                }
            });
            return Array.from(dailyData.values())
                .slice(0, days)
                .map((day) => ({
                ...day,
                tempMin: Math.round(day.tempMin),
                tempMax: Math.round(day.tempMax),
            }));
        }
        catch (error) {
            if (error.response?.status === 404) {
                throw new common_1.HttpException(`Ville "${cityName}" non trouvée`, common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('Erreur lors de la récupération des prévisions', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getWeatherByCoordinates(lat, lon) {
        if (!this.apiKey) {
            throw new common_1.HttpException('OpenWeather API key non configurée', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/weather`, {
                params: {
                    lat,
                    lon,
                    appid: this.apiKey,
                    units: 'metric',
                    lang: 'fr',
                },
            });
            const data = response.data;
            return {
                temperature: Math.round(data.main.temp),
                feelsLike: Math.round(data.main.feels_like),
                humidity: data.main.humidity,
                description: data.weather[0].description,
                icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                city: data.name,
                country: data.sys.country,
                windSpeed: Math.round(data.wind.speed * 3.6),
                visibility: Math.round((data.visibility || 10000) / 1000),
                pressure: data.main.pressure,
            };
        }
        catch (error) {
            throw new common_1.HttpException('Erreur lors de la récupération de la météo', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    getDefaultCity() {
        return this.defaultCity;
    }
};
exports.WeatherService = WeatherService;
exports.WeatherService = WeatherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WeatherService);
//# sourceMappingURL=weather.service.js.map