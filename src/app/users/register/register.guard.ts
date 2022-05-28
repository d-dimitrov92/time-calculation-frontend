import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

import { AdminService } from "src/app/admin/admin.service";


@Injectable()
export class RegisterGuard implements CanActivate {
  constructor(private adminService: AdminService, private router: Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isRegisterOn = this.adminService.getRegisterStatus();

    if (!isRegisterOn) {
      this.router.navigate(['/']);
    }

    return isRegisterOn;
  }

}
