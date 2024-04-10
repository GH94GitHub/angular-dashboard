import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  getWeather(latitude: string, longitude: string): Observable<any> {
    return this.http.get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        appid: "fadc79cfcafcbc2fbd5efdefc10388b1",
        lat: latitude,
        lon: longitude,
        units: "imperial"
      }
    });
  }

}
