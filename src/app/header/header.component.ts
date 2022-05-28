import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../admin/admin.service';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuth = false;
  isAdmin = false;
  username!: string | null;
  fullName!: string | null;
  isRegisterOn!: boolean;
  private authListenerSub!: Subscription;
  private adminListenerSub!: Subscription;
  private usernameListenerSub!: Subscription;
  private registerListenerSub!: Subscription;
  private fullNameListenerSub!: Subscription;

  constructor(
    private usersService: UsersService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.userIsAuth = this.usersService.getIsAuth();
    this.isAdmin = this.usersService.getIsAdmin();
    this.username = this.usersService.getUsername();
    this.fullName = this.usersService.getFullName();


    this.registerListenerSub = this.adminService
      .getRegisterStatusListener()
      .subscribe((isRegOn) => {
        this.isRegisterOn = isRegOn;
      });

    this.authListenerSub = this.usersService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuth = isAuthenticated;
      });

    this.fullNameListenerSub = this.usersService
      .getUserFullNameListener()
      .subscribe((fullName) => {
        this.fullName = fullName;
      });

    this.adminListenerSub = this.usersService
      .getAdminStatusListener()
      .subscribe((isAdminFromService) => {
        this.isAdmin = isAdminFromService;
      });

    this.usernameListenerSub = this.usersService
      .getUsernameStatusListener()
      .subscribe((username) => {
        this.username = username;
      });
  }

  onLogout() {
    this.usersService.logout();
    console.log('Logout successful.');
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
    this.adminListenerSub.unsubscribe();
    this.usernameListenerSub.unsubscribe();
    this.registerListenerSub.unsubscribe();
    this.fullNameListenerSub.unsubscribe();
  }
}
