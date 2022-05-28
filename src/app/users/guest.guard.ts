import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

import { UsersService } from "./users.service";

@Injectable()
export class GuestGuard implements CanActivate {

  constructor(private usersService: UsersService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isAuth = this.usersService.getIsAuth();

    if (!isAuth) {
      this.router.navigate(['/login']);
    }

    return isAuth;
  }
}
