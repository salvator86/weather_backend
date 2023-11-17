import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { weatherData } from '../types/weather';

@Injectable()
export class WeatherService {
  private apiKey: string = 'eyhcuT13gjlGtPvrsz0XsymGLzAUIYV5';

  constructor(private httpService: HttpService) {}

  async getLocationKey(city: string): Promise<string> {
    const apiUrl: string = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${this.apiKey}&q=${city}`;

    try {
      const response = await this.httpService.get(apiUrl).toPromise();
      return response.data[0]?.Key;
    } catch (error) {
      throw new Error('Unable to fetch location key');
    }
  }

  async getWeatherForCity(city: string): Promise<weatherData> {
    try {
      const locationKey: string = await this.getLocationKey(city);
      const apiUrl: string = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${this.apiKey}&details=true`;
      const response = await this.httpService.get(apiUrl).toPromise();
      const temperature = response.data[0]?.Temperature.Metric.Value;
      const { WeatherText, LocalObservationDateTime } = response.data[0];
      const localTime: string = new Date(
        LocalObservationDateTime,
      ).toLocaleString();

      return {
        city,
        temperature,
        localTime,
        WeatherText,
      };
    } catch (error) {
      throw new Error(
        'You requested a not existed city or there is no available attempts to request :(',
      );
    }
  }
}

// {
//     "weatherData": {
//         "temperature": 4,
//         "localTime": "17.11.2023, 12:57:00",
//         "WeatherText": "Cloudy"
//     }
// }
