import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { TasksService } from 'src/app/tasks/tasks.service';

@Component({
  selector: 'app-waiting-tasks',
  templateUrl: './waiting-tasks.component.html',
  styleUrls: ['./waiting-tasks.component.css'],
})
export class WaitingTasksComponent implements OnInit, OnDestroy {
  waitingTasksSub!: Subscription;

  isLoading = true;

  waitingTasks!: any;

  isWaitingTasks = false;
  waitingTasksLength!: number;

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const status = this.route.snapshot.params.status;

    this.tasksService.getTasksByStatus(status);
    this.waitingTasksSub = this.tasksService
      .getTasksByStatusListener()
      .subscribe((result: any) => {
        this.waitingTasks = result.tasks;
        this.waitingTasksLength = this.waitingTasks.length;
        if(this.waitingTasksLength > 0) {
          this.isWaitingTasks = true;
        }
        this.isLoading = false;
      });
  }

  onAction(status: string, id: string) {
    this.tasksService.approvingTask(status, id);

    console.log('action taken');
    location.reload();
  }

  ngOnDestroy(): void {
    this.waitingTasksSub.unsubscribe();
  }
}
