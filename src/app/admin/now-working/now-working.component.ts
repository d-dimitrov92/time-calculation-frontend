import { ResourceLoader } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GivenTask } from 'src/app/shared/given-task.model';
import { TasksService } from 'src/app/tasks/tasks.service';

@Component({
  selector: 'app-now-working',
  templateUrl: './now-working.component.html',
  styleUrls: ['./now-working.component.css'],
})
export class NowWorkingComponent implements OnInit, OnDestroy {
  givenTasksSub!: Subscription | undefined;

  isLoading = true;

  givenTasks!: any;

  pendingTasks!: any;
  allUsersPendingTasks!: GivenTask[];
  allUsersStartedTasks!: GivenTask[];
  allUsersPausedTasks!: GivenTask[];

  pendingTasksCount!: number;
  startedTasksCount!: number;
  pausedTasksCount!: number;

  constructor(private tasksService: TasksService, private router: Router) {}

  ngOnInit(): void {
    this.tasksService.getActiveGivenTasks();
    this.givenTasksSub = this.tasksService
      .getActiveGivenTasksListener()
      .subscribe((result: any) => {
        this.givenTasks = result;

        this.allUsersPendingTasks = result.filter(
          (task: any) => task.status == 'pending'
        );
        this.pendingTasksCount = this.allUsersPendingTasks.length;

        this.allUsersStartedTasks = result.filter(
          (task: any) => task.status == 'started'
        );
        this.startedTasksCount = this.allUsersStartedTasks.length;

        this.allUsersPausedTasks = result.filter(
          (task: any) => task.status == 'paused'
        );
        this.pausedTasksCount = this.allUsersPausedTasks.length;

        this.isLoading = false;
      });
  }

  onUpdate(taskId: any) {
    this.router.navigate(['/admin', 'update-given-task', taskId]);
  }

  onDelete(taskId: any) {
    if (confirm('Искате ли да изтриете дадената задача?')) {
      this.tasksService.deleteGivenTask(taskId);
      location.reload();

      // for (const item of this.givenTasks) {
      //   if(item._id == taskId) {

      //     let index = this.givenTasks.indexOf(item._id);
      //     console.log(index);
      //   }
      // }
      // console.log('delete');
    }
  }

  ngOnDestroy() {
    this.givenTasksSub?.unsubscribe();
  }
}
