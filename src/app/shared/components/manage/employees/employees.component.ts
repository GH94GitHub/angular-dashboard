import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../interfaces/employee.interface';
import { DynamicComponent } from '../../../interfaces/dynamic-component.interface';
import { DynamicComponentService } from '../../../services/dynamic-component.service';
import { MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import { AddEmployeeComponent } from '../../dialogs/add-employee/add-employee.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent extends DynamicComponent implements OnInit {

  employees!: Employee[];
  styles = {
    width: 'fit-content',
    height: 'fit-content',
    'max-height': '600px'
  };

  constructor(
    private empService: EmployeeService,
    dynamicComponentService: DynamicComponentService,
    messageService: MessageService,
    private dialog: MatDialog
    ) { super(messageService, dynamicComponentService) }

  ngOnInit(): void {
    this.employees = this.empService.getAllEmployees();
  }

  deleteEmployee(emp: Employee): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Employee',
        content: `Are you sure you want to delete`,
        items: `${emp.firstName} ${emp.lastName}: ${emp.title}`
      }
    });

    dialogRef.afterClosed().subscribe( isConfirmed => {
      if (isConfirmed) {

        if (this.empService.deleteEmployee(emp.id)) {

          const newArrayRef = Array(...this.employees);

          const index = newArrayRef.findIndex( employee => {
            if (emp.id === employee.id) return true
            return;
          });
          newArrayRef.splice(index, 1);
          this.employees = newArrayRef;

          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: `Successfully deleted ${emp.firstName} ${emp.lastName}`
          });
        }
      }
    })
  }

  addEmployee(): void {
    const dialogRef = this.dialog.open(AddEmployeeComponent);

    dialogRef.afterClosed().subscribe( employee => {

      const newEmp = this.empService.createEmployee(employee);

      if (newEmp) {
        const newArrayRef: Employee[] = Array(...this.employees);
        newArrayRef.push(employee);

        this.employees = newArrayRef;
        this.messageService.add({
          severity: 'success',
          detail: 'Added',
          summary: `Successfully added ${employee.firstName} ${employee.lastName}: ${employee.title}`
        });

      }
      else
        this.messageService.add({
          severity: 'error',
          detail: 'Failed',
          summary: 'Failed to add employee'
        });
    })
  }
}
