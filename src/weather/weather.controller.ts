import { Controller, Get, Param } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}
  @Get(':city')
  async getWeatherByCity(@Param('city') city: string) {
    try {
      const weatherData = await this.weatherService.getWeatherForCity(city);
      console.log(weatherData);
      return { weatherData };
    } catch (error) {
      return { error: 'Unable to fetch weather data' };
    }
  }
}
