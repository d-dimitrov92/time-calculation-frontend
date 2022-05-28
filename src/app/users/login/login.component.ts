import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  isFormValid!: boolean;
  hiddenClass = '';
  errorMessage = '';

  authStatusSub!: Subscription;
  errorStatusSub!: Subscription;

  constructor(public usersService: UsersService) {}

  ngOnInit(): void {
    if (this.isFormValid == undefined) {
      this.hiddenClass = 'classHidden';
    }
    this.authStatusSub = this.usersService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  onLogin(formData: NgForm) {
    if (formData.invalid) {
      this.isFormValid = false;
      this.hiddenClass = '';
      setTimeout(() => {
        this.hiddenClass = 'classHidden';
      }, 3800);
      return;
    }

    this.isLoading = true;

    this.isFormValid = true;
    this.hiddenClass = '';

    this.usersService.login(formData.value.username, formData.value.password);

    this.errorStatusSub = this.usersService
      .getErrorStatusListener()
      .subscribe((errorStatus: any) => {
        this.errorMessage = errorStatus.error.message;

        console.log('***');
        console.log(this.errorMessage);
      });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
