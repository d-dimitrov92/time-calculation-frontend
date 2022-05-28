import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserData } from 'src/app/shared/user-data.model';
import { UsersService } from 'src/app/users/users.service';

@Component({
  selector: 'app-admin-status',
  templateUrl: './admin-status.component.html',
  styleUrls: ['./admin-status.component.css'],
})
export class AdminStatusComponent implements OnInit {
  private usersSub!: Subscription | undefined;
  isChecked: any;

  allUsers!: UserData[];

  constructor(private usersService: UsersService, private router: Router) {
    this.isChecked = true;
  }

  ngOnInit(): void {
    this.usersService.getAllUsers();
    this.usersSub = this.usersService.getUsersListener().subscribe((users: any) => {
      this.allUsers = users;
    });
  }

  onChangeAdminStatus(form: NgForm, userId: string) {
    const result = form.value;
    console.log(result);

    this.usersService.changeAdminStatus(result, userId);
    this.router.navigate(['/admin/functionality/']);
  }
}
