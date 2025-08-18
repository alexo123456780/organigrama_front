import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [FormsModule, ButtonModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  isMobileMenuOpen = false;
  showLoginButton = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Verificar la ruta inicial
    this.checkCurrentRoute();
    
    // Escuchar cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkCurrentRoute();
      });
  }

  private checkCurrentRoute(): void {
    const currentUrl = this.router.url;
    // Ocultar botón de login en dashboard y organigrama
    this.showLoginButton = !currentUrl.includes('/dashboard') && !currentUrl.includes('/organigrama');
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  routeLogin(): void {
    this.router.navigate(['/login']);
  }




}
