import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'primeng/tree';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { TreeNode } from 'primeng/api';
import { PuestosService } from '../../services/puestos.service';
import { Puesto } from '../../models/puesto.model';
import { LoginService } from '../../../auth/services/login.service';
import { UserRole } from '../../../auth/models/usuario';

@Component({
  selector: 'app-organigrama-view',
  standalone: true,
  imports: [
    CommonModule,
    TreeModule,
    CardModule,
    ButtonModule,
    TooltipModule,
    SkeletonModule
  ],
  templateUrl: './organigrama-view.component.html',
  styleUrls: ['./organigrama-view.component.css']
})
export class OrganigramaViewComponent implements OnInit {
  @Input() readonly: boolean = false;
  @Input() showActions: boolean = true;
  @Output() editPuesto = new EventEmitter<Puesto>();
  @Output() deletePuesto = new EventEmitter<Puesto>();
  @Output() addSubordinado = new EventEmitter<Puesto>();

  organigramaData: TreeNode[] = [];
  selectedNode: TreeNode | null = null;
  selectedPuesto: Puesto | null = null;
  loading: boolean = false;
  expandedNodes: { [key: string]: boolean } = {};
  userRole: UserRole | null = null;

  constructor(
    private puestosService: PuestosService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.userRole = this.loginService.getUserRole();
    this.loadOrganigrama();
  }

  loadOrganigrama(): void {
    this.loading = true;
    this.puestosService.getOrganigrama().subscribe({
      next: (puestos) => {
        this.organigramaData = this.transformToTreeNodes(puestos);
        this.loading = false;
        // Expandir el primer nivel por defecto
        this.expandFirstLevel();
      },
      error: (error) => {
        console.error('Error al cargar organigrama:', error);
        this.loading = false;
      }
    });
  }

  private transformToTreeNodes(puestos: Puesto[]): TreeNode[] {
    const nodeMap = new Map<number, TreeNode>();
    const rootNodes: TreeNode[] = [];

    // Crear nodos para todos los puestos
    puestos.forEach(puesto => {
      const node: TreeNode = {
        key: puesto.id?.toString() || '',
        label: puesto.nombre,
        data: puesto,
        children: [],
        expanded: false,
        type: 'puesto',
        icon: this.getIconForLevel(puesto.nivel_jerarquia),
        styleClass: this.getStyleClassForStatus(puesto.status)
      };
      nodeMap.set(puesto.id!, node);
    });

    // Construir la jerarquía
    puestos.forEach(puesto => {
      const node = nodeMap.get(puesto.id!);
      if (node) {
        if (puesto.puesto_superior_id) {
          const parentNode = nodeMap.get(puesto.puesto_superior_id);
          if (parentNode) {
            parentNode.children!.push(node);
          } else {
            rootNodes.push(node);
          }
        } else {
          rootNodes.push(node);
        }
      }
    });

    // Ordenar nodos por nivel jerárquico y nombre
    this.sortNodes(rootNodes);
    return rootNodes;
  }

  private sortNodes(nodes: TreeNode[]): void {
    nodes.sort((a, b) => {
      const puestoA = a.data as Puesto;
      const puestoB = b.data as Puesto;
      
      // Primero por nivel jerárquico
      if (puestoA.nivel_jerarquia !== puestoB.nivel_jerarquia) {
        return puestoA.nivel_jerarquia - puestoB.nivel_jerarquia;
      }
      
      // Luego por nombre
      return puestoA.nombre.localeCompare(puestoB.nombre);
    });

    // Recursivamente ordenar hijos
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        this.sortNodes(node.children);
      }
    });
  }

  private getIconForLevel(nivel: number): string {
    switch (nivel) {
      case 1: return 'pi pi-crown';
      case 2: return 'pi pi-star';
      case 3: return 'pi pi-users';
      case 4: return 'pi pi-user';
      default: return 'pi pi-circle';
    }
  }

  private getStyleClassForStatus(status: string): string {
    return status === 'activo' ? 'node-active' : 'node-inactive';
  }

  private expandFirstLevel(): void {
    this.organigramaData.forEach(node => {
      node.expanded = true;
      this.expandedNodes[node.key!] = true;
    });
  }

  expandAll(): void {
    this.expandAllNodes(this.organigramaData, true);
  }

  collapseAll(): void {
    this.expandAllNodes(this.organigramaData, false);
    // Mantener el primer nivel expandido
    this.expandFirstLevel();
  }

  private expandAllNodes(nodes: TreeNode[], expanded: boolean): void {
    nodes.forEach(node => {
      node.expanded = expanded;
      this.expandedNodes[node.key!] = expanded;
      if (node.children && node.children.length > 0) {
        this.expandAllNodes(node.children, expanded);
      }
    });
  }

  onNodeSelect(event: any): void {
    this.selectedNode = event.node;
    this.selectedPuesto = event.node.data as Puesto;
  }

  onNodeUnselect(): void {
    this.selectedNode = null;
    this.selectedPuesto = null;
  }

  onNodeExpand(event: any): void {
    this.expandedNodes[event.node.key] = true;
  }

  onNodeCollapse(event: any): void {
    this.expandedNodes[event.node.key] = false;
  }

  onEditPuesto(): void {
    if (this.selectedPuesto) {
      this.editPuesto.emit(this.selectedPuesto);
    }
  }

  onDeletePuesto(): void {
    if (this.selectedPuesto) {
      this.deletePuesto.emit(this.selectedPuesto);
    }
  }

  onAddSubordinado(): void {
    if (this.selectedPuesto) {
      this.addSubordinado.emit(this.selectedPuesto);
    }
  }

  canEdit(): boolean {
    return !this.readonly && this.showActions && 
           (this.userRole === UserRole.Administrador || this.userRole === UserRole.Editor);
  }

  canDelete(): boolean {
    return !this.readonly && this.showActions && this.userRole === UserRole.Administrador;
  }

  canAddSubordinado(): boolean {
    return !this.readonly && this.showActions && 
           (this.userRole === UserRole.Administrador || this.userRole === UserRole.Editor);
  }

  refreshOrganigrama(): void {
    this.loadOrganigrama();
  }

  getSubordinadosCount(puesto: Puesto): number {
    return puesto.subordinados?.length || 0;
  }

  getPuestoSuperiorName(puesto: Puesto): string {
    return puesto.puesto_superior?.nombre || 'Sin superior';
  }

  getStatusLabel(status: string): string {
    return status === 'activo' ? 'Activo' : 'Inactivo';
  }

  getStatusSeverity(status: string): string {
    return status === 'activo' ? 'success' : 'danger';
  }

  getLevelLabel(nivel: number): string {
    const labels: { [key: number]: string } = {
      1: 'Directivo',
      2: 'Gerencial',
      3: 'Supervisión',
      4: 'Operativo',
      5: 'Apoyo'
    };
    return labels[nivel] || `Nivel ${nivel}`;
  }
}