import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GivenTask } from 'src/app/shared/given-task.model';
import { UserData } from 'src/app/shared/user-data.model';
import { TasksService } from 'src/app/tasks/tasks.service';
import { UsersService } from 'src/app/users/users.service';

@Component({
  selector: 'app-paused-tasks',
  templateUrl: './paused-tasks.component.html',
  styleUrls: ['./paused-tasks.component.css'],
})
export class PausedTasksComponent implements OnInit, OnDestroy {
  givenTasksSub!: Subscription | undefined;
  workersSub: Subscription | undefined;

  isFormValid!: boolean;
  hiddenClass = '';

  isLoading = true;

  allUsersPausedTasks!: GivenTask[];
  workers!: UserData[];

  workerName = '';
  workerId = '';
  taskName = '';
  taskId = '';
  count = '';

  pausedTasksCount!: number;

  constructor(
    private tasksService: TasksService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    if (this.isFormValid == undefined) {
      this.hiddenClass = 'classHidden';
    }
    this.tasksService.getActiveGivenTasks();
    this.givenTasksSub = this.tasksService
      .getActiveGivenTasksListener()
      .subscribe((result: any) => {
        this.allUsersPausedTasks = result.filter(
          (task: any) => task.status == 'paused'
        );
        this.pausedTasksCount = this.allUsersPausedTasks.length;

        this.isLoading = false;
      });

    this.userService.getAllWorkers();
    this.workersSub = this.userService
      .getWorkersListener()
      .subscribe((workers: any) => {
        this.workers = workers;
      });
  }

  onTaskAdded(form: NgForm) {
    console.log(form.value);
    if (form.invalid) {
      this.isFormValid = false;
      this.hiddenClass = '';
      setTimeout(() => {
        this.hiddenClass = 'classHidden';
      }, 3800);
      return;
    }
    /* my code here */
    const givenTaskId = form.value.taskIdInput;
    const data = {
      userId: form.value.workerIdInput,
      isFromPause: true
    }
    this.tasksService.updateGivenTask(givenTaskId, data);

    form.reset();
    this.isFormValid = true;
    this.hiddenClass = '';
    setTimeout(() => {
      this.hiddenClass = 'classHidden';
    }, 3800);
  }

  onUpdateWorkerInput(workerName: string, workerId: string) {
    this.workerName = workerName;
    this.workerId = workerId;
  }

  onUpdateTaskInput(taskName: string, taskId: string) {
    this.taskName = taskName;
    this.taskId = taskId;
  }

  ngOnDestroy() {
    this.givenTasksSub?.unsubscribe();
  }
}
