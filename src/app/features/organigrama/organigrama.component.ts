import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { NavBarComponent } from '../../landing/layouts/components/nav-bar/nav-bar.component';
import { FooterComponent } from '../../landing/layouts/components/footer/footer.component';
import { OrganigramaViewComponent } from './components/organigrama-view/organigrama-view.component';
import { PuestosService } from './services/puestos.service';
import { LoginService } from '../auth/services/login.service';
import { Puesto } from './models/puesto.model';
import { UserRole } from '../auth/models/usuario';

@Component({
  selector: 'app-organigrama',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    ConfirmDialogModule,
    ButtonModule,
    NavBarComponent,
    FooterComponent,
    OrganigramaViewComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './organigrama.component.html',
  styleUrls: ['./organigrama.component.css']
})
export class OrganigramaComponent implements OnInit {
  userRole: UserRole | null = null;
  isReadonly: boolean = false;
  UserRole = UserRole; // Para usar en el template

  constructor(
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private puestosService: PuestosService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.userRole = this.loginService.getUserRole();
    this.isReadonly = this.userRole === UserRole.Viewer;
  }

  onEditPuesto(puesto: Puesto): void {
    // Redirigir al dashboard con el ID del puesto para editar
    this.router.navigate(['/dashboard'], { 
      queryParams: { editPuesto: puesto.id } 
    });
  }

  onDeletePuesto(puesto: Puesto): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar el puesto "${puesto.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.deletePuesto(puesto);
      }
    });
  }

  onAddSubordinado(puesto: Puesto): void {
    // Redirigir al dashboard para crear un nuevo puesto subordinado
    this.router.navigate(['/dashboard'], { 
      queryParams: { 
        newSubordinado: true, 
        puestoSuperiorId: puesto.id 
      } 
    });
  }

  private deletePuesto(puesto: Puesto): void {
    if (!puesto.id) return;

    this.puestosService.deletePuesto(puesto.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `El puesto "${puesto.nombre}" ha sido eliminado correctamente`
        });
        // El componente organigrama-view se actualizará automáticamente
      },
      error: (error) => {
        console.error('Error al eliminar puesto:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el puesto. Inténtalo de nuevo.'
        });
      }
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/landing']);
  }
}