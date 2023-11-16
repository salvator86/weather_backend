import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

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

  async getWeatherForCity(city: string): Promise<any> {
    try {
      const locationKey: string = await this.getLocationKey(city);
      const apiUrl: string = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${this.apiKey}&details=true`;
      const response = await this.httpService.get(apiUrl).toPromise();
      const temperature = response.data[0]?.Temperature.Metric.Value;
      const { WeatherText } = response.data[0];
      // const localTime = new Date(LocalObservationDateTime).toLocaleString();
      return {
        temperature,
        // localTime,
        WeatherText,
      };
    } catch (error) {
      throw new Error('Unable to fetch weather data');
    }
  }
}
