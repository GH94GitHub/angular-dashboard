import { Injectable } from '@angular/core';
import { CONTROL_DATA } from '../data/control-data';
import { ComponentGroup } from '../interfaces/component-group.interface';

@Injectable({
  providedIn: 'root'
})
export class ControlsService {

  controls: ComponentGroup = CONTROL_DATA;

  constructor() { }

  getControls(): ComponentGroup {
    return this.controls;
  }
}
