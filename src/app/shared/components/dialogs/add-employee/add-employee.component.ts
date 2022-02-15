import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee, TITLES } from '../../../interfaces/employee.interface';
import { v4 as uuid } from 'uuid';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {

  addEmployeeForm: FormGroup = {} as FormGroup;
  titles: any[] = TITLES;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEmployeeComponent>
    ) { }

  ngOnInit(): void {
    this.addEmployeeForm = this.fb.group({
      firstName: ['', Validators.compose([Validators.required, Validators.pattern(/[a-z]/i)])],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern(/[a-z]/i)])],
      salary: ['', Validators.compose([Validators.required, Validators.pattern(/^(\$|)([1-9]\d{0,2}(\,\d{3})*|([1-9]\d*))(\.\d{2})?$/)])],
      title: ['', Validators.required]
    })
  }

  addEmployee(): void {
    const formValue = this.addEmployeeForm.value;
    const newEmployee: Employee = {
      id: uuid(),
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      active: true,
      hireDate: new Date(),
      salary: formValue.salary,
      title: formValue.title
    };

    this.dialogRef.close(newEmployee);
  }

}
