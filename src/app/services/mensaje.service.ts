import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  exitoSubject = new BehaviorSubject<string>('');
  errorSubject = new BehaviorSubject<string>('');

  observableExito = this.exitoSubject.asObservable();
  observableError = this.errorSubject.asObservable();

  constructor(){}


  setMensajeExitoso(mensaje:string): void{

    this.exitoSubject.next(mensaje);

    setTimeout(() =>{

      this.exitoSubject.next('');

    },1800)

  }


  setMensajeErroneo(mensaje:string): void{

    this.errorSubject.next(mensaje);

    setTimeout(() =>{

      this.errorSubject.next('');


    },1800)


  }
  
}
