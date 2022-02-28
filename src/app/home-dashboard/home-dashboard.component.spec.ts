import { Component, ComponentRef, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DynamicComponentService } from '../shared/services/dynamic-component.service';
import { EventEmitter } from '@angular/core';

import { HomeDashboardComponent } from './home-dashboard.component';
import { By } from '@angular/platform-browser';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSidenavHarness } from '@angular/material/sidenav/testing';
import { Control } from '../shared/interfaces/control.interface';
import { SidenavLinksComponent } from '../shared/components/sidenav-links/sidenav-links.component';


describe('HomeDashboardComponent', () => {
  let component: HomeDashboardComponent;
  let fixture: ComponentFixture<HomeDashboardComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [
        HomeDashboardComponent,
        MockSidenavLinksComponent
       ],
      providers: [
        { provide: DynamicComponentService, useValue: {
          insertComponentDynamically: () => {}
        } },
        MessageService
      ],
      imports: [
        NoopAnimationsModule,
        ToastModule,
        MatSidenavModule,
        MatIconModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeDashboardComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  describe('-btnSidenav open/close arrow', () => {
    let arrowSideNavOpener: HTMLElement;

    beforeEach( () => {
      arrowSideNavOpener = fixture.debugElement.query(By.css('.sidenav-opener')).nativeElement;
      spyOn(component, 'toggleNav').and.callThrough();
    });

    it('should call toggleNav', () => {
      arrowSideNavOpener.click();
      expect(component.toggleNav).toHaveBeenCalledTimes(1);
    });

    it('should open sidenav if closed', async () => {
      const sideNavHarness =  await loader.getHarness(MatSidenavHarness);

      component.sideNav.close();
      arrowSideNavOpener.click();

      expect(await sideNavHarness.isOpen()).toBeTruthy();
      expect(arrowSideNavOpener.className).toContain('opened');
    });

    it('should close sidenav if opened', async () => {
      const sideNavHarness = await loader.getHarness(MatSidenavHarness);

      component.sideNav.open();
      arrowSideNavOpener.click();

      expect(await sideNavHarness.isOpen()).toBeFalsy();
      expect(arrowSideNavOpener.className).not.toContain('opened');
    });

  });

  describe('#init', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should add ".opened" class to ".sidenav-opener"', () => {
      const sidenavOpener = fixture.debugElement.query(By.css('.sidenav-opener'));

      expect(sidenavOpener.classes.opened).toBeTruthy();
    });

    it('@ViewChild() componentInsertLocation should be initialized', () => {
      expect(component.sideNav).toBeTruthy();
    });

    it('@ViewChild() sidenav should be initialized', () => {
      expect(component.componentInsertLocation).toBeTruthy();
    });
  });

  describe('#createComponent', () => {
    let control: Control;
    let insertDynamicallySpy: jasmine.Spy;
    let sideNavSpy: {
      close: jasmine.Spy
    } = {} as any;

    beforeEach( () => {

      insertDynamicallySpy = spyOn(component['dynamicComponentService'], 'insertComponentDynamically');
      sideNavSpy.close = spyOn(component.sideNav, 'close');
      control = {
        componentName: 'Test',
        componentType: MockWidgetComponent
      };
    });

    it('should call dynamicComponentService.insertComponentDynamically', () => {
      component.createComponent(control);

      expect(insertDynamicallySpy).toHaveBeenCalledTimes(1);
      expect(insertDynamicallySpy).toHaveBeenCalledWith(component.componentInsertLocation, control);
    });

    it('should close the sideNav if new component was created', () => {
      insertDynamicallySpy.and.callFake( () => ({} as ComponentRef<any>))
      component.createComponent(control);

      expect(component.sideNav.close).toHaveBeenCalledTimes(1);
    });

    it('should do nothing if the component is already created', () => {
      insertDynamicallySpy.and.callFake( () => null );
      component.createComponent(control);

      expect(component.sideNav.close).not.toHaveBeenCalled();
    });

  });

  describe('#toggleNav', () => {

    it('should call toggle on component.sideNav', () => {
      spyOn(component.sideNav, 'toggle');

      component.toggleNav();

      expect(component.sideNav.toggle).toHaveBeenCalledTimes(1);
    });
  });
});

@Component({
  selector: 'app-sidenav-links',
  template: ''
})
class MockSidenavLinksComponent {
  @Input() sideNav!: MatSidenav;
  @Output() createComponent = new EventEmitter();
}


@Component({
  template: ''
})
class MockWidgetComponent {}
