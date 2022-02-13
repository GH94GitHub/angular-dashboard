import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DynamicComponent } from '../../../interfaces/dynamic-component.interface';
import { Weather } from '../../../interfaces/weather.interface';

@Component({
  selector: 'app-weather-widget',
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.scss']
})
export class WeatherWidgetComponent extends DynamicComponent implements OnInit {

  weather: Weather = {} as Weather;
  windDirectionLookup: string[] = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW","N"];
  styles = {

  }

  constructor(private http: HttpClient) {
    super();
  }

  ngOnInit(): void {
    //get geolocation
    if (window.navigator.geolocation)
      window.navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoFail);
    else // let the user know browser doesn't support
  }

  /**
   * Called if user grants consent to access their location
   * @param data Contains weather information
   */
  geoSuccess(data: any): void {
    //call openWeatherApi with coords
    const params = {
      latitude: data.coords.latitude,
      longitude: data.coords.longitude,
      appId: '3d26844206c4281fd979c5522632ee31'
    }

    this.http.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: params.latitude,
        lon: params.longitude,
        appid: params.appId,
        units: 'imperial'
      }
    }).subscribe( (weatherData: any) => {
      const windDegrees = weatherData.wind.direction % 360;
      const directionIndex = windDegrees / 22.5;
      const windDirection = this.windDirectionLookup[directionIndex];
      //TODO: GET THE WEATHER ICON FROM THE WEATHER CODE (weatherData.weather.icon)
      //TODO: PUT IMG SRC INTO ICON PROP BELOW
      //put result inside this.weather
      this.weather = {
        city: weatherData.name,
        weather: weatherData.weather.main,
        icon: /*TODO:*/ ,
        temp: {
          now: weatherData.main.temp,
          feelsLike: weatherData.main.feels_like,
          min: weatherData.main.temp_min,
          max: weatherData.main.temp_max,
          humidity: weatherData.main.humidity
        },
        wind: {
          speed: weatherData.wind.speed,
          direction: windDirection
        }
      }
    })
  }

  /**
   * Called if user denies access to their location
   * @param data
   */
  geoFail(data: any): void {

  }
}
