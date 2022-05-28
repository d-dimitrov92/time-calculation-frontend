import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  registerStatus = false;
  private registerStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  toggleRegister(state: any) {
    const regState = { isRegisterOn: state };

    this.http.put(API_URL + '/tools/registerToggling', regState).subscribe();

    this.registerStatus = state;
    window.location.reload();
  }

  getRegisterStatus() {
    return this.registerStatus;
  }

  getRegisterStatusListener() {
    this.http.get(API_URL + '/tools/registerToggling').subscribe((result) => {
      if (result == true) {
        this.registerStatus = true;
        this.registerStatusListener.next(true);
      } else {
        this.registerStatus = false;
        this.registerStatusListener.next(false);
      }
    });
    return this.registerStatusListener.asObservable();
  }

}
