import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { DynamicComponent, PrimeNgError } from '../../../interfaces/dynamic-component.interface';
import { Weather } from '../../../interfaces/weather.interface';
import { MessageService } from 'primeng/api';
import { DynamicComponentService } from '../../../services/dynamic-component.service';

@Component({
  selector: 'app-weather-widget',
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.scss']
})
export class WeatherWidgetComponent extends DynamicComponent implements OnInit {

  weather: Weather = {} as Weather;
  windDirectionLookup: string[] = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW","N"];
  permissionGranted: boolean = false;
  styles = {
    'width': 'fit-content',
    'height': 'fit-content'
  }

  constructor(
    private http: HttpClient,
    @Inject(MessageService) messageService: MessageService,
    dynamicComponentService: DynamicComponentService
    ) {
    super(messageService, dynamicComponentService);
  }

  ngOnInit(): void {
    //get geolocation
    if (window.navigator.geolocation)
      window.navigator.geolocation.getCurrentPosition(this.geoSuccess.bind(this), this.geoFail.bind(this));
    else {
      const error: PrimeNgError = {
        severity: 'error',
        summary: 'Location',
        detail: "Your browser doesn't support geolocation"
      }
      this.pushError(error);
    }
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

    console.log(this);
    this.http.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: params.latitude,
        lon: params.longitude,
        appid: params.appId,
        units: 'imperial'
      }
    }).subscribe( (weatherData: any) => {
      const windDegrees = Number(weatherData.wind.deg) % 360;
      const directionIndex = Math.round(windDegrees / 22.5);
      const windDirection = this.windDirectionLookup[directionIndex];
      const icon = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
      const time = new Date(weatherData.dt * 1000);
      //put result inside this.weather
      this.weather = {
        city: weatherData.name,
        time: this.formatHHMM(time),
        weather: weatherData.weather[0].main,
        icon: icon,
        temp: {
          now: Math.round(weatherData.main.temp),
          feelsLike: Math.round(weatherData.main.feels_like),
          humidity: weatherData.main.humidity
        },
        wind: {
          speed: Math.round(weatherData.wind.speed).toString(),
          direction: windDirection
        }
      }

      this.permissionGranted = true;
    })

  }

  /**
   * Called if user denies access to their location
   * @param data
   */
  geoFail(data: any): void {
    const error: PrimeNgError = {
      severity: "warn",
      summary: 'Weather',
      detail: 'Failed to access location.'
    }
    this.pushError(error);
    this.permissionGranted = false;
  }

  formatHHMM(date: Date) {
    function z(n: number){return (n < 10 ? '0' : '') + n;}
    var h = date.getHours();
    return (h !== 12 ? z(h % 12) : '12') + ':' + z(date.getMinutes()) + ' ' + (h<12 ? 'AM' : 'PM');
  }
}
