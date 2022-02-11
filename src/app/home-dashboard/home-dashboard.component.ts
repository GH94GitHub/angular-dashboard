import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Control } from '../shared/interfaces/control.interface';
import { CreationArgs } from '../shared/interfaces/creation-args.interface';
import { DynamicComponentService } from '../shared/services/dynamic-component.service';

@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.scss']
})
export class HomeDashboardComponent {

  @ViewChild('sideNav') sideNav!: MatSidenav;

  @ViewChild('insertLocation', {read: ViewContainerRef})
   componentInsertLocation!: ViewContainerRef;

   insertLocation!: ViewContainerRef;
  constructor(private dynamicComponentService: DynamicComponentService) { }

  // args: CreationArgs = {
  //   attributes: [
  //     {
  //       name: 'cdkDrag',
  //       value: 'true'
  //     }
  //   ],
  //   properties: [
  //     {
  //       name: '[cdkDragBoundary]',
  //       value: '.dashboard-container'
  //     },
  //     {
  //       name: '[ngStyles]',
  //       value: 'styles'
  //     }
  //   ]
  // }

  createComponent(component: Control):void {
    this.dynamicComponentService.insertComponentDynamically(
      this.componentInsertLocation,
      component
    );
  }

  openNav(): void {
    this.sideNav.open()
  }
}
