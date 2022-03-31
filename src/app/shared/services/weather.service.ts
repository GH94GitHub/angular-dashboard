import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private path = "/api/weather";

  constructor(private http: HttpClient) { }

  getWeather(latitude: string, longitude: string): Observable<any> {
    return this.http.get(this.path, {
      params: {
        latitude: latitude,
        longitude: longitude
      }
    });
  }

}
