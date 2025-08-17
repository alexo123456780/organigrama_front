import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Iconos } from '../../iconos';

@Component({
  selector: 'app-modal-exitocomponent',
  standalone:true,
  imports: 
  [
    FormsModule,
    CommonModule,
    RouterModule

  ],
  templateUrl: './modal-exito.component.html',
  styleUrls: ['./modal-exito.component.css']
})
export class ModalExitoComponent {

  @Input() mensajeExitoso: string = '';

  public iconos = Iconos;



}
