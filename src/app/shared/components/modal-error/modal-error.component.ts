import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Iconos } from '../../iconos';

@Component({
  selector: 'app-modal-errorcomponent',
  standalone:true,
  imports: 
  [
    FormsModule,
    CommonModule,
    RouterModule

  ],
  templateUrl: './modal-error.component.html',
  styleUrls: ['./modal-error.component.css']
})
export class ModalErrorComponent {

  @Input() mensajeErroneo: string = '';

  public iconos = Iconos;





}
