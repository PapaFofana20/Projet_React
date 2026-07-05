import { ConfigService } from '@nestjs/config';
export interface WeatherData {
    temperature: number;
    feelsLike: number;
    humidity: number;
    description: string;
    icon: string;
    city: string;
    country: string;
    windSpeed: number;
    visibility: number;
    pressure: number;
}
export interface ForecastDay {
    date: Date;
    tempMin: number;
    tempMax: number;
    description: string;
    icon: string;
}
export declare class WeatherService {
    private configService;
    private readonly apiKey;
    private readonly defaultCity;
    private readonly baseUrl;
    constructor(configService: ConfigService);
    getCurrentWeather(city?: string): Promise<WeatherData>;
    getForecast(city?: string, days?: number): Promise<ForecastDay[]>;
    getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData>;
    getDefaultCity(): string;
}
