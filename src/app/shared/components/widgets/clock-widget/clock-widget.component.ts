import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Observable, interval, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DynamicComponent } from '../../../interfaces/dynamic-component.interface';

@Component({
  selector: 'app-clock-widget',
  templateUrl: './clock-widget.component.html',
  styleUrls: ['./clock-widget.component.scss']
})
export class ClockWidgetComponent extends DynamicComponent implements OnInit {

  styles = {
    'min-width': '200px',
    'min-height': '50px',
    'width': 'fit-content',
    'height': 'fit-content'
  }
  time: string = new Date().toLocaleTimeString();
  timeStream$: Observable<any> = interval(1000).pipe(
    switchMap( () => of(new Date().toLocaleTimeString()))
  );

  constructor(private viewContainer: ViewContainerRef) {
    super();
  }

  ngOnInit(): void {
    this.timeStream$.subscribe( newTime => this.time = newTime);
  }
}
