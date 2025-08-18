import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { PuestosService } from '../../services/puestos.service';
import { NavBarComponent } from '../../../../landing/layouts/components/nav-bar/nav-bar.component';
import { FooterComponent } from '../../../../landing/layouts/components/footer/footer.component';

@Component({
  selector: 'app-demo-view',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TreeModule,
    NavBarComponent,
    FooterComponent
  ],
  templateUrl: './demo-view.component.html',
  styleUrls: ['./demo-view.component.css']
})
export class DemoViewComponent implements OnInit {

  organigramaData: TreeNode[] = [];
  loading = true;
  selectedNode: TreeNode | null = null;

  constructor(private puestosService: PuestosService) {}

  ngOnInit(): void {
    this.loadOrganigrama();
  }

  loadOrganigrama(): void {
    this.loading = true;
    this.puestosService.getOrganigrama().subscribe({
      next: (data) => {
        this.organigramaData = this.transformToTreeNodes(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar organigrama:', error);
        this.loading = false;
      }
    });
  }

  private transformToTreeNodes(puestos: any[]): TreeNode[] {
    const nodeMap = new Map<number, TreeNode>();
    const rootNodes: TreeNode[] = [];

    // Crear nodos
    puestos.forEach(puesto => {
      const node: TreeNode = {
        key: puesto.id.toString(),
        label: puesto.nombre,
        data: puesto,
        children: [],
        expanded: true,
        icon: 'pi pi-briefcase'
      };
      nodeMap.set(puesto.id, node);
    });

    // Construir jerarquía
    puestos.forEach(puesto => {
      const node = nodeMap.get(puesto.id);
      if (puesto.puesto_superior_id && nodeMap.has(puesto.puesto_superior_id)) {
        const parentNode = nodeMap.get(puesto.puesto_superior_id);
        parentNode?.children?.push(node!);
      } else {
        rootNodes.push(node!);
      }
    });

    return rootNodes;
  }

  onNodeSelect(event: any): void {
    this.selectedNode = event.node;
  }

  expandAll(): void {
    this.expandRecursive(this.organigramaData, true);
  }

  collapseAll(): void {
    this.expandRecursive(this.organigramaData, false);
  }

  private expandRecursive(nodes: TreeNode[], isExpand: boolean): void {
    nodes.forEach(node => {
      node.expanded = isExpand;
      if (node.children && node.children.length) {
        this.expandRecursive(node.children, isExpand);
      }
    });
  }
}