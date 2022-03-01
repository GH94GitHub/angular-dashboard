import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { DynamicComponentService } from 'src/app/shared/services/dynamic-component.service';

import { ClockWidgetComponent } from './clock-widget.component';
import { TestScheduler } from 'rxjs/testing';
import { Component } from '@angular/core';

describe('ClockWidgetComponent', () => {
  let component: ClockWidgetComponent;
  let fixture: ComponentFixture<ClockWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ClockWidgetComponent,
        MockHandleComponent
       ],
      providers: [
        MessageService,
        DynamicComponentService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClockWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit time every second', () => {
    const testScheduler = new TestScheduler( (actual, expected) => {
      expect(actual).toEqual(expected);
    });

    testScheduler.run( ({expectObservable}) => {
      const timeStream$ = component.timeStream$

      const unsub =    '1s - 999ms -!';
      const expected = '1s 0 999ms 0';
      const value = [ new Date().toLocaleTimeString() ]

      expectObservable(timeStream$, unsub).toBe(expected, value);
    });

  });
});


@Component({
  selector: 'app-handle',
  template: ''
})
class MockHandleComponent {}
