import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';

import { UserData } from 'src/app/shared/user-data.model';
import { Task } from 'src/app/shared/task.model';
import { TasksService } from 'src/app/tasks/tasks.service';
import { UsersService } from 'src/app/users/users.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-given-task',
  templateUrl: './update-given-task.component.html',
  styleUrls: ['./update-given-task.component.css'],
})
export class UpdateGivenTaskComponent implements OnInit, OnDestroy {
  private tasksSub: Subscription | undefined;
  private workersSub: Subscription | undefined;
  private givenTaskSub: Subscription | undefined;

  givenTaskId = '';
  workerName = '';
  workerId = '';
  taskName = '';
  taskId = '';
  count = '';
  status = '';

  isLoading = true;
  hiddenClass = '';
  isFormValid!: boolean;

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

  givenTask: any;

  constructor(
    private tasksService: TasksService,
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.isFormValid == undefined) {
      this.hiddenClass = 'classHidden';
    }
    this.givenTaskId = this.activatedRoute.snapshot.params.id;
    this.tasksService.getGivenTask(this.givenTaskId);
    this.givenTaskSub = this.tasksService.getGivenTaskListener().subscribe((givenTaskData: any) => {
      if(givenTaskData.worker){
        this.workerName = givenTaskData.worker.fullName;
        this.workerId = givenTaskData.worker._id;
      }
      this.taskName = givenTaskData.task.taskName;
      this.taskId = givenTaskData.task._id;
      this.count = givenTaskData.count;
      this.status = givenTaskData.status;
    });



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

  onTaskUpdate(form: NgForm) {
    if (form.invalid) {
      this.isFormValid = false;
      this.hiddenClass = '';
      setTimeout(() => {
        this.hiddenClass = 'classHidden';
      }, 3800);
      return;
    }

    this.givenTaskId = this.activatedRoute.snapshot.params.id;

    this.tasksService.updateGivenTask(this.givenTaskId, form.value);

    form.reset();
    this.isFormValid = true;
    this.hiddenClass = '';
    setTimeout(() => {
      this.hiddenClass = 'classHidden';
    }, 3800);

    this.router.navigate(['/admin', 'now-working']);
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
    this.tasksSub?.unsubscribe();
    this.workersSub?.unsubscribe();
    this.givenTaskSub?.unsubscribe();
  }
}
