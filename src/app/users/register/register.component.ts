import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UsersService } from '../users.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub!: Subscription;

  constructor(public userService: UsersService) {}

  ngOnInit(): void {
    this.authStatusSub = this.userService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  onRegister(form: NgForm) {
    if (form.invalid || form.value.rePassword != form.value.password) return;
    this.isLoading = true;
    const username = form.value.username.trim().toLowerCase();
    const fullName = form.value.fullName.trim();
    const password = form.value.password;

    this.userService.createUser(username, fullName, password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
