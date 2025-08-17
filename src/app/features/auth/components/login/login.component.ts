import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Iconos } from '../../../../shared/iconos';
import { LoginService } from '../../services/login.service';
import { LoginRequest } from '../../models/usuario.request';
import { MensajeService } from '../../../../services/mensaje.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { Password } from "primeng/password";
import { SpinnerComponent } from "../../../../shared/components/spinner/spinner.component";
import { ModalErrorComponent } from "../../../../shared/components/modal-error/modal-error.component";
import { ModalExitoComponent } from '../../../../shared/components/modal-exito/modal-exito.component';

@Component({
  selector: 'app-logincomponent',
  standalone:true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule,
    ButtonModule,
    InputIconModule,
    InputTextModule,
    IconFieldModule,
    FloatLabelModule,
    MessageModule,
    Password,
    SpinnerComponent,
    ModalErrorComponent,
    ModalExitoComponent,
],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  estaCargando: boolean = false;

  credenciales: LoginRequest | null = null;
  formularioLogin: FormGroup;

  private messajeService = inject(MensajeService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  mensajeExitoso$ = this.messajeService.observableExito;
  mensajeErroneo$ = this.messajeService.observableError;

  public iconos = Iconos;

  constructor(private loginService:LoginService){

    this.formularioLogin = this.fb.group({

      userName: ['',[Validators.required,Validators.maxLength(50)]],
      password: ['',[Validators.required,Validators.minLength(4)]]

    })

  }

  validarFormulario(): boolean{

    if(!this.formularioLogin.valid){

      this.messajeService.setMensajeErroneo('Formulario invalido verifique que todos los campos esten correctos');

      return false;

    }

    this.credenciales =  {...this.formularioLogin.value};

    return true;

  }

  login(): void{

    if(!this.validarFormulario()) return;

    try{

      if(this.credenciales){

        this.estaCargando = true;

        this.loginService.login(this.credenciales).subscribe({

          next:() =>{

            this.estaCargando = false;

            this.messajeService.setMensajeExitoso('Login Exitoso...');

            setTimeout(() =>{

              this.router.navigate(['/dashboard']);


            },1500)

          },

          error:(error) =>{

            this.estaCargando = false;

            this.messajeService.setMensajeErroneo(error.error?.message || 'Internal Server Error');


          }

        })

      }

    }catch(error){

      this.messajeService.setMensajeErroneo(String(error));

    }

  }

}
