import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { UsersRoutingModule } from './users-routing.module';
import { UsersService } from './users.service';

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    FormsModule,
    UsersRoutingModule,
    MatProgressSpinnerModule,
  ],
  providers: [UsersService]
})
export class UsersModule {}
