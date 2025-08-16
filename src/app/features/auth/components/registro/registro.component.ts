import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { UserRole } from '../../models/usuario';
import { SelectModule } from 'primeng/select';
import { MensajeService } from '../../../../services/mensaje.service';
import { RegistroRequest } from '../../models/usuario.request';
import { RegistroService } from '../../services/registro.service';

@Component({
  selector: 'app-registrocomponent',
  standalone:true,
  imports: 
  [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule,
    InputTextModule,
    PasswordModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,

  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  estaCargando: boolean = false;

  roles = Object.values(UserRole);
  request: RegistroRequest | null = null;

  private messajeService = inject(MensajeService);
  private router = inject(Router);

  mensajeErroneo$ = this.messajeService.observableError;
  mensajeExitoso$ = this.messajeService.setMensajeExitoso;

  formularioRegistro: FormGroup;

  constructor(private fb: FormBuilder, private registroService:RegistroService){

    this.formularioRegistro = this.fb.group({

      userName: ['',[Validators.required,Validators.maxLength(50)]],
      password: ['',[Validators.required,Validators.minLength(4)]],
      rol: ['']

    })

  }


  validarFormulario(): boolean{

    if(this.formularioRegistro.valid){

      this.request = 
      {

        userName: this.formularioRegistro.get('userName')?.value,
        password: this.formularioRegistro.get('password')?.value,
        rol: this.formularioRegistro.get('rol')?.value

      }

      return true;

    }else{

      this.messajeService.setMensajeErroneo('Formulario Invalido, Verifique que sus datos sean correctos');

      return false;

    }

  }


  registro(): void{

    if(!this.validarFormulario()) return;

    try{

    if(this.request){

      this.estaCargando = true;

      this.registroService.registro(this.request).subscribe({

        next:() =>{

          this.estaCargando = false;

          this.messajeService.setMensajeExitoso('Registro Exitoso');

          setTimeout(() =>{

            this.router.navigate(['/login'])

          },1800)
    
        },

        error:(error) =>{

          this.estaCargando = false;

          this.messajeService.setMensajeErroneo(error);


        }
      })

    }

    }catch(error){

      this.messajeService.setMensajeErroneo(String(error));


    }

    
  }

}
