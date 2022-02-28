import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentGroup } from '../../interfaces/component-group.interface';
import { ControlsService } from '../../services/controls.service';

import { SidenavLinksComponent } from './sidenav-links.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatRippleModule } from '@angular/material/core';

describe('SidenavLinksComponent', () => {
  let component: SidenavLinksComponent;
  let fixture: ComponentFixture<SidenavLinksComponent>;

  let controls: ComponentGroup;
  let controlServiceSpy: {
    getControls: jasmine.Spy
  };

  beforeEach(async () => {

    controlServiceSpy = jasmine.createSpyObj('ControlService', [
      'getControls'
    ]);

    controls = {
      widgets: [{
        componentName: 'Clock',
        componentType: MockComponent
      }]
    };
    controlServiceSpy.getControls.and.callFake( () => controls );

    await TestBed.configureTestingModule({
      declarations: [ SidenavLinksComponent ],
      imports: [
        NoopAnimationsModule,
        MatRippleModule,
        MatExpansionModule
      ],
      providers: [
        { provide: ControlsService, useValue: controlServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('#init', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('componentGroup should be populated', () => {
      expect(controlServiceSpy.getControls).toHaveBeenCalledTimes(1);
      expect(component.componentGroup).toEqual(controls);
    });
  });
});

@Component({
  template: ''
})
class MockComponent {}
