import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NavBarComponent } from '../../../../landing/layouts/components/nav-bar/nav-bar.component';
import { FooterComponent } from '../../../../landing/layouts/components/footer/footer.component';
import { PuestosService } from '../../../organigrama/services/puestos.service';
import { LoginService } from '../../../auth/services/login.service';
import { Puesto, CreatePuestoDto, UpdatePuestoDto } from '../../../organigrama/models/puesto.model';
import { UserRole } from '../../../auth/models/usuario';
import { CustomValidators } from '../../../../core/validators/custom-validators';
import { ValidationService } from '../../../../core/services/validation.service';
import { InputIcon } from "primeng/inputicon";
import { IconField } from "primeng/iconfield";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    InputNumberModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
    CardModule,
    TagModule,
    NavBarComponent,
    FooterComponent,
    InputIcon,
    IconField
],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class DashboardComponent implements OnInit {

  puestos: Puesto[] = [];
  selectedPuesto: Puesto | null = null;
  puestoDialog = false;
  puestoForm!: FormGroup;
  loading = true;
  isEditing = false;
  userRole: string | null = null;
  
  // Opciones para dropdowns
  statusOptions = [
    { label: 'Activo', value: 'activo' },
    { label: 'Inactivo', value: 'inactivo' }
  ];
  
  areaOptions: any[] = [];
  puestosSuperiorOptions: any[] = [];

  constructor(
    private puestosService: PuestosService,
    private loginService: LoginService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private router: Router,
    private validationService: ValidationService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.userRole = this.loginService.getUserRole();
    this.loadPuestos();
    this.loadAreas();
  }

  initForm(): void {
    this.puestoForm = this.fb.group({
      nombre: [
        '', 
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          CustomValidators.nameValidator,
          CustomValidators.noWhitespace
        ]
      ],
      descripcion: [
        '', 
        [
          Validators.maxLength(500),
          CustomValidators.minWords(3)
        ]
      ],
      nivel_jerarquia: [
        1, 
        [
          Validators.required,
          CustomValidators.positiveNumber,
          CustomValidators.numberRange(1, 10)
        ]
      ],
      area_departamento: [
        '', 
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          CustomValidators.nameValidator,
          CustomValidators.noWhitespace
        ]
      ],
      puesto_superior_id: [null],
      status: ['activo', Validators.required]
    });
  }

  loadPuestos(): void {
    this.loading = true;
    this.puestosService.getPuestos().subscribe({
      next: (data) => {
        this.puestos = data;
        this.updatePuestosSuperiorOptions();
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los puestos'
        });
        this.loading = false;
      }
    });
  }

  loadAreas(): void {
    this.puestosService.getAreas().subscribe({
      next: (areas) => {
        this.areaOptions = areas.map(area => ({ label: area, value: area }));
      },
      error: (error) => {
        // Si no existe el endpoint, usar areas predefinidas
        this.areaOptions = [
          { label: 'Dirección General', value: 'Dirección General' },
          { label: 'Recursos Humanos', value: 'Recursos Humanos' },
          { label: 'Finanzas', value: 'Finanzas' },
          { label: 'Tecnología', value: 'Tecnología' },
          { label: 'Ventas', value: 'Ventas' },
          { label: 'Marketing', value: 'Marketing' },
          { label: 'Operaciones', value: 'Operaciones' }
        ];
      }
    });
  }

  updatePuestosSuperiorOptions(): void {
    this.puestosSuperiorOptions = [
      { label: 'Sin puesto superior', value: null },
      ...this.puestos
        .filter(p => p.status === 'activo')
        .map(p => ({ label: p.nombre, value: p.id }))
    ];
  }

  openNew(): void {
    this.selectedPuesto = null;
    this.isEditing = false;
    this.puestoForm.reset();
    this.puestoForm.patchValue({ status: 'activo', nivel_jerarquia: 1 });
    this.puestoDialog = true;
  }

  editPuesto(puesto: Puesto): void {
    this.selectedPuesto = puesto;
    this.isEditing = true;
    this.puestoForm.patchValue({
      nombre: puesto.nombre,
      descripcion: puesto.descripcion,
      nivel_jerarquia: puesto.nivel_jerarquia,
      area_departamento: puesto.area_departamento,
      puesto_superior_id: puesto.puesto_superior_id,
      status: puesto.status
    });
    this.puestoDialog = true;
  }

  deletePuesto(puesto: Puesto): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar el puesto "${puesto.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        try {
          this.puestosService.deletePuesto(puesto.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: `Puesto "${puesto.nombre}" eliminado correctamente`
              });
              this.loadPuestos();
            },
            error: () => {
              // El error ya se maneja en el interceptor
            }
          });
        } catch (error: any) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error de Validación',
            detail: error.message || 'Error al eliminar el puesto'
          });
        }
      }
    });
  }

  savePuesto(): void {
    this.validationService.trimFormValues(this.puestoForm, ['nombre', 'descripcion', 'area_departamento']);
    
    const validation = this.validationService.validateForm(this.puestoForm);
    
    if (!validation.isValid && validation.firstError) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error de Validación',
        detail: validation.firstError.message
      });
      return;
    }

    const formData = this.puestoForm.value;
    
    if (this.isEditing && this.selectedPuesto) {
      const updateData: UpdatePuestoDto = formData;
      this.puestosService.updatePuesto(this.selectedPuesto.id, updateData).subscribe({
        next: (puesto) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Puesto "${puesto.nombre}" actualizado correctamente`
          });
          this.hideDialog();
          this.loadPuestos();
        },
        error: () => {
        }
      });
    } else {
      const createData: CreatePuestoDto = formData;
      this.puestosService.createPuesto(createData).subscribe({
        next: (puesto) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Puesto "${puesto.nombre}" creado correctamente`
          });
          this.hideDialog();
          this.loadPuestos();
        },
        error: () => {
        }
      });
    }
  }

  hideDialog(): void {
    this.puestoDialog = false;
    this.selectedPuesto = null;
    const initialValues = {
      nombre: '',
      descripcion: '',
      nivel_jerarquia: 1,
      area_departamento: '',
      puesto_superior_id: null,
      status: 'activo'
    };
    this.validationService.resetForm(this.puestoForm, initialValues);
  }

  viewOrganigrama(): void {
    this.router.navigate(['/organigrama']);
  }

  canEdit(): boolean {
    return this.userRole === UserRole.Administrador || this.userRole === UserRole.Editor;
  }

  canDelete(): boolean {
    return this.userRole === UserRole.Administrador;
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/landing']);
  }


  
}
