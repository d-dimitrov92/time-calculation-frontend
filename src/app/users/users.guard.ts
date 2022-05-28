import { Injectable, OnDestroy } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AdminService } from "../admin/admin.service";

import { UsersService } from "./users.service";

@Injectable()
export class UsersGuard implements CanActivate {

  constructor(private usersService: UsersService, private adminService: AdminService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    const isAuth = this.usersService.getIsAuth();

    if (isAuth) {
      this.router.navigate(['/']);
    }

    return !isAuth;
  }
}
