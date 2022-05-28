import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TasksService } from 'src/app/tasks/tasks.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css'],
})
export class EditTaskComponent implements OnInit, OnDestroy {
  hiddenClass = '';
  isFormValid!: boolean;

  task!: any;
  taskId!: string;

  taskSub!: Subscription;

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if(this.isFormValid == undefined) {
      this.hiddenClass = 'classHidden';
    }

    this.taskId = this.route.snapshot.params.id;
    this.tasksService.getTask(this.taskId);

    this.taskSub = this.tasksService
      .getOneTaskUpdatedListener()
      .subscribe((result: any) => {
        this.task = result;
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

    //console.log(form.value);
    this.tasksService.updateTask(this.task._id, form.value);

    form.reset();
    this.isFormValid = true;
    this.hiddenClass = '';
    setTimeout(() => {
      this.hiddenClass = 'classHidden';
    }, 3800);
    this.router.navigate(['/admin/all-tasks'])
  }

  ngOnDestroy(): void {
    this.taskSub.unsubscribe();
  }
}
