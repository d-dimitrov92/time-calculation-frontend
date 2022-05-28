import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/users/users.service';

import { UserData } from '../../shared/user-data.model';
import { Task } from '../../shared/task.model';
import { TasksService } from 'src/app/tasks/tasks.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './give-task.component.html',
  styleUrls: ['./give-task.component.css'],
})
export class GiveTaskComponent implements OnInit, OnDestroy {
  private tasksSub: Subscription | undefined;
  private workersSub: Subscription | undefined;

  isFormValid!: boolean;
  isLoading = true;
  hiddenClass = '';

  workerName = '';
  workerId = '';
  taskName = '';
  taskId = '';
  count = '';

  tasks!: any;

  rf100Tasks!: Task[];
  oneETasks!: Task[];
  harttTasks!: Task[];

  rf100Blocks!: [];
  oneEBlocks!: [];
  harttBlocks!: [];

  users!: UserData[];
  workers!: UserData[];
  models = [];

  constructor(
    private tasksService: TasksService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    if(this.isFormValid == undefined) {
      this.hiddenClass = 'classHidden';
    }
    this.tasksService.getAllTasks();
    this.tasksSub = this.tasksService
      .getTaskUpdateListener()
      .subscribe((tasksData: any) => {
        this.rf100Tasks = tasksData.rf100.rf100Tasks;
        this.rf100Blocks = tasksData.rf100.rf100Blocks;

        this.oneETasks = tasksData.oneE.oneETasks;
        this.oneEBlocks = tasksData.oneE.oneEBlocks;

        this.harttTasks = tasksData.hartt.harttTasks;
        this.harttBlocks = tasksData.hartt.harttBlocks;

        this.models = tasksData.models;

        this.isLoading = false;
      });

    this.userService.getAllWorkers();
    this.workersSub = this.userService
      .getWorkersListener()
      .subscribe((workers: any) => {
        this.workers = workers;
      });
  }

  onUpdateWorkerInput(workerName: string, workerId: string) {
    this.workerName = workerName;
    this.workerId = workerId;
  }

  onUpdateTaskInput(taskName: string, taskId: string) {
    this.taskName = taskName;
    this.taskId = taskId;
  }

  onTaskAdded(form: NgForm) {
    if (form.invalid) {
      this.isFormValid = false;
      this.hiddenClass = '';
      setTimeout(() => {
        this.hiddenClass = 'classHidden';
      }, 3800);
      return;
    }

    const adminId = this.userService.getUserId();
    const task = {
      task: form.value.taskIdInput.trim(),
      worker: form.value.workerIdInput.trim(),
      count: form.value.countInput,
      createdBy: adminId,
    };

    this.tasksService.giveTask(task);
    form.reset();
    this.isFormValid = true;
    this.hiddenClass = '';
    setTimeout(() => {
      this.hiddenClass = 'classHidden';
    }, 3800);
  }

  ngOnDestroy() {
    this.tasksSub?.unsubscribe();
    this.workersSub?.unsubscribe();
  }
}
