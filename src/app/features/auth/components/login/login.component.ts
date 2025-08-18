import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Iconos } from '../../../../shared/iconos';
import { LoginService } from '../../services/login.service';
import { LoginRequest } from '../../models/usuario.request';
import { NotificationService } from '../../../../core/services/notification.service';
import { UserRole } from '../../models/usuario';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from "primeng/password";
import { SpinnerComponent } from "../../../../shared/components/spinner/spinner.component";

import { ValidationService } from '../../../../core/services/validation.service';
import { CustomValidators } from '../../../../core/validators/custom-validators';

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
    PasswordModule,
    SpinnerComponent,
    ToastModule,
],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  estaCargando: boolean = false;

  credenciales: LoginRequest | null = null;
  formularioLogin: FormGroup;

  private notificationService = inject(NotificationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private validationService = inject(ValidationService);

  mensajeExitoso$ = this.notificationService.observableExito;
   mensajeErroneo$ = this.notificationService.observableError;

  public iconos = Iconos;

  constructor(private loginService:LoginService){
    this.formularioLogin = this.fb.group({
      userName: [
        '', 
        [
          Validators.required,
          Validators.maxLength(50),
          CustomValidators.username,
          CustomValidators.noWhitespace
        ]
      ],
      password: [
        '', 
        [
          Validators.required,
          Validators.minLength(4),
          CustomValidators.noWhitespace
        ]
      ]
    });
  }

  validarFormulario(): boolean {
    const validation = this.validationService.validateForm(this.formularioLogin);
    
    if (!validation.isValid && validation.firstError) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: validation.firstError.message,
        life: 4000
      });
      return false;
    }
    
    this.credenciales = { ...this.formularioLogin.value };
    return true;
  }

  login(): void {
    this.validationService.trimFormValues(this.formularioLogin, ['userName', 'password']);
    
    if (!this.validarFormulario()) return;

    if (this.credenciales) {
      this.estaCargando = true;

      this.loginService.login(this.credenciales).subscribe({
        next: () => {
          this.estaCargando = false;
          
          // Obtener el rol del usuario después del login exitoso
          const userRole = this.loginService.getUserRole();
          const userName = this.loginService.getUserName();
          
          this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: `¡Bienvenido ${userName}! Accediendo como ${userRole}...`,
            life: 3000
          });

          setTimeout(() => {
            this.redirectBasedOnRole(userRole);
          }, 1500);
        },
        error: (error) => {
          this.estaCargando = false;
          
          let errorMessage = 'Error al iniciar sesión. Intenta nuevamente.';
          
          // Manejar errores específicos de login
          if (error.status === 401) {
            errorMessage = 'Credenciales inválidas. Verifica tu usuario y contraseña.';
          } else if (error.status === 422) {
            errorMessage = 'Datos de login no válidos.';
          } else if (error.status === 0) {
            errorMessage = 'Sin conexión al servidor. Verifica tu conexión a internet.';
          }
          
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
          });
        }
      });
    }
  }

  private redirectBasedOnRole(userRole: string | null): void {
    switch (userRole) {
      case 'admin':
      case 'editor':
        this.router.navigate(['/dashboard']);
        break;
      case 'view':
        this.router.navigate(['/demo']);
        break;
      default:
        this.router.navigate(['/landing']);
        break;
    }
  }

}
