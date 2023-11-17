import { Controller, Get, Param } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { weatherData, weatherResponse } from '../types/weather';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}
  @Get(':city')
  async getWeatherByCity(
    @Param('city') city: string,
  ): Promise<Promise<weatherResponse> | { error: string }> {
    try {
      const weatherData: weatherData =
        await this.weatherService.getWeatherForCity(city);
      return { weatherData };
    } catch (error) {
      return {
        error:
          'You requested a not existed city or there is no available attempts to request :(',
      };
    }
  }
}
