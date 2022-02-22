import { Component, ComponentRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MessageService } from "primeng/api";
import { DynamicComponentService } from "../services/dynamic-component.service";
import { DynamicComponent } from "./dynamic-component.interface";

describe('DynamicComponent', () => {
  let fixture: ComponentFixture<MockTestComponent>;
  let component: MockTestComponent;

  let messageSpy: { add: jasmine.Spy };
  let dynamicCompService: { moveToTop: jasmine.Spy };

  beforeEach( async () => {

    messageSpy = jasmine.createSpyObj('MessageService', ['add']);
    dynamicCompService = jasmine.createSpyObj('DynamicComponentService', ['moveToTop']);

    await TestBed.configureTestingModule({
      declarations: [
        MockTestComponent
      ],
      providers: [
        { provide: MessageService, useValue: messageSpy },
        { provide: DynamicComponentService, useValue: dynamicCompService}
      ]
    }).compileComponents();
  })


  beforeEach( () => {
    fixture = TestBed.createComponent(MockTestComponent);
    component = fixture.componentInstance;
  });

  it('should call moveToTop when clicked', () => {
    const service = TestBed.inject(DynamicComponentService);
    fixture.debugElement.triggerEventHandler('mousedown', '$event');

    expect(service.moveToTop).toHaveBeenCalledTimes(1);
  });

  it('should destroy the component', () => {
    component.viewRef = { destroy(): void {} } as ComponentRef<any>;
    const destroyViewRefSpy = spyOn(component.viewRef, 'destroy');

    component.destroySelf();
    expect(destroyViewRefSpy).toHaveBeenCalledTimes(1);
  });

  it('should be able to send a toast via MessageService', () => {
    const service = TestBed.inject(MessageService);

    fixture.componentInstance.pushError({
      severity: 'error',
      detail: 'This is an error message',
      summary: 'Error'
    });

    expect(service.add).toHaveBeenCalledTimes(1);
  });

});

@Component({

})
class MockTestComponent extends DynamicComponent {
  styles = {
    width: 'fit-content',
    height: 'fit-content'
  }
}

