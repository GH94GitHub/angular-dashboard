import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HandleComponent } from './handle.component';

describe('HandleComponent', () => {
  let component: HandleComponent;
  let fixture: ComponentFixture<HandleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HandleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#emitExit', () => {
    let exitSpy: {
      next: jasmine.Spy
    } = {} as any

    beforeEach( () => {
      exitSpy.next = spyOn(component.exit, 'next');
    });

    it('should emit "exit" to parent', () => {
      component.emitExit();

      expect(exitSpy.next).toHaveBeenCalledTimes(1);
      expect(exitSpy.next).toHaveBeenCalledWith('exit')
    });
  });

  describe('#btnExit', () => {
    let btnExit: HTMLElement;
    let emitExitSpy: jasmine.Spy;

    beforeEach( () => {
      btnExit = fixture.debugElement.query(By.css('.exit-button')).nativeElement;
      emitExitSpy = spyOn(component, 'emitExit');
    });

    it('should call emitExit() when clicked', () => {
      btnExit.click();
      expect(emitExitSpy).toHaveBeenCalledTimes(1);
    });
  });
});
