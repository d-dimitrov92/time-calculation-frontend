import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { MatExpansionModule } from '@angular/material/expansion';

import { FunctionalityComponent } from './functionality/functionality.component';
import { ToggleRegisterComponent } from './functionality/toggle-register/toggle-register.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { NowWorkingComponent } from './now-working/now-working.component';
import { AdminComponent } from './admin.component';
import { WorkerStatusComponent } from './functionality/worker-status/worker-status.component';
import { GiveTaskComponent } from './give-task/give-task.component';
import { AllTasksComponent } from './all-tasks/all-tasks.component';
import { AdminStatusComponent } from './functionality/admin-status/admin-status.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { WaitingTasksComponent } from './waiting-tasks/waiting-tasks.component';
import { AverageForUnitsComponent } from './statistics/average-for-units/average-for-units.component';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PausedTasksComponent } from './paused-tasks/paused-tasks.component';
import { UpdateGivenTaskComponent } from './update-given-task/update-given-task.component';


@NgModule({
  declarations: [
    FunctionalityComponent,
    ToggleRegisterComponent,
    AddTaskComponent,
    StatisticsComponent,
    NowWorkingComponent,
    AdminComponent,
    WorkerStatusComponent,
    GiveTaskComponent,
    AdminStatusComponent,
    AllTasksComponent,
    EditTaskComponent,
    WaitingTasksComponent,
    AverageForUnitsComponent,
    PausedTasksComponent,
    UpdateGivenTaskComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AdminRoutingModule,
    FormsModule,
    MatExpansionModule,
    MatProgressSpinnerModule
  ],
})
export class AdminModule {}
