import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
import { GivenTask } from '../shared/given-task.model';
import { UsersService } from '../users/users.service';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  tasks!: any;
  givenTasks!: any;
  task!: any;
  givenTask!: any;

  private tasksUpdated = new Subject();
  private givenTasksUpdated = new Subject();
  private getOneTaskUpdated = new Subject();

  private getTasksByStatusUpdated = new Subject();
  private getGivenTaskUpdated = new Subject();
  private getActiveGivenTasksUpdated = new Subject();

  constructor(private http: HttpClient, private usersService: UsersService) {}

  getAllTasks() {
    this.http.get<any>(`${API_URL}/tasks`).subscribe((data) => {
      this.tasks = data;
      this.tasksUpdated.next(this.tasks);
    });
  }

  getTaskUpdateListener() {
    return this.tasksUpdated.asObservable();
  }

  addTask(data: Task) {
    console.log(data);

    this.http.post<Task>(`${API_URL}/tasks`, data).subscribe(
      (result) => {
        console.log(result);
      },
      (err) => {
        console.log(err.error.message);
      }
    );
    console.log('task added');
  }

  getTask(id: string) {
    this.http.get(`${API_URL}/tasks/${id}`).subscribe((result: any) => {
      this.task = result.task;
      this.getOneTaskUpdated.next(this.task);
    });
  }

  updateTask(id: string, data: any) {
    this.http.put(`${API_URL}/tasks/${id}`, data).subscribe();
  }

  deleteTask(id: string) {
    this.http.delete(`${API_URL}/tasks/${id}`).subscribe();
  }

  getOneTaskUpdatedListener() {
    return this.getOneTaskUpdated.asObservable();
  }

  giveTask(data: any) {
    this.http.post(`${API_URL}/givenTasks`, data).subscribe((result: any) => {
      console.log(result.message);
    });
  }

  getActiveGivenTasks() {
    this.http.get(`${API_URL}/givenTasks/active`).subscribe((result: any) => {
      this.getActiveGivenTasksUpdated.next(result);
    });
  }

  getActiveGivenTasksListener() {
    return this.getActiveGivenTasksUpdated.asObservable();
  }

  getGivenTasksByUser() {
    const userId = this.usersService.getUserId();
    this.http
      .get<GivenTask[]>(`${API_URL}/givenTasks/byUser/${userId}`)
      .subscribe((result) => {
        this.givenTasks = result;
        this.givenTasksUpdated.next(this.givenTasks);
      });
  }

  getGivenTasksByUserUpdateListener() {
    return this.givenTasksUpdated.asObservable();
  }

  getGivenTask(id: string) {
    this.http.get(`${API_URL}/givenTasks/${id}`).subscribe((result) => {
      this.getGivenTaskUpdated.next(result);
    });
  }

  updateGivenTask(id: string, data: any) {
    this.http.patch(`${API_URL}/givenTasks/${id}`, {data}).subscribe( result => {
      console.log(result);
    });
  }

  getGivenTaskListener() {
    return this.getGivenTaskUpdated.asObservable();
  }

  deleteGivenTask(id: any) {
    this.http.delete(`${API_URL}/givenTasks/${id}`).subscribe();
  }

  startTask(taskId: string) {
    this.http
      .post(`${API_URL}/givenTasks/startTask/${taskId}`, {
        started: Date.now(),
      })
      .subscribe((result: any) => {
        console.log(result.message);
      });
  }

  pauseTask(taskId: string, str?: string) {
    this.http
      .post(`${API_URL}/givenTasks/pauseTask/${taskId}`, { paused: Date.now(), state: str })
      .subscribe((result: any) => {
        console.log(result.message);
      });
  }

  stopTask(taskId: string) {
    this.http
      .post(`${API_URL}/givenTasks/stopTask/${taskId}`, { stopped: Date.now() })
      .subscribe((result) => {
        console.log(result);
      });
  }

  getTasksByStatus(status: string) {
    this.http
      .get(`${API_URL}/givenTasks/get-by-status/${status}`)
      .subscribe((result) => {
        this.getTasksByStatusUpdated.next(result);
      });
  }

  getTasksByStatusListener() {
    return this.getTasksByStatusUpdated.asObservable();
  }

  approvingTask(status: string, id: string) {
    this.http
      .patch(`${API_URL}/givenTasks/approving-task/${status}/${id}`, {
        status: status,
      })
      .subscribe((result) => {
        console.log(result);
      });
  }
}
