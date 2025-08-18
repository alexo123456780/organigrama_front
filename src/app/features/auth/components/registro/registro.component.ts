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
import { NotificationService } from '../../../../core/services/notification.service';
import { RegistroRequest } from '../../models/usuario.request';
import { RegistroService } from '../../services/registro.service';
import { ValidationService } from '../../../../core/services/validation.service';
import { CustomValidators } from '../../../../core/validators/custom-validators';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { ModalErrorComponent } from '../../../../shared/components/modal-error/modal-error.component';
import { ModalExitoComponent } from '../../../../shared/components/modal-exito/modal-exito.component';

@Component({
  selector: 'app-registrocomponent',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule,
    InputTextModule,
    PasswordModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    FloatLabelModule,
    MessageModule,
    ButtonModule,
    SpinnerComponent,
    ModalErrorComponent,
    ModalExitoComponent
  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  estaCargando: boolean = false;

  roles = Object.values(UserRole);
  request: RegistroRequest | null = null;

  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private validationService = inject(ValidationService);

  mensajeErroneo$ = this.notificationService.observableError;
  mensajeExitoso$ = this.notificationService.observableExito;

  formularioRegistro: FormGroup;

  constructor(private fb: FormBuilder, private registroService: RegistroService) {
    this.formularioRegistro = this.fb.group({
      userName: [
        '', 
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(3),
          CustomValidators.username,
          CustomValidators.noWhitespace
        ]
      ],
      password: [
        '', 
        [
          Validators.required,
          Validators.minLength(6),
          CustomValidators.noWhitespace
        ]
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          CustomValidators.confirmPassword('password')
        ]
      ],
      rol: ['', Validators.required]
    });
  }


  validarFormulario(): boolean {
    const validation = this.validationService.validateForm(this.formularioRegistro);
    
    if (!validation.isValid && validation.firstError) {
      this.notificationService.error(validation.firstError.message);
      return false;
    }
    
    if (this.formularioRegistro.valid) {
      this.request = {
        userName: this.formularioRegistro.get('userName')?.value,
        password: this.formularioRegistro.get('password')?.value,
        rol: this.formularioRegistro.get('rol')?.value
      };
      return true;
    }
    
    return false;
  }


  registro(): void {
    // Limpiar espacios en blanco
    this.validationService.trimFormValues(this.formularioRegistro, ['userName', 'password', 'confirmPassword']);
    
    if (!this.validarFormulario()) return;

    if (this.request) {
      this.estaCargando = true;

      this.registroService.registro(this.request).subscribe({
        next: () => {
          this.estaCargando = false;
          this.notificationService.success(
            `¡Registro exitoso! Usuario ${this.request?.userName} creado correctamente`
          );
          
          // Resetear formulario usando el servicio de validación
          this.validationService.resetForm(this.formularioRegistro);
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: () => {
          // El error ya se maneja en el interceptor
          this.estaCargando = false;
        }
      });
    }
  }

}
