import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button';
import { NavBarComponent } from '../../layouts/components/nav-bar/nav-bar.component';
import { FooterComponent } from "../../layouts/components/footer/footer.component";

@Component({
  selector: 'app-landing-pague.component',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    NavBarComponent,
    FooterComponent
],
  templateUrl: './landing-pague.component.html',
  styleUrls: ['./landing-pague.component.css']
})
export class LandingPagueComponent {









}
