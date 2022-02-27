import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  let dialogRefSpy: { close: jasmine.Spy };
  const data = {
    title: 'Delete User',
    content: 'Are you sure you want to delete',
    items: 'Jerry Tangle: Manager'
  }

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ ConfirmDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ],
      imports: [
        MatDialogModule
      ]
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind to the view correctly', () => {
    let h2El = fixture.debugElement.query(By.css('h2.mat-dialog-title'));
    let matDialogContentEl = fixture.debugElement.query(By.css('.mat-dialog-content'));
    console.log(matDialogContentEl);

    expect(h2El.nativeElement.innerText)
      .toBe('Delete User');

    expect(matDialogContentEl.nativeElement.innerText)
      .toContain('Are you sure you want to delete\u00a0Jerry Tangle: Manager?');
  });

  describe('#confirm', () => {

    it('should return true to the dialog opener', () => {
      component.confirm();

      expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
      expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    });

  });

  describe('Cancel Button', () => {

    it('should close the dialog', () => {
      const cancelButton = fixture.debugElement.query(By.css('.cancel-button'));

      cancelButton.nativeElement.click();

      expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
      expect(dialogRefSpy.close).toHaveBeenCalledWith('');
    });

  });

  describe('Confirm Button', () => {
    let confirmSpy: jasmine.Spy;

    beforeEach( () => {
      confirmSpy = spyOn(component, 'confirm');
    });

    it('should call the #confirm method', () => {
      const confirmButton = fixture.debugElement.query(By.css('.confirm-button'));

      confirmButton.nativeElement.click();

      expect(confirmSpy).toHaveBeenCalledTimes(1);
    });

  });
});
