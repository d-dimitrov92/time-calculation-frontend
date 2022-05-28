import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TasksService } from 'src/app/tasks/tasks.service';

@Component({
  selector: 'app-average-for-units',
  templateUrl: './average-for-units.component.html',
  styleUrls: ['./average-for-units.component.css'],
})
export class AverageForUnitsComponent implements OnInit {
  private tasksSub: Subscription | undefined;

  tasks!: any;

  rf100Tasks!: any;
  oneETasks!: any;
  harttTasks!: any;

  rf100Avg = 0;
  oneEAvg = 0;
  harttAvg = 0;

  rf100SqAgg = 0;
  oneESqAgg = 0;
  harttSqAgg = 0;

  rf100SD = 0;
  oneESD = 0;
  harttSD = 0;

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.tasksService.getAllTasks();
    this.tasksSub = this.tasksService
      .getTaskUpdateListener()
      .subscribe((tasksData: any) => {
        this.tasks = tasksData.fetchedTasks;

        this.rf100Tasks = this.tasks.filter(
          (unit: any) => unit.model == 'RF100'
        );

        this.rf100Tasks.sort((a: any, b: any) => {
          return a.partOf.localeCompare(b.partOf)
        })

        this.oneETasks = this.tasks.filter(
          (unit: any) => unit.model == '1E'
        );

        this.oneETasks.sort((a: any, b: any) => {
          return a.partOf.localeCompare(b.partOf)
        })

        this.harttTasks = this.tasks.filter(
          (unit: any) => unit.model == 'hARTT'
        );

        this.harttTasks.sort((a: any, b: any) => {
          return a.partOf.localeCompare(b.partOf)
        })

        for (const task of this.tasks) {
          if (task.model == 'RF100' && task.averageTime) {
            this.rf100Avg += Number(task.averageTime);
            this.rf100SqAgg += Math.pow(Number(task.standardDeviation), 2);
          }
          if (task.model == '1E' && task.averageTime) {
            this.oneEAvg += Number(task.averageTime);
            this.oneESqAgg += Math.pow(Number(task.standardDeviation), 2);
          }
          if (task.model == 'hARTT' && task.averageTime) {
            this.harttAvg += Number(task.averageTime);
            this.harttSqAgg += Math.pow(Number(task.standardDeviation), 2);
          }
        }

        this.rf100SD = Math.sqrt(this.rf100SqAgg);
        this.oneESD = Math.sqrt(this.oneESqAgg);
        this.harttSD = Math.sqrt(this.harttSqAgg);
      });
  }
}
