import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

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

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  private readonly defaultCity: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENWEATHER_API_KEY', '');
    this.defaultCity = this.configService.get<string>(
      'OPENWEATHER_DEFAULT_CITY',
      'Dakar',
    );
  }

  async getCurrentWeather(city?: string): Promise<WeatherData> {
    if (!this.apiKey) {
      throw new HttpException(
        'OpenWeather API key non configurée',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const cityName = city || this.defaultCity;

    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
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
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException(
          `Ville "${cityName}" non trouvée`,
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        'Erreur lors de la récupération de la météo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getForecast(city?: string, days = 5): Promise<ForecastDay[]> {
    if (!this.apiKey) {
      throw new HttpException(
        'OpenWeather API key non configurée',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const cityName = city || this.defaultCity;

    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          q: cityName,
          appid: this.apiKey,
          units: 'metric',
          lang: 'fr',
          cnt: days * 8,
        },
      });

      const dailyData: Map<string, ForecastDay> = new Map();

      response.data.list.forEach((item: any) => {
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
        } else {
          const existing = dailyData.get(dateKey)!;
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
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException(
          `Ville "${cityName}" non trouvée`,
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        'Erreur lors de la récupération des prévisions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
    if (!this.apiKey) {
      throw new HttpException(
        'OpenWeather API key non configurée',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
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
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la récupération de la météo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getDefaultCity(): string {
    return this.defaultCity;
  }
}
