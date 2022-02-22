import { TestBed } from '@angular/core/testing';
import { Employee } from '../interfaces/employee.interface';

import { EmployeeService } from './employee.service';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let Employees: Employee[];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeService);

    Employees = [
      {
        id: '12345',
        firstName: "Keila",
        lastName: "Rheie",
        active: true,
        hireDate: new Date(2019, 4, 26),
        salary: 67000,
        title: 'Supervisor'
      },
      {
        id: '98765',
        firstName: "Jonathan",
        lastName: "Jessa",
        active: true,
        hireDate: new Date(2019, 6, 15),
        salary: 60000,
        title: 'Associate'
      },
      {
        id: '12983',
        firstName: "Ashlee",
        lastName: "Steven",
        active: true,
        hireDate: new Date(2018, 8, 3),
        salary: 70000,
        title: 'Manager'
      },
    ];

    service['employees'] = Employees;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all employees', () => {
    const returnedEmployees = service.getAllEmployees();

    expect(returnedEmployees).toEqual(Employees)
  });

  describe('createEmployee()', () => {
    let newEmployee: Employee;

    beforeEach( () => {

      newEmployee = {
        id: '9999999',
        firstName: 'TestFirstName',
        lastName: 'TestLastName',
        active: true,
        hireDate: new Date(),
        salary: 50000,
        title: 'Manager'
      };

    })

    it('should create a new employee', () => {
      const returnedEmployee = service.createEmployee(newEmployee);

      expect(returnedEmployee).toEqual(newEmployee);
      expect(Employees).toContain(newEmployee);
    });

    it('should return undefined if attempting to create employee with duplicate id', () => {
      newEmployee.id = '12345';

      const returnValue = service.createEmployee(newEmployee);

      expect(returnValue).toBeUndefined();
      expect(Employees).not.toContain(newEmployee);
    });
  });

  describe('updateEmployee()', () => {
    let employeeToUpdate: Employee;

    beforeEach( () => {
      employeeToUpdate = Employees[0];
    })

    it('should update an employee', () => {
      employeeToUpdate.title = 'Manager';
      employeeToUpdate.firstName = 'Kayla';
      employeeToUpdate.salary = 35000;

      const updatedEmployee = service.updateEmployee(employeeToUpdate.id, employeeToUpdate);

      expect(updatedEmployee).toEqual(employeeToUpdate);
      expect(Employees).toContain(employeeToUpdate);
    });

    it('should return undefined if passed nonexistent employee id', () => {
      const updatedEmployee = service.updateEmployee('1654798', employeeToUpdate);

      expect(updatedEmployee).toBeUndefined();
    });

    it('should rethrow error if not "break"', () => {

    })
  });

  describe('getEmployeeById()', () => {
    it('should get an employee by their id', () => {
      const returnedEmployee = service.getEmployeeById('98765');

      expect(returnedEmployee).toEqual(Employees[1]);
    });

    it('should returned undefined if passed nonexistent employee id', () => {
      const returnedEmployee = service.getEmployeeById('9230923940');
      expect(returnedEmployee).toBeUndefined();
    });

  });

  describe('deleteEmployee()', () => {
    it('should delete an employee', () => {
      const employeeToDelete: Employee = Employees[0];
      const employeeDeleted: boolean = service.deleteEmployee(employeeToDelete.id);

      expect(employeeDeleted).toBeTruthy();
      expect(Employees).not.toContain(employeeToDelete);
    });

    it('should return false if given an invalid employee id', () => {
      const empId = '092320';
      const wasDeleted = service.deleteEmployee(empId);

      expect(wasDeleted).toBeFalsy();
    });

  });
});
