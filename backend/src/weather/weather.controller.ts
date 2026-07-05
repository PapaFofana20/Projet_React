import { Controller, Get, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Obtenir la météo actuelle' })
  @ApiQuery({ name: 'city', required: false, description: 'Ville (défaut: Dakar)' })
  @ApiResponse({
    status: 200,
    description: 'Données météo actuelles',
  })
  @ApiResponse({
    status: 404,
    description: 'Ville non trouvée',
  })
  @ApiResponse({
    status: 503,
    description: 'API OpenWeather non configurée',
  })
  getCurrentWeather(@Query('city') city?: string) {
    return this.weatherService.getCurrentWeather(city);
  }

  @Get('forecast')
  @Public()
  @ApiOperation({ summary: 'Obtenir les prévisions météo' })
  @ApiQuery({ name: 'city', required: false, description: 'Ville (défaut: Dakar)' })
  @ApiQuery({ name: 'days', required: false, description: 'Nombre de jours (1-5)' })
  @ApiResponse({
    status: 200,
    description: 'Prévisions météo',
  })
  @ApiResponse({
    status: 404,
    description: 'Ville non trouvée',
  })
  getForecast(
    @Query('city') city?: string,
    @Query('days', new DefaultValuePipe(5), ParseIntPipe) days?: number,
  ) {
    const validDays = Math.min(Math.max(days || 5, 1), 5);
    return this.weatherService.getForecast(city, validDays);
  }

  @Get('coords')
  @Public()
  @ApiOperation({ summary: 'Obtenir la météo par coordonnées' })
  @ApiQuery({ name: 'lat', required: true, description: 'Latitude' })
  @ApiQuery({ name: 'lon', required: true, description: 'Longitude' })
  @ApiResponse({
    status: 200,
    description: 'Données météo',
  })
  getWeatherByCoords(
    @Query('lat', ParseIntPipe) lat: number,
    @Query('lon', ParseIntPipe) lon: number,
  ) {
    return this.weatherService.getWeatherByCoordinates(lat, lon);
  }

  @Get('default-city')
  @Public()
  @ApiOperation({ summary: 'Obtenir la ville par défaut' })
  @ApiResponse({
    status: 200,
    description: 'Ville par défaut configurée',
  })
  getDefaultCity() {
    return { city: this.weatherService.getDefaultCity() };
  }
}
