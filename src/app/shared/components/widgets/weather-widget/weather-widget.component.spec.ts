import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { ComponentFixture, flush, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { DynamicComponentService } from 'src/app/shared/services/dynamic-component.service';

import { WeatherWidgetComponent } from './weather-widget.component';
import { Weather } from 'src/app/shared/interfaces/weather.interface';
import { By } from '@angular/platform-browser';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';
import { detect } from 'underscore';

describe('WeatherWidgetComponent', () => {
  let component: WeatherWidgetComponent;
  let fixture: ComponentFixture<WeatherWidgetComponent>;

  let httpClient: HttpClient;
  let httpController: HttpTestingController;

  let pushErrorSpy: jasmine.Spy;
  let getCurrentPositionSpy: jasmine.Spy;

  let successSpy: jasmine.Spy,
      errorSpy: jasmine.Spy
  ;

  let successBindSpy: jasmine.Spy,
      errorBindSpy: jasmine.Spy
  ;

  const position = {
    coords: {
      latitude: 46.234,
      longitude: -46.234
    }
  };

  const testWeatherReturnedFromApi: any = {
    name: 'TestCity',
    dt: 1590381234,
    main: {
      temp: 56,
      feels_like: 50,
      humidity: 60
    },
    wind: {
      speed: 35,
      deg: 340
    },
    weather: [
      {
        icon: '01d',
        main: 'Clear'
      }
    ]
  };

  const testComponentWeather: any = {
    city: 'TestCity',
    time: '11:33 PM',
    weather: 'Clear',
    icon: `https://openweathermap.org/img/wn/01d@2x.png`,
    temp: {
      now: 56,
      feelsLike: 50,
      humidity: 60
    },
    wind: {
      speed: 35,
      direction: 'NNW'
    }
  }

  beforeEach(async () => {


    await TestBed.configureTestingModule({
      declarations: [
        WeatherWidgetComponent,
        MockHandleComponent
      ],
      providers: [
        { provide: MessageService, useValue: {} },
        { provide: DynamicComponentService, useValue: {} }
      ],
      imports: [
        HttpClientTestingModule,
        MatProgressSpinnerModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherWidgetComponent);
    component = fixture.componentInstance;

    httpClient = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);

    pushErrorSpy = spyOn(component, 'pushError');
    getCurrentPositionSpy = spyOn(navigator.geolocation, 'getCurrentPosition');

    successBindSpy = spyOn(component.geoSuccess as CallableFunction, 'bind').and.callThrough();
    errorBindSpy = spyOn(component.geoFail as CallableFunction, 'bind').and.callThrough();

    successSpy = spyOn(component, 'geoSuccess').and.callThrough();
    errorSpy = spyOn(component, 'geoFail').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#init', () => {

    beforeEach( () => {

    })

    it('should call geoSuccess bound to component if user accepts location', () => {
      successSpy.and.callFake( () => {} );

      getCurrentPositionSpy.and.callFake( function () {
        arguments[0](position);
      });

      fixture.detectChanges();

      expect(successBindSpy).toHaveBeenCalledWith(component);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(0);
    });

    it('should call geoFail bound to component if user denies location', () => {
      getCurrentPositionSpy.and.callFake( function () {
        arguments[1](position);
      });

      fixture.detectChanges();
      expect(errorBindSpy).toHaveBeenCalledWith(component);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).not.toHaveBeenCalled()
    });

    it("should toast an error if browser doesn't support geolocation", () => {
      spyOnProperty(navigator, 'geolocation').and.returnValue(undefined);

      fixture.detectChanges();
      expect(pushErrorSpy).toHaveBeenCalled();
    });
  });

  describe('#geoSuccess', () => {
    let req: TestRequest[];

    beforeEach( () => {
      component.geoSuccess.apply(component, [position]);

      req = httpController.match(
        request => request.url === component['apiUrl']
      );
    });

    afterEach( () => {
      httpController.verify();
    });

    it('should call the openweathermap API', () => {
      expect(req[0]).toBeTruthy();
      expect(req[0].request.url)
        .withContext(`to call "${component['apiUrl']}"`)
        .toEqual(component['apiUrl']);
    });

    it('should update weather object', () => {
      req[0].flush(testWeatherReturnedFromApi);

      expect(component.weather).toEqual(testComponentWeather);
    });

    it('should update view with granted permission & no loading spinner', () => {
      req[0].flush(testWeatherReturnedFromApi);

      expect(component.permissionGranted).toEqual(true);
      expect(component.doneLoading).toEqual(true);

    });
  });

  describe('#geoFail', () => {

    beforeEach( () => {
      component.geoFail({})
    });

    it('should toast an error', () => {
      expect(pushErrorSpy).toHaveBeenCalledTimes(1);
    });

    it('should update "component.doneLoading" permission', () => {
      expect(component.doneLoading).toEqual(true);
    });

    it('update the view with denied permission', () => {
      fixture.detectChanges();

      let userDeniedDiv = fixture.debugElement.query(By.css('.user-denied'));
      expect(userDeniedDiv).toBeTruthy();
    });
  });

  describe('#refreshWeather', () => {

    beforeEach( () => {
      component.refreshWeather();
    });

    it('should call #getCurrentPosition with #geoSuccess & #geoFail', () => {
      expect(getCurrentPositionSpy).toHaveBeenCalled();
      expect(successBindSpy).toHaveBeenCalled();
      expect(errorBindSpy).toHaveBeenCalled();
    });
  });
});

@Component({
  selector: 'app-handle',
  template: ``
})
class MockHandleComponent {}
