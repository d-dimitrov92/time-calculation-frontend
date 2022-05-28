import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddTaskComponent } from './add-task/add-task.component';
import { AdminComponent } from './admin.component';
import { AdminGuard } from './admin.guard';
import { AllTasksComponent } from './all-tasks/all-tasks.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { AdminStatusComponent } from './functionality/admin-status/admin-status.component';
import { FunctionalityComponent } from './functionality/functionality.component';
import { ToggleRegisterComponent } from './functionality/toggle-register/toggle-register.component';
import { WorkerStatusComponent } from './functionality/worker-status/worker-status.component';
import { GiveTaskComponent } from './give-task/give-task.component';
import { NowWorkingComponent } from './now-working/now-working.component';
import { PausedTasksComponent } from './paused-tasks/paused-tasks.component';
import { AverageForUnitsComponent } from './statistics/average-for-units/average-for-units.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { UpdateGivenTaskComponent } from './update-given-task/update-given-task.component';
import { WaitingTasksComponent } from './waiting-tasks/waiting-tasks.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'add-task',
        component: AddTaskComponent,
      },
      {
        path: 'all-tasks',
        component: AllTasksComponent,
      },
      {
        path: 'edit-task/:id',
        component: EditTaskComponent,
      },
      {
        path: 'give-task',
        component: GiveTaskComponent,
      },
      {
        path: 'update-given-task/:id',
        component: UpdateGivenTaskComponent
      },
      {
        path: 'paused-tasks',
        component: PausedTasksComponent
      },
      {
        path: 'statistics',
        component: StatisticsComponent,
        children: [
          {
            path: 'average-for-unit',
            component: AverageForUnitsComponent,
          },
        ],
      },
      {
        path: 'now-working',
        component: NowWorkingComponent,
      },
      {
        path: 'get-by-status/:status',
        component: WaitingTasksComponent,
      },
      {
        path: 'functionality',
        component: FunctionalityComponent,
        children: [
          {
            path: 'toggle-register',
            component: ToggleRegisterComponent,
          },
          {
            path: 'admin-status',
            component: AdminStatusComponent,
          },
          {
            path: 'worker-status',
            component: WorkerStatusComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
