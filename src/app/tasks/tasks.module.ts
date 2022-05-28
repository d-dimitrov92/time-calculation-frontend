import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StartedTaskComponent } from './started-task/started-task.component';
import { TasksComponent } from './tasks.component';
import { HomeComponent } from '../home/home.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { ControlsComponent } from '../controls/controls.component';

@NgModule({
  declarations: [HomeComponent, TasksComponent, StartedTaskComponent, ControlsComponent],
  imports: [CommonModule, TasksRoutingModule],
})
export class TasksModule {}
