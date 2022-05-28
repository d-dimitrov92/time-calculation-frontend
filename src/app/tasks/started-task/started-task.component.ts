import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-started-task',
  templateUrl: './started-task.component.html',
  styleUrls: ['./started-task.component.css'],
})
export class StartedTaskComponent implements OnInit {
  time: any;

  hours!: number | string;
  minutes!: number | string;
  seconds!: number | string;
  displayTime!: string;

  nowDate: any;
  startDate: Date | undefined;

  workingTaskSub!: Subscription;
  workingTask: any;

  isStarted = true;
  isPaused!: boolean;
  isEnded = false;

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const taskId = this.route.snapshot.params.id;
    this.tasksService.getGivenTask(taskId);
    this.workingTaskSub = this.tasksService
      .getGivenTaskListener()
      .subscribe((result: any) => {
        this.workingTask = result;

        if (this.workingTask.status == 'started') {
          this.isStarted = true;
          this.isPaused = false;
        } else if (this.workingTask.status == 'paused') {
          this.isStarted = false;
          this.isPaused = true;
        }
      });

    this.nowDate = new Date(Date.now()).toLocaleDateString('bg-BG');
  }

  onStartTask() {
    const taskId = this.route.snapshot.params.id;

    this.tasksService.startTask(taskId);
    this.isStarted = true;
    this.isPaused = false;
  }

  onPauseTask(str?: string) {
    const taskId = this.route.snapshot.params.id;

    if (confirm('Сигурни ли сте, че искате да минете в режим пауза?')) {
      this.tasksService.pauseTask(taskId, str);
      this.isStarted = false;
      this.isPaused = true;
    }
  }

  onPauseTaskAndBack(str: string) {
    if (
      confirm(
        'Сигурни ли сте, че искате да минете в режим пауза и да продължите с друга задача?'
      )
    ) {
      this.onPauseTask(str);
      this.router.navigate(['/']);
    }
  }

  onStopTask() {
    const taskId = this.route.snapshot.params.id;

    if(confirm('Сигурни ли сте, че искате да прекратите дадената дейност?')) {
      this.tasksService.stopTask(taskId);
      this.isStarted = false;
      this.isEnded = true;
      console.log('Task stopped');
      this.router.navigate(['/']);
    }
  }
}

// timer(1000, 1000).subscribe((ellapsedCycles) => {
//   this.time = ellapsedCycles;

//   this.hours = Math.floor(this.time / 3600);
//   if (this.hours < 10) {
//     this.hours = '0' + this.hours;
//   }

//   this.minutes = Math.floor((this.time % 3600) / 60);
//   if (this.minutes < 10) {
//     this.minutes = '0' + this.minutes;
//   }

//   this.seconds = Math.floor((this.time % 3600) % 60);
//   if (this.seconds < 10) {
//     this.seconds = '0' + this.seconds;
//   }

//   this.displayTime = `${this.hours}:${this.minutes}:${this.seconds}`;
// });
