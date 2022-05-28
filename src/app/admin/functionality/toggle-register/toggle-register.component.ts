import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-toggle-register',
  templateUrl: './toggle-register.component.html',
  styleUrls: ['./toggle-register.component.css'],
})
export class ToggleRegisterComponent implements OnInit {

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {}


  toggleRegister(form: NgForm){
    const result = form.value.optionsRadios;
    this.adminService.toggleRegister(result);
    this.router.navigate(['/admin/functionality/']);
  }
}
