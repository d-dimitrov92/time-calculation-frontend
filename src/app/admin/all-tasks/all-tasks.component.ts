import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TasksService } from 'src/app/tasks/tasks.service';

@Component({
  selector: 'app-all-tasks',
  templateUrl: './all-tasks.component.html',
  styleUrls: ['./all-tasks.component.css'],
})
export class AllTasksComponent implements OnInit, OnDestroy {
  private tasksSub: Subscription | undefined;
  isLoading = true;

  taskName = '';
  taskId = '';

  tasks!: any;

  rf100Tasks!: any;
  oneETasks!: any;
  harttTasks!: any;

  rf100Blocks!: [];
  oneEBlocks!: [];
  harttBlocks!: [];

  models = [];

  constructor(private tasksService: TasksService, private router: Router) {}

  ngOnInit(): void {
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
  }

  onEdit(id: string) {
    this.router.navigate([`/admin/edit-task/${id}`]);
  }

  onDelete(id: string) {
    if (confirm('Do you want to delete this task?')) {
      this.tasksService.deleteTask(id);
      console.log('deleted');
      alert('Task is deleted');
      this.router.navigate(['/admin']);
    }
  }

  ngOnDestroy(): void {
    this.tasksSub?.unsubscribe();
  }
}
