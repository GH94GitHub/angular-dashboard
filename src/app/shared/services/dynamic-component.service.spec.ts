import { Component, ComponentRef, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockWidgetComponent } from '../components/widgets/clock-widget/clock-widget.component';
import { Control } from '../interfaces/control.interface';


import { DynamicComponentService } from './dynamic-component.service';

describe('DynamicComponentService', () => {
  let service: DynamicComponentService;

  @Component({
    template: `
      <div class="dashboard-container">
        <div #componentsGoHere></div>
      </div>
    `
  })
  class MockHomeDashboardComponent {
    @ViewChild('componentsGoHere', { read: ViewContainerRef} ) container!: ViewContainerRef;
  }

  @Component({
    template: `
    <div class="component-container">
      This is the clock component
    </div>`
  })
  class MockClockWidgetComponent {}

  @Component({
    template: `
    <div class="component-container">
      This is a random test component
    </div>`
  })
  class MockTestComponent {}

  @Component({
    template: `
    <div class="component-container">
      This is a random test2 component
    </div>`
  })
  class MockTest2Component {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockHomeDashboardComponent,
        MockClockWidgetComponent,
        MockTestComponent
      ]
    });
    service = TestBed.inject(DynamicComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("service's destroy method should be called when component is destroyed", () => {
    const mockDashboardFixture = TestBed.createComponent(MockHomeDashboardComponent);
    mockDashboardFixture.detectChanges();

    const viewContainerRef: ViewContainerRef = mockDashboardFixture.componentInstance.container;

    const clockControl: Control = {
      componentName: 'Clock',
      componentType: MockClockWidgetComponent
    }

    const clockRef = service.insertComponentDynamically(viewContainerRef, clockControl);

    const destroyMethodSpy = spyOn<any>(service, 'destroyComponent');

    clockRef?.destroy();
    expect(destroyMethodSpy).toHaveBeenCalled();

  });

  describe('insertComponentDynamically()', () => {
    let dashboardFixture: ComponentFixture<MockHomeDashboardComponent>;

    let clockControl: Control;
    let clockComponentRef: ComponentRef<ClockWidgetComponent> | null;
    let viewContainerRef: ViewContainerRef;

    let moveToTopSpy: jasmine.Spy<() => void>;

    beforeEach( () => {
      clockControl = {
        componentName: 'Clock',
        componentType: MockClockWidgetComponent
      }

      dashboardFixture = TestBed.createComponent(MockHomeDashboardComponent);
      dashboardFixture.detectChanges();

      //Target location to insert
      viewContainerRef = dashboardFixture.componentInstance.container;

      //Mock moveToTop call
      moveToTopSpy = spyOn(service, 'moveToTop');
      moveToTopSpy.and.returnValue();
    });


    it('should create a component', () => {
      // Attempt to create component
      clockComponentRef = service.insertComponentDynamically(viewContainerRef, clockControl);
      expect(clockComponentRef).withContext('returned componentRef').toBeInstanceOf(ComponentRef);

      const index = viewContainerRef.indexOf(clockComponentRef!.hostView);
      expect(index).withContext('insert in correct location').toBeGreaterThan(-1);


      expect(service['existingComponents']).withContext('tracks existing components').toContain({
        name: clockControl.componentName,
        elRef: clockComponentRef!
      });
    });

    it('should not allow duplicate components to be created', () => {
      service.insertComponentDynamically(viewContainerRef, clockControl);
      const returnedVal = service.insertComponentDynamically(viewContainerRef, clockControl);

      expect(returnedVal).withContext('Returned null').toBeNull();

      expect(viewContainerRef.length).toBe(1);
    });


  });

  describe('moveToTop()', () => {

    let mockDashboardFixture: ComponentFixture<MockHomeDashboardComponent>
    let viewContainerRef: ViewContainerRef;

    let mockClockControl: Control,
        mockTestControl: Control,
        mockTest2Control : Control
    ;

    let mockClockContainer: HTMLElement,
        mockTest2Container: HTMLElement,
        mockTestContainer: HTMLElement
    ;

    beforeEach( () => {

      mockClockControl = {
        componentName: 'Clock',
        componentType: MockClockWidgetComponent
      }
      mockTestControl = {
        componentName: 'Test1',
        componentType: MockTestComponent
      }
      mockTest2Control = {
        componentName: 'Test2',
        componentType: MockTest2Component
      }

      mockDashboardFixture = TestBed.createComponent(MockHomeDashboardComponent);
      mockDashboardFixture.detectChanges();

      viewContainerRef = mockDashboardFixture.componentInstance.container;

      mockClockControl.componentRef = service.insertComponentDynamically(viewContainerRef, mockClockControl) || undefined;
      mockTestControl.componentRef = service.insertComponentDynamically(viewContainerRef, mockTestControl) || undefined;
      mockTest2Control.componentRef = service.insertComponentDynamically(viewContainerRef, mockTest2Control) || undefined;

      mockClockContainer = mockClockControl.componentRef?.location.nativeElement.querySelector('.component-container');
      mockTestContainer = mockTestControl.componentRef?.location.nativeElement.querySelector('.component-container');
      mockTest2Container = mockTest2Control.componentRef?.location.nativeElement.querySelector('.component-container');


      service.moveToTop(mockClockControl.componentRef as ComponentRef<any>);
    });

    it('should remove "on-top" class from all other elements', () => {

      expect(mockTest2Control.componentRef?.location.nativeElement.querySelector('.component-container').className)
        .withContext('remove class: "on-top" from other elements')
        .not.toContain('on-top');

      expect(mockTestControl.componentRef?.location.nativeElement.querySelector('.component-container').className)
        .withContext('remove class" "on-top" from other elements')
        .not.toContain('on-top');
    });

    it('should have a higher z-index than other elements', () => {
      expect(mockClockContainer.style.zIndex).withContext('clock should have highest z-index')
        .toBeGreaterThan(Number(mockTestContainer.style.zIndex));

      expect(mockClockContainer.style.zIndex).withContext('clock should have highest z-index')
        .toBeGreaterThan(Number(mockTest2Container.style.zIndex));
    });

    it('should give max z-index to current element', () => {
      expect(Number(mockClockContainer.style.zIndex)).toBe(service['existingComponents'].length)
    });

    it('should add "on-top" class to current element', () => {
      expect(mockClockContainer.classList).toContain('on-top');
    });
  });
});
