import { AfterViewInit, Component, ComponentRef, Renderer2, RendererFactory2, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Control } from '../shared/interfaces/control.interface';
import { DynamicComponentService } from '../shared/services/dynamic-component.service';

@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.scss']
})
export class HomeDashboardComponent implements AfterViewInit{

  @ViewChild('sideNav') sideNav!: MatSidenav;
  @ViewChild('insertLocation', {read: ViewContainerRef})
   componentInsertLocation!: ViewContainerRef;

  renderer: Renderer2;

  constructor(
    private dynamicComponentService: DynamicComponentService,
    private rendererFactory: RendererFactory2
    ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  ngAfterViewInit(): void {

    const sidenavOpener = this.sideNav._content.nativeElement.querySelector('.sidenav-opener');
    this.sideNav.openedStart.subscribe( () => {
      this.renderer.addClass(sidenavOpener, 'opened');
    });
    this.sideNav.closedStart.subscribe( () => {
      this.renderer.removeClass(sidenavOpener, 'opened');
    });
  }

  createComponent(component: Control):void {
    const componentRef: ComponentRef<any> | null = this.dynamicComponentService.insertComponentDynamically(
      this.componentInsertLocation,
      component
    );

    if(componentRef) this.sideNav.close();
  }

  openNav(): void {
    this.sideNav.toggle();
  }
}
