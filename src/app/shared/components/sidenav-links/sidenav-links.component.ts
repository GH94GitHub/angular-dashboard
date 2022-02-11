import { Component, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { EventEmitter } from '@angular/core';
import { Control } from '../../interfaces/control.interface';
import { ControlsService } from '../../services/controls.service';

@Component({
  selector: 'app-sidenav-links',
  templateUrl: './sidenav-links.component.html',
  styleUrls: ['./sidenav-links.component.scss']
})
export class SidenavLinksComponent implements OnInit {

  @Input() sideNav!: MatSidenav;
  @Output() createComponent: EventEmitter<Control> = new EventEmitter();

  componentGroup!: any;
  rippleColor: string = "rgba(0, 0, 0, .04)";

  constructor( public controlService: ControlsService ) {}

  ngOnInit(): void {
    this.componentGroup = this.controlService.getControls();
  }

  /**
   * Creates a component inside of the dashboard
   * @param component The type of component wished to initialize
   */
  emitCreateComponent(component: Control): void {
    this.createComponent.emit(component);
  }

  /**
   * Helper used by the view to create an iterable for ngForOf
   * @param object <unkown> object passed from view
   * @returns
   */
  toArray(object: any): Array<Control> {
    return Array.from(object);
  }

  //!Testing//
  log(value: any): void {
    console.log('~~ type ~~')
    console.log(typeof value);
    console.log('~~ value ~~')
    console.log(value);
  }

}
