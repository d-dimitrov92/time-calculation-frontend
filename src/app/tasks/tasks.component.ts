import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UsersService } from '../users/users.service';
import { TasksService } from './tasks.service';

import { GivenTask } from '../shared/given-task.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit, OnDestroy {
  givenTasksSub: Subscription | undefined;

  givenTasks!: GivenTask[];
  currentUserTasks!: GivenTask[];
  currentUserPausedTasks!: GivenTask[];
  currentUserId!: string | null;

  tasksCount!: number;
  pausedTasksCount!: number;

  user!: any;
  userSub!: Subscription;

  constructor(
    private tasksService: TasksService,
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.usersService.getUserId();

    setTimeout(() => {
      this.usersService.getUser(this.currentUserId!);
      this.userSub = this.usersService.getUserListener().subscribe((result) => {
        this.user = result;
        if (this.user.activeTask != null) {
          const task = this.user.activeTask;

          this.router.navigate([`/started-task/${task}`]);
        }
      });
    }, 300);

    this.tasksService.getGivenTasksByUser();
    this.givenTasksSub = this.tasksService
      .getGivenTasksByUserUpdateListener()
      .subscribe((result: any) => {
        this.givenTasks = result;
        this.currentUserTasks = this.givenTasks.filter(
          (task) => task.status == 'pending'
        );

        this.currentUserPausedTasks = this.givenTasks.filter(
          (task) => task.status == 'paused'
        );

        this.pausedTasksCount = this.currentUserPausedTasks.length;
        this.tasksCount = this.currentUserTasks.length;
      });
  }

  onTaskStarted(id: string) {
    this.tasksService.startTask(id);

    this.router.navigate(['/started-task', id]);
  }

  ngOnDestroy() {
    this.givenTasksSub?.unsubscribe();
    this.userSub.unsubscribe();
  }
}
