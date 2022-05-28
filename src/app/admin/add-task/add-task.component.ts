import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TasksService } from 'src/app/tasks/tasks.service';

@Component({
  selector: 'app-give-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})
export class AddTaskComponent implements OnInit {
  hiddenClass = '';
  isFormValid!: boolean;

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    if(this.isFormValid == undefined) {
      this.hiddenClass = 'classHidden';
    }
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

    this.tasksService.addTask(form.value);

    form.reset();
    this.isFormValid = true;
    this.hiddenClass = '';
    setTimeout(() => {
      this.hiddenClass = 'classHidden';
    }, 3800);
  }
}
