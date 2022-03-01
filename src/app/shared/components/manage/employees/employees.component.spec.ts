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
import { EmployeeDialogComponent } from '../../dialogs/employee/employee-dialog.component';
import { cloneDeep } from 'lodash';


describe('EmployeesComponent', () => {
  let component: EmployeesComponent;
  let fixture: ComponentFixture<EmployeesComponent>;

  let empService: EmployeeService;
  let messageService: MessageService;
  let dialog: MatDialog;

  let empServiceGetAllSpy: jasmine.Spy;
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
    empServiceGetAllSpy = spyOn(empService, 'getAllEmployees').and.callThrough();
    fixture.detectChanges();
  });

  describe('#init', () => {

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

  describe('#deleteEmployee', () => {
    let dialogOpenSpy: jasmine.Spy;
    let empServiceDeleteSpy;
    let messageServiceAddSpy;

    beforeEach( () => {
      dialogOpenSpy = spyOn(dialog, 'open').and.returnValue({
        afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(true))
      } as unknown as MatDialogRef<any>);

      empServiceDeleteSpy = spyOn(empService, 'deleteEmployee').and.returnValue( true );
      messageServiceAddSpy = spyOn(messageService, 'add');

    });

    it('should open ConfirmDialogComponent', () => {
      component.deleteEmployee(component.employees[1]);

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
          const empToDelete = component.employees[1];

          component.deleteEmployee(empToDelete);

          expect(empService.deleteEmployee).toHaveBeenCalledOnceWith(empToDelete.id);
          expect(component.employees).not.toContain(empToDelete);
        });

        it('should toast a success message', () => {
          component.deleteEmployee(component.employees[1]);

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
          const empToDelete = component.employees[1];

          component.deleteEmployee(empToDelete);

          expect(empService.deleteEmployee).not.toHaveBeenCalled();
          expect(component.employees).toContain(empToDelete);
          expect(messageService.add).not.toHaveBeenCalled();
        });
      });

    });
  });

  describe('#addEmployee', () => {
    let dialogOpenSpy;
    let empServiceCreateSpy;
    let messageServiceAddSpy;

    const empToAdd: Employee = {
      id: '198874',
      firstName: 'Jerry',
      lastName: 'Sprinkle',
      active: true,
      hireDate: new Date(2005, 5, 22),
      salary: 150000,
      title: 'Manager'
    }

    beforeEach( () => {
      dialogOpenSpy = spyOn(dialog, 'open').and.returnValue({
        afterClosed: jasmine.createSpy('afterClosed').and.returnValue( of(empToAdd) )
      } as unknown as MatDialogRef<any>);

      empServiceCreateSpy = spyOn(empService, 'createEmployee').and.returnValue(empToAdd);
      messageServiceAddSpy = spyOn(component['messageService'], 'add');
      component.addEmployee();
    });

    it('should open EmployeeDialog', () => {
      expect(dialog.open).toHaveBeenCalledOnceWith(EmployeeDialogComponent);
    });

    it('should call EmployeeService to create employee', () => {
      expect(empService.createEmployee).toHaveBeenCalledOnceWith(empToAdd);
    });

    it('should add new employee to component employees property', () => {
      expect(component.employees).toContain(empToAdd);
    });

    it('should toast a success message', () => {
      expect(messageService.add).toHaveBeenCalledOnceWith(
        jasmine.objectContaining( { severity: 'success' } )
      )
    });

  });

  describe('#editEmployee', () => {
    let dialogOpenSpy: jasmine.Spy;
    let empServiceUpdateSpy: jasmine.Spy;
    let messageServiceAddSpy: jasmine.Spy;

    let employeeToUpdate: Employee;
    let updatedEmployee: Employee;

    beforeEach( () => {
      employeeToUpdate = component.employees[1];
      updatedEmployee = cloneDeep(employeeToUpdate);
      updatedEmployee.firstName = 'testFirstName';
      updatedEmployee.lastName = 'testLastName';

      dialogOpenSpy = spyOn(dialog, 'open').and.returnValue({
        afterClosed: jasmine.createSpy('afterClosed').and.returnValue( of(updatedEmployee) )
      } as unknown as MatDialogRef<any>);
      empServiceUpdateSpy = spyOn(empService, 'updateEmployee').and.returnValue(updatedEmployee);
      messageServiceAddSpy = spyOn(messageService, 'add');
    });

    it('should call EmployeeDialog with employee to update', () => {
      component.editEmployee(employeeToUpdate);

      expect(dialog.open).toHaveBeenCalledOnceWith(EmployeeDialogComponent,
        { data: {
            employee: employeeToUpdate
        }}
      );
    });

    it("should do nothing if user didn't update the employee", () => {
      dialogOpenSpy.and.returnValue({
        afterClosed: jasmine.createSpy('afterClosed').and.returnValue( of(employeeToUpdate) )
      } as unknown as MatDialogRef<any>);
      component.editEmployee(employeeToUpdate);

      expect(empService.updateEmployee).not.toHaveBeenCalled();
      expect(empService.getAllEmployees()).toEqual(component.employees);
      expect(messageService.add).not.toHaveBeenCalled();
    });

    it('should call the employeeService updateEmployee method', () => {
      component.editEmployee(employeeToUpdate);

      expect(empService.updateEmployee).toHaveBeenCalledOnceWith(employeeToUpdate.id, updatedEmployee);
    });

    it('should update the components employees prop', () => {
      component.editEmployee(employeeToUpdate);

      expect(empService.getAllEmployees().length).toBe(component.employees.length);
      expect(component.employees).toContain(updatedEmployee);
      expect(component.employees).not.toContain(employeeToUpdate);
    });

    it('should toast a success message', () => {
      component.editEmployee(employeeToUpdate);

      expect(messageService.add).toHaveBeenCalledOnceWith(
        jasmine.objectContaining( { severity: 'success' } )
      );
    });
  });
});

/*
  Services
*/
class MockEmpService {

  private employees: Employee[] = [
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
  ]

  createEmployee(employee: Employee): any {}
  getAllEmployees(): Employee[] { return this.employees }
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
