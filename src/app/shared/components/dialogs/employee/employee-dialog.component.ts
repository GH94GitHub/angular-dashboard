import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee, TITLES } from '../../../interfaces/employee.interface';
import { v4 as uuid } from 'uuid';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee-dialog.component.html',
  styleUrls: ['./employee-dialog.component.scss']
})
export class EmployeeDialogComponent implements OnInit {

  employeeForm: FormGroup = {} as FormGroup;
  isNew!: boolean;
  titles: any[] = TITLES;


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }

    ngOnInit(): void {
      if (this.data && this.data.employee) this.isNew = false;
      else this.isNew = true;

      this.employeeForm = this.fb.group({
        firstName: [ this.isNew ? '' : this.data.employee.firstName , Validators.compose([Validators.required, Validators.pattern(/[a-z]/i)])],
        lastName: [this.isNew ? '' : this.data.employee.lastName, Validators.compose([Validators.required, Validators.pattern(/[a-z]/i)])],
        salary: [this.isNew ? '' : this.data.employee.salary, Validators.compose([Validators.required, Validators.pattern(/^(\$|)([1-9]\d{0,2}(\,\d{3})*|([1-9]\d*))(\.\d{2})?$/)])],
        title: [this.isNew ? '' : this.data.employee.title, Validators.required]
      })
    }

  returnEmployee(): void {
    const formValue = this.employeeForm.value;
    let employee: Employee = {} as Employee;

    if (this.data && this.data.employee) {
      employee = {
        id: this.data.employee.id,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        active: this.data.employee.active,
        hireDate: this.data.employee.hireDate,
        salary: formValue.salary,
        title: formValue.title
      }
    }
    else {
      employee = {
        id: uuid(),
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        active: true,
        hireDate: new Date(),
        salary: formValue.salary,
        title: formValue.title
      };

    }

    this.dialogRef.close(employee);
  }

}
