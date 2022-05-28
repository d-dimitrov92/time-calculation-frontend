import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestGuard } from '../users/guest.guard';
import { StartedTaskComponent } from './started-task/started-task.component';


const routes: Routes = [
  {
    path: 'started-task/:id',
    component: StartedTaskComponent,
    canActivate: [GuestGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [GuestGuard],
})
export class TasksRoutingModule {}
