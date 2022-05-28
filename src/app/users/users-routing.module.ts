import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegisterGuard } from './register/register.guard';
import { UsersGuard } from './users.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [UsersGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [UsersGuard, RegisterGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [UsersGuard, RegisterGuard],
})
export class UsersRoutingModule {}
