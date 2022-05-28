import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserData } from '../shared/user-data.model';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private isAuthenticated = false;
  private isAdmin = false;
  private token!: string | null;
  private tokenTimer!: any;
  private userId!: string | null;
  private allUsers!: UserData[];
  private allWorkers!: UserData[];
  private username!: string | null;
  private fullName!: string | null;
  private userTasks!: [] | null;
  private user!: UserData;
  private isWorking = false;

  private authStatusListener = new Subject<boolean>();
  private adminStatusListener = new Subject<boolean>();
  private usernameStatusListener = new Subject<string | null>();
  private fullNameStatusListener = new Subject<string | null>();
  private workersListener = new Subject();
  private usersListener = new Subject();
  private userListener = new Subject();

  private errorStatusListener = new Subject();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getIsAdmin() {
    return this.isAdmin;
  }

  getUserIsWorking() {
    return this.isWorking;
  }

  getUsername() {
    return this.username;
  }

  getFullName() {
    return this.fullName;
  }

  getUserId() {
    return this.userId;
  }

  getUsersListener() {
    return this.usersListener.asObservable();
  }

  getUserListener() {
    return this.userListener.asObservable();
  }

  getWorkersListener() {
    return this.workersListener.asObservable();
  }

  getUserFullNameListener() {
    return this.fullNameStatusListener.asObservable();
  }

  getAdminStatusListener() {
    return this.adminStatusListener.asObservable();
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUsernameStatusListener() {
    return this.usernameStatusListener.asObservable();
  }

  getErrorStatusListener() {
    return this.errorStatusListener.asObservable();
  }

  createUser(username: string, name: string, password: string) {
    const userData: UserData = {
      username: username.trim().toLowerCase(),
      fullName: name.trim(),
      password: password,
    };
    return this.http.post(`${API_URL}/user/register`, userData).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(username: string, password: string) {
    const userData: UserData = { username: username.trim().toLowerCase(), password: password };
    this.http
      .post<{
        token: string;
        expiresIn: number;
        userId: string;
        username: string;
        fullName: string;
        role: string;
      }>(`${API_URL}/user/login`, userData)
      .subscribe(
        (response) => {

          const role = response.role;
          const token = response.token;
          const username = response.username;
          const fullName = response.fullName;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            if (role == 'admin') {
              this.isAdmin = true;
              this.adminStatusListener.next(true);
            }
            this.userId = response.userId;
            this.authStatusListener.next(true);
            this.usernameStatusListener.next(username);
            this.fullNameStatusListener.next(fullName);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );

            this.saveUserData(
              token,
              expirationDate,
              this.userId,
              username,
              fullName,
              role
            );

            this.router.navigate(['/']);
          }
        },
        (error) => {
          //console.log(error.error.message);
          this.errorStatusListener.next(error)

          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getUserData();

    if (!authInformation) return;

    if (authInformation.role === 'admin') {
      this.isAdmin = true;
      this.adminStatusListener.next(true);
    }
    const now = new Date();
    const expiresIn = authInformation!.expirationDate.getTime() - now.getTime();
    console.log((expiresIn / 1000 / 60 / 60).toFixed(2) + ' hours');

    if (expiresIn > 0) {
      this.token = authInformation!.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.username = authInformation.username;
      this.fullName = authInformation.fullName;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.usernameStatusListener.next(authInformation.username);
      this.fullNameStatusListener.next(authInformation.fullName);

      console.log(authInformation.fullName);
    } else this.logout();
  }

  // getUserTasks(userDataId: string) {
  //   this.http.get(API_URL + '/user/tasks/' + userDataId).subscribe( result => {
  //     console.log(result);
  //   });
  // }

  getUser(id: string) {
    this.http.get(`${API_URL}/user/${id}`).subscribe((result: any) => {
      this.user = result;

      this.userListener.next(this.user);
      if (this.user.activeTask) {
        this.isWorking = true;
      } else {
        this.isWorking = false;
      }
    });
  }

  getAllUsers() {
    this.http.get<UserData[]>(`${API_URL}/user/users`).subscribe((data) => {
      this.allUsers = data;

      this.usersListener.next([...this.allUsers]);
    });
  }

  getAllWorkers() {
    this.http.get<UserData[]>(`${API_URL}/user/users`).subscribe((data) => {
      this.allUsers = data;
      this.allWorkers = this.allUsers.filter((user) => user.isWorker == true);

      this.workersListener.next([...this.allWorkers]);
    });
  }

  changeWorkerStatus(data: any, userId: string) {
    const userData = {
      _id: userId,
      isWorker: data.workerStatus,
    };

    this.http
      .patch(`${API_URL}/tools/workerStatusToggling`, userData)
      .subscribe((result: any) => {
        console.log('-----');
        console.log(result.message);
        console.log('-----');
      });
  }

  changeAdminStatus(data: any, userId: string) {
    console.log(data);
    console.log(userId);

    const userData = {
      _id: userId,
      role: data.adminStatus,
    };

    this.http
      .patch(`${API_URL}/tools/adminStatusToggling`, userData)
      .subscribe((result: any) => {
        console.log('-----');
        console.log(result.message);
        console.log('-----');
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.fullName = null;
    this.authStatusListener.next(false);
    this.adminStatusListener.next(false);
    this.usernameStatusListener.next(null);
    this.fullNameStatusListener.next(null);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearUserData();

    this.router.navigate(['/login']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveUserData(
    token: string,
    expirationDate: Date,
    userId: string,
    username: string,
    fullName: string,
    role: string
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    localStorage.setItem('fullName', fullName);
    localStorage.setItem('role', role);
  }

  private clearUserData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');
  }

  private getUserData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const fullName = localStorage.getItem('fullName');
    const userRole = localStorage.getItem('role');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      username: username,
      fullName: fullName,
      role: userRole,
    };
  }
}
