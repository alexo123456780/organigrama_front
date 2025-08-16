import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-spinnercomponent',
  standalone:true,
  imports: 
  [
    FormsModule,
    CommonModule,
    RouterModule,
    ProgressSpinnerModule

  ],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {


  @Input() estaCargando: boolean = false;

  






}
