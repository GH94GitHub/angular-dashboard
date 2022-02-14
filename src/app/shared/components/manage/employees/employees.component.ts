import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../data/employee';
import { DynamicComponent } from '../../../interfaces/dynamic-component.interface';
import { DynamicComponentService } from '../../../services/dynamic-component.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent extends DynamicComponent implements OnInit {

  employees!: Employee[];
  styles = {
    width: 'fit-content',
    height: '400px'
  };

  constructor(
    private empService: EmployeeService,
    dynamicComponentService: DynamicComponentService,
    messageService: MessageService
    ) { super(messageService, dynamicComponentService) }

  ngOnInit(): void {
    this.employees = this.empService.getAllEmployees();
  }

}
