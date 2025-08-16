import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-barcomponent',
  standalone: true,
  imports: [FormsModule, ButtonModule, CommonModule],
  templateUrl: './nav-barcomponent.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  isMobileMenuOpen = false;

  constructor(private router: Router) {}

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  routeLogin(): void{

    this.router.navigate(['/login']);


  }




}
