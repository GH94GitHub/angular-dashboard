import { ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TITLES } from 'src/app/shared/interfaces/employee.interface';
import { EmployeeDialogComponent } from './employee-dialog.component';
import { Employee } from '../../../interfaces/employee.interface';

describe('EmployeeDialogComponent', () => {
  let component: EmployeeDialogComponent;
  let fixture: ComponentFixture<EmployeeDialogComponent>;

  let loader: HarnessLoader;

  let dialogRefSpy: {
    close: jasmine.Spy
  };
  let matDataSpy: jasmine.Spy;

  beforeEach(async () => {

    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    matDataSpy = jasmine.createSpy('MAT_DIALOG_DATA').and.returnValue({});

    await TestBed.configureTestingModule({
      declarations: [ EmployeeDialogComponent ],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatDialogModule
      ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: matDataSpy }
      ]
    })
    .compileComponents();
  });

  describe('init', () => {

    beforeEach( () => {
      component = TestBed.createComponent(EmployeeDialogComponent).componentInstance;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('When adding new employee', () => {
    const employeeFromForm: Partial<Employee> = {
      firstName: 'John',
      lastName: 'Jingle',
      salary: 67000,
      title: 'Supervisor'
    };

    let matInputs: MatInputHarness[];
    let matSelect: MatSelectHarness;


    beforeEach(() => {
      fixture = TestBed.createComponent(EmployeeDialogComponent);
      component = fixture.componentInstance;
      component.titles = TITLES;

        fixture.detectChanges();
    });

    beforeEach( async() => {
      loader = TestbedHarnessEnvironment.loader(fixture);
      matInputs = await loader.getAllHarnesses(MatInputHarness);
      matSelect = await loader.getHarness(MatSelectHarness);
    });

    it('#returnEmployee() should create new employee', () => {
      component.employeeForm.setValue(employeeFromForm);
      component.returnEmployee();

      expect(component['dialogRef'].close).toHaveBeenCalledOnceWith(
        jasmine.objectContaining(employeeFromForm)
      );
      expect(component['dialogRef'].close).toHaveBeenCalledOnceWith(
        jasmine.objectContaining( { id: jasmine.anything() } )
      )
    });

    it('Inputs should be empty', async() => {
      matInputs.forEach( async harness => {
        expect(await harness.getValue()).toBe('');
      });
      expect(await matSelect.getValueText()).toBe('');
    });
  });

  describe('When updating an employee', () => {

    let mockData: any;
    let matInputs: MatInputHarness[];
    let matSelect: MatSelectHarness;

    const updatedEmployee: Partial<Employee> = {
      firstName: 'updatedEmployee',
      lastName: 'updatedLastName',
      salary: 42000,
      title: 'Associate'
    };

    beforeEach( async () => {

      mockData = {
        employee: {
          id: '234234',
          firstName: 'Johnny',
          lastName: 'Juice',
          hireDate: new Date(2021, 4, 25),
          active: true,
          salary: 85000,
          title: 'Supervisor'
        }
      };

      TestBed.overrideProvider(MAT_DIALOG_DATA, {
        useValue: mockData
      });
      fixture = TestBed.createComponent(EmployeeDialogComponent);
      component = fixture.componentInstance;
      loader = TestbedHarnessEnvironment.loader(fixture);
      matInputs = await loader.getAllHarnesses(MatInputHarness);
      matSelect = await loader.getHarness(MatSelectHarness)

      component.titles = TITLES;
      fixture.detectChanges();
    });

    it('#returnEmployee() should update the employee', () => {
      component.employeeForm.setValue(updatedEmployee);
      component.returnEmployee();

      expect(dialogRefSpy.close).toHaveBeenCalledOnceWith(
        jasmine.objectContaining( updatedEmployee )
      );
      expect(dialogRefSpy.close).toHaveBeenCalledOnceWith(
        jasmine.objectContaining( { id: mockData.employee.id } )
      );
    });

    it('firstName `input` should be populated', fakeAsync(() => {
      let firstNameValue: string | undefined;
      const firstNameInput: MatInputHarness | undefined = matInputs.find( async harness => {

        harness.getName().then( name => {
          return name === 'firstName'
        });
      });

      tick();
      firstNameInput!.getValue().then( value => {
        firstNameValue = value;
      });
      tick();

      expect(firstNameInput).toBeTruthy();
      expect(firstNameValue).toBe('Johnny');
    }));

    it('lastName `input` should be populated', fakeAsync(() => {
      let lastNameValue: string | undefined;
      const lastNameInput: MatInputHarness | undefined = matInputs.find( harness => {

        let inputName: string;

        harness.getName().then( name => {
          inputName = name;
        });
        tick();
        return inputName! === 'lastName'
      });
      tick();
      lastNameInput!.getValue().then( value => {
        lastNameValue = value;
      });
      tick();

      expect(lastNameInput).toBeTruthy();
      expect(lastNameValue).toBe('Juice');
    }));

    it('salary `input` should be populated', fakeAsync(() => {
      let salaryValue: any;
      const salaryInput = matInputs.find( harness => {

        let inputName: string;
        harness.getName().then( name => {
          inputName = name
        });
        tick()

        return inputName! === 'salary'
      });

      tick();
      salaryInput!.getValue().then( value => {
        salaryValue = value
      });
      tick()

      expect(salaryInput).toBeTruthy();
      expect(salaryValue).toBe('85000');
    }));

    it('title `select` should be populated', async () => {
      expect(await matSelect.getValueText()).toBe(mockData.employee.title);
    });
  });

  describe('#returnEmployee()', () => {

    let mockEmployee: Partial<Employee>;

    beforeEach( () => {
      fixture = TestBed.createComponent(EmployeeDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      mockEmployee = {
        firstName: 'Jerry',
        lastName: 'Sprinkle',
        salary: 100000,
        title: 'Manager'
      };

      component.employeeForm.setValue(mockEmployee);
      component.returnEmployee();
    });

    it('should return Employee to dialogOpener', () => {
      const closeArg = dialogRefSpy.close.calls.first().args[0];

      expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
      expect(closeArg).toEqual(jasmine.objectContaining(mockEmployee));
    });
  });
});
