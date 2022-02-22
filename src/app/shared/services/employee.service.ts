import { Injectable } from '@angular/core';
import { EMPLOYEE_DATA } from '../data/employee';
import { Employee } from '../interfaces/employee.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private employees: Employee[] = EMPLOYEE_DATA;

  constructor() {  }

  /**
   * Gets all the employees
   * @returns An array of all the employees
   */
  getAllEmployees(): Employee[] {
    return this.employees.filter( employee => {
      return employee.active === true;
    });
  }

  /**
   * Gets an employee that has the id specified
   * @param empId Unique employee identifier
   * @returns The employee that matches the id or undefined
   */
  getEmployeeById(empId: string): Employee | undefined{
    return this.employees.find( employee => employee.id === empId )
  }
  /**
   * Adds an employee
   * @param employee Employee to be added
   * @returns The employee that was added or false if nothing was added
   */
  createEmployee(employee: Employee): Employee | undefined {
    const existingEmployee: Employee | undefined = this.employees.find(
      e => e.id === employee.id );

    if (existingEmployee) {
      return;
    }
    else {
      this.employees.push(employee);
      return employee;
    }
  }

  /**
   * Updates an employee specified by the id
   * @param empId Employee id to update
   * @param updatedEmployee Contains new Employee object
   * @returns The updated employee information or undefined if it was unsuccessful
   */
  updateEmployee(empId: string, updatedEmployee: Employee): Employee | undefined {
    let updatedEmp;
    try{

      this.employees.forEach( employee => {

        if(!(empId === employee.id)) return;
        employee = updatedEmployee;
        updatedEmp = updatedEmployee;
        throw 'break';
      });
    }
    catch(e) {

      if (e !== 'break') throw e;
    }

    return updatedEmp;
  }

  /**
   * Deletes an employee based on the id provided
   * @param empId Employee id to delete
   * @returns True or False if the deletion was successful
   */
  deleteEmployee(empId: string): boolean {
    const empIndex: number = this.employees.findIndex( employee => empId === employee.id );
    if (empIndex === -1) return false;

    this.employees.splice(empIndex, 1);
    return true;
  }
}
