import { Renderer2, RendererFactory2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicComponentService } from '../shared/services/dynamic-component.service';

import { HomeDashboardComponent } from './home-dashboard.component';

describe('HomeDashboardComponent', () => {
  let component: HomeDashboardComponent;
  let fixture: ComponentFixture<HomeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeDashboardComponent ],
      providers: [
        DynamicComponentService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});


