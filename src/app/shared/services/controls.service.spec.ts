import { TestBed } from '@angular/core/testing';

import { ControlsService } from './controls.service';

describe('ControlsService', () => {
  let service: ControlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return controls', () => {
    const controls = service.getControls();

    expect(controls).toBeTruthy();
  });
});
