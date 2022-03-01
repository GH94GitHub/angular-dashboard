import { ComponentType } from '@angular/cdk/portal';
import { Component, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogActions, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Message, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { DynamicComponentService } from 'src/app/shared/services/dynamic-component.service';
import { EventEmitter } from '@angular/core';
import { EmployeeService } from '../../../services/employee.service';

import { EmployeesComponent } from './employees.component';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import { of } from 'rxjs';

fdescribe('EmployeesComponent', () => {
  let component: EmployeesComponent;
  let fixture: ComponentFixture<EmployeesComponent>;

  let empService: EmployeeService;
  let messageService: MessageService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        TableModule,
        MatIconModule
      ],
      declarations: [
        EmployeesComponent ,
        MockHandleComponent
      ],
      providers: [
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: EmployeeService, useClass: MockEmpService },
        { provide: DynamicComponentService, useValue: {} },
        { provide: MessageService, useClass: MockMessageService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesComponent);
    component = fixture.componentInstance;

    empService = TestBed.inject(EmployeeService);
    messageService = TestBed.inject(MessageService);
    dialog = TestBed.inject(MatDialog);
  });

  describe('#init', () => {
    let getAllEmployeesSpy: jasmine.Spy;

    beforeEach( () => {
      getAllEmployeesSpy = spyOn(empService, 'getAllEmployees').and.callFake(
        () => [] as Employee[]
      );
      fixture.detectChanges();
    })

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should call getAllEmployees', () => {
      expect(empService.getAllEmployees).toHaveBeenCalledTimes(1);
    });

    it('employees should be initialized', () => {
      expect(component.employees).toBeTruthy();
    });
  });

  fdescribe('#deleteEmployee', () => {
    let dialogOpenSpy: jasmine.Spy;
    let empServiceDeleteSpy;
    let empServiceGetAllSpy;
    let messageServiceAddSpy;

    const employees: Employee[] = [
      {
        id: '1',
        firstName: 'Jeff',
        lastName: 'Jefferson',
        active: true,
        hireDate: new Date(2010, 5, 4),
        salary: 50000,
        title: 'Associate'
      },
      {
        id: '2',
        firstName: 'Tiffany',
        lastName: 'Smith',
        active: true,
        hireDate: new Date(2011, 6, 20),
        salary: 60000,
        title: 'Supervisor'
      },
      {
        id: '3',
        firstName: 'John',
        lastName: 'Jacobs',
        active: true,
        hireDate: new Date(2012, 8, 15),
        salary: 75000,
        title: 'Manager'
      }
    ];

    beforeEach( () => {
      dialogOpenSpy = spyOn(dialog, 'open').and.returnValue({
        afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(true))
      } as unknown as MatDialogRef<any>);

      empServiceDeleteSpy = spyOn(empService, 'deleteEmployee').and.callFake(
        () => true
      );
      messageServiceAddSpy = spyOn(messageService, 'add');
      empServiceGetAllSpy = spyOn(empService, 'getAllEmployees').and.callFake(
        () => employees
      );
      fixture.detectChanges();
    });

    it('should open ConfirmDialogComponent', () => {
      component.deleteEmployee(employees[1]);

      expect(component['dialog'].open).toHaveBeenCalledTimes(1);
      expect(component['dialog'].open).toHaveBeenCalledWith(
        ConfirmDialogComponent, jasmine.anything()
      );
    });

    describe('After Confirm Dialog closed', () => {

      describe('User confirmed', () => {

        beforeEach( () => {
          dialogOpenSpy.and.returnValue({
            afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(true))
          } as unknown as MatDialogRef<any>);
        });

        it('should delete employee from employees', () => {
          const empToDelete = employees[1];

          component.deleteEmployee(empToDelete);

          expect(empService.deleteEmployee).toHaveBeenCalledOnceWith(empToDelete.id);
          expect(component.employees).not.toContain(empToDelete);
        });

        it('should toast a success message', () => {
          component.deleteEmployee(employees[1]);

          expect(messageService.add).toHaveBeenCalledOnceWith(
            jasmine.objectContaining( { severity: 'success' } )
          );
        });
      });

      describe('User canceled',  () => {

        beforeEach( () => {
          dialogOpenSpy.and.returnValue({
            afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(false))
          } as unknown as MatDialogRef<any>);
        });

        it('should do nothing', () => {
          const empToDelete = employees[1];

          component.deleteEmployee(empToDelete);

          expect(empService.deleteEmployee).not.toHaveBeenCalled();
          expect(employees).toContain(empToDelete);
          expect(messageService.add).not.toHaveBeenCalled();
        });
      });

    });
  });

  describe('#addEmployee', () => {

  });

  describe('#editEmployee', () => {

  });
});

/*
  Services
*/
class MockEmpService {
  createEmployee(employee: Employee): any {}
  getAllEmployees(id: string): any {}
  updateEmployee(empId: string, updatedEmployee: Employee): any {}
  deleteEmployee(): void {}
}

class MockMessageService {
  add(message: Message): void {}
}

class MockMatDialog {
  open(template: ComponentType<any>, config?: MatDialogConfig): any {}
}
/*
  Components
*/
@Component({
  selector: 'app-handle',
  template: ''
})
class MockHandleComponent {
  @Output() exit: EventEmitter<any> = new EventEmitter();
}

@Component({
  template: ''
})
class MockConfirmDialogComponent {};
