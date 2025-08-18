import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from '../../features/auth/services/login.service';
import { UserRole } from '../../features/auth/models/usuario';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    
    if (!this.loginService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const userRole = this.loginService.getUserRole();
    const allowedRoles = route.data['allowedRoles'] as UserRole[];

    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    if (allowedRoles.includes(userRole as UserRole)) {
      return true;
    }

    // Redireccionar según el rol del usuario
    this.redirectBasedOnRole(userRole);
    return false;
  }

  private redirectBasedOnRole(userRole: string | null): void {
    switch (userRole) {
      case UserRole.Administrador:
      case UserRole.Editor:
        this.router.navigate(['/dashboard']);
        break;
      case UserRole.Viewer:
        this.router.navigate(['/demo']);
        break;
      default:
        this.router.navigate(['/landing']);
        break;
    }
  }
}