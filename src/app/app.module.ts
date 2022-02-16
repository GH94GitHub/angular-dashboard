/* Modules */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

/* Components */
import { AppComponent } from './app.component';
import { HomeDashboardComponent } from './home-dashboard/home-dashboard.component';
import { SidenavLinksComponent } from './shared/components/sidenav-links/sidenav-links.component';
import { ClockWidgetComponent } from './shared/components/widgets/clock-widget/clock-widget.component';
import { HandleComponent } from './shared/components/handle/handle.component';
import { WeatherWidgetComponent } from './shared/components/widgets/weather-widget/weather-widget.component';

/* Material UI */
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

/* PrimeNG UI*/
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { EmployeesComponent } from './shared/components/manage/employees/employees.component';
import { ConfirmDialogComponent } from './shared/components/dialogs/confirm-dialog/confirm-dialog.component';
import { InputTextModule } from 'primeng/inputtext';
import { EmployeeDialogComponent } from './shared/components/dialogs/employee/employee-dialog.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomeDashboardComponent,
    SidenavLinksComponent,
    ClockWidgetComponent,
    HandleComponent,
    WeatherWidgetComponent,
    EmployeesComponent,
    ConfirmDialogComponent,
    EmployeeDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    DragDropModule,
    FlexLayoutModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatSidenavModule,
    MatExpansionModule,
    MatRippleModule,
    ToastModule,
    HttpClientModule,
    TableModule,
    MatDialogModule,
    InputTextModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],
  providers: [
    MessageService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
