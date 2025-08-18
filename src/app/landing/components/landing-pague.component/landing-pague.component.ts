import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NavBarComponent } from '../../layouts/components/nav-bar/nav-bar.component';
import { FooterComponent } from "../../layouts/components/footer/footer.component";
import { LoginService } from '../../../features/auth/services/login.service';
import { UserRole } from '../../../features/auth/models/usuario';

@Component({
  selector: 'app-landing-pague.component',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    NavBarComponent,
    FooterComponent
],
  templateUrl: './landing-pague.component.html',
  styleUrls: ['./landing-pague.component.css'],
  providers: [MessageService]
})
export class LandingPagueComponent {

  constructor(
    private router: Router,
    private loginService: LoginService,
    private messageService: MessageService
  ) {}

  onDemoClick(): void {
    // Verificar si el usuario está logueado
    if (this.loginService.isLoggedIn()) {
      const userRole = this.loginService.getUserRole();
      
      // Redirigir según el rol del usuario
      switch (userRole) {
        case UserRole.Viewer:
          this.router.navigate(['/demo']);
          break;
        case UserRole.Administrador:
        case UserRole.Editor:
          this.router.navigate(['/dashboard']);
          break;
        default:
          this.router.navigate(['/login']);
          break;
      }
    } else {
      // Si no está logueado, mostrar mensaje y redirigir al login
      this.messageService.add({
        severity: 'info',
        summary: 'Acceso Requerido',
        detail: 'Debes iniciar sesión para acceder al demo'
      });
      
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }
  }

}
