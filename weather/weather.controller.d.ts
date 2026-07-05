import { WeatherService } from './weather.service';
export declare class WeatherController {
    private readonly weatherService;
    constructor(weatherService: WeatherService);
    getCurrentWeather(city?: string): Promise<import("./weather.service").WeatherData>;
    getForecast(city?: string, days?: number): Promise<import("./weather.service").ForecastDay[]>;
    getWeatherByCoords(lat: number, lon: number): Promise<import("./weather.service").WeatherData>;
    getDefaultCity(): {
        city: string;
    };
}
