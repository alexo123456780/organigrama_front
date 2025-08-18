import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Puesto } from '../../models/puesto.model';
import * as d3 from 'd3';

interface HierarchyNode {
  id: number;
  nombre: string;
  nivel_jerarquia: number;
  area_departamento: string;
  status: 'activo' | 'inactivo';
  puesto_superior_id?: number;
  children?: HierarchyNode[];
  _children?: HierarchyNode[];
  x?: number;
  y?: number;
  x0?: number;
  y0?: number;
}

@Component({
  selector: 'app-organigrama-chart',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './organigrama-chart.component.html',
  styleUrls: ['./organigrama-chart.component.css']
})
export class OrganigramaChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() data: Puesto[] = [];
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  private svg: any;
  private g: any;
  private tree: any;
  private root: any;
  private zoom: any;
  private tooltip: any;
  private nodeIdCounter = 0;
  
  // Configuración del chart
  private readonly nodeWidth = 220;
  private readonly nodeHeight = 90;
  private readonly margin = { top: 50, right: 50, bottom: 50, left: 50 };
  private width = 800;
  private height = 600;

  constructor() { }

  ngOnInit(): void {
    this.initializeChart();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.data && this.data.length > 0) {
        this.updateChart();
      }
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    if (this.tooltip) {
      this.tooltip.remove();
    }
  }

  private initializeChart(): void {
    const container = this.chartContainer.nativeElement;
    
    // Limpiar contenido previo
    d3.select(container).selectAll('*').remove();
    
    const rect = container.getBoundingClientRect();
    this.width = Math.max(800, rect.width - this.margin.left - this.margin.right);
    this.height = Math.max(600, rect.height - this.margin.top - this.margin.bottom);

    // Crear SVG
    this.svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${rect.width} ${rect.height}`)
      .style('background', '#fafbfc');

    // Configurar zoom
    this.zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        this.g.attr('transform', event.transform);
      });

    this.svg.call(this.zoom);

    // Grupo principal
    this.g = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // Configurar tree layout
    this.tree = d3.tree()
      .size([this.height, this.width])
      .nodeSize([this.nodeHeight + 50, this.nodeWidth + 80]);

    // Crear tooltip
    this.createTooltip();
  }

  private createTooltip(): void {
    this.tooltip = d3.select('body')
      .append('div')
      .attr('class', 'organigrama-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(17, 24, 39, 0.95)')
      .style('color', 'white')
      .style('padding', '16px')
      .style('border-radius', '12px')
      .style('font-size', '14px')
      .style('font-family', 'Inter, sans-serif')
      .style('box-shadow', '0 10px 25px rgba(0, 0, 0, 0.2)')
      .style('backdrop-filter', 'blur(10px)')
      .style('z-index', '1000')
      .style('pointer-events', 'none');
  }

  private updateChart(): void {
    if (!this.data || this.data.length === 0) {
      this.g.selectAll('*').remove();
      return;
    }

    const hierarchyData = this.transformDataToHierarchy(this.data);
    if (!hierarchyData) return;

    this.root = d3.hierarchy(hierarchyData);
    this.root.x0 = this.height / 2;
    this.root.y0 = 0;

    // Colapsar todos los nodos excepto el primero
    if (this.root.children) {
      this.root.children.forEach((child: any) => this.collapse(child));
    }

    this.update(this.root);
    
    // Centrar después de un pequeño delay para que el DOM se actualice
    setTimeout(() => this.centerChart(), 100);
  }

  private transformDataToHierarchy(data: Puesto[]): HierarchyNode | null {
    if (!data || data.length === 0) {
      return null;
    }

    // Crear mapa de nodos
    const nodeMap = new Map<number, HierarchyNode>();
    
    // Convertir puestos a nodos
    data.forEach(puesto => {
      const node: HierarchyNode = {
        id: puesto.id,
        nombre: puesto.nombre,
        nivel_jerarquia: puesto.nivel_jerarquia,
        area_departamento: puesto.area_departamento,
        status: puesto.status,
        puesto_superior_id: puesto.puesto_superior_id,
        children: []
      };
      nodeMap.set(puesto.id, node);
    });

    let root: HierarchyNode | null = null;
    let rootCandidates: HierarchyNode[] = [];

    // Construir jerarquía
    nodeMap.forEach(node => {
      if (node.puesto_superior_id && nodeMap.has(node.puesto_superior_id)) {
        const parent = nodeMap.get(node.puesto_superior_id)!;
        if (!parent.children) parent.children = [];
        parent.children.push(node);
      } else {
        // Es un candidato a nodo raíz
        rootCandidates.push(node);
      }
    });

    // Seleccionar el nodo raíz (el de menor nivel jerárquico)
    if (rootCandidates.length > 0) {
      root = rootCandidates.reduce((prev, current) => 
        prev.nivel_jerarquia < current.nivel_jerarquia ? prev : current
      );
    }

    return root;
  }

  private update(source: any): void {
    const treeData = this.tree(this.root);
    const nodes = treeData.descendants();
    const links = treeData.descendants().slice(1);

    // Normalizar para layout fijo
    nodes.forEach((d: any) => {
      d.y = d.depth * (this.nodeWidth + 100);
    });

    // Actualizar nodos
    const node = this.g.selectAll('g.node')
      .data(nodes, (d: any) => d.id || (d.id = ++this.nodeIdCounter));

    // Entrar nodos nuevos
    const nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${source.y0},${source.x0})`)
      .on('click', (event: any, d: any) => this.toggleNode(event, d));

    // Agregar rectángulo del nodo con gradiente
    nodeEnter.append('rect')
      .attr('class', (d: any) => `node-rect ${d.data.status} level-${Math.min(d.data.nivel_jerarquia, 4)}`)
      .attr('width', this.nodeWidth)
      .attr('height', this.nodeHeight)
      .attr('x', -this.nodeWidth / 2)
      .attr('y', -this.nodeHeight / 2)
      .attr('rx', 12)
      .attr('ry', 12)
      .style('fill-opacity', 1e-6)
      .style('stroke-opacity', 1e-6)
      .style('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))');

    // Agregar icono según nivel
    nodeEnter.append('text')
      .attr('class', 'node-icon')
      .attr('x', -this.nodeWidth / 2 + 20)
      .attr('y', -this.nodeHeight / 2 + 28)
      .attr('font-family', 'primeicons')
      .attr('font-size', '18px')
      .text((d: any) => this.getIconByLevel(d.data.nivel_jerarquia));

    // Agregar título del puesto
    nodeEnter.append('text')
      .attr('class', 'node-title')
      .attr('x', 0)
      .attr('y', -15)
      .text((d: any) => this.truncateText(d.data.nombre, 22));

    // Agregar área/departamento
    nodeEnter.append('text')
      .attr('class', 'node-area')
      .attr('x', 0)
      .attr('y', 5)
      .text((d: any) => this.truncateText(d.data.area_departamento, 28));

    // Agregar badge de nivel jerárquico
    nodeEnter.append('circle')
      .attr('class', 'level-badge')
      .attr('cx', this.nodeWidth / 2 - 20)
      .attr('cy', -this.nodeHeight / 2 + 20)
      .attr('r', 14)
      .style('fill', (d: any) => this.getLevelColor(d.data.nivel_jerarquia));

    nodeEnter.append('text')
      .attr('class', 'level-text')
      .attr('x', this.nodeWidth / 2 - 20)
      .attr('y', -this.nodeHeight / 2 + 26)
      .text((d: any) => `N${d.data.nivel_jerarquia}`);

    // Indicador de estado
    nodeEnter.append('circle')
      .attr('class', 'status-indicator')
      .attr('cx', -this.nodeWidth / 2 + 20)
      .attr('cy', this.nodeHeight / 2 - 20)
      .attr('r', 6)
      .style('fill', (d: any) => d.data.status === 'activo' ? '#10b981' : '#ef4444');

    // Indicador de colapso/expansión
    const collapseGroup = nodeEnter.append('g')
      .attr('class', 'collapse-group')
      .style('display', (d: any) => (d._children || (d.children && d.children.length > 0)) ? 'block' : 'none')
      .style('cursor', 'pointer');

    collapseGroup.append('circle')
      .attr('class', 'collapse-indicator')
      .attr('cx', 0)
      .attr('cy', this.nodeHeight / 2 + 20)
      .attr('r', 15)
      .style('fill', '#3b82f6')
      .style('stroke', '#ffffff')
      .style('stroke-width', '3px');

    collapseGroup.append('text')
      .attr('class', 'collapse-text')
      .attr('x', 0)
      .attr('y', this.nodeHeight / 2 + 26)
      .style('fill', '#ffffff')
      .style('font-weight', 'bold')
      .style('font-size', '16px')
      .style('text-anchor', 'middle')
      .text((d: any) => d._children ? '+' : '−');

    // Eventos de hover
    nodeEnter
      .on('mouseover', (event: any, d: any) => this.showTooltip(event, d))
      .on('mouseout', () => this.hideTooltip())
      .on('mousemove', (event: any) => this.moveTooltip(event));

    // Transición de entrada
    const nodeUpdate = nodeEnter.merge(node);

    nodeUpdate.transition()
      .duration(750)
      .attr('transform', (d: any) => `translate(${d.y},${d.x})`);

    nodeUpdate.select('rect.node-rect')
      .style('fill-opacity', 1)
      .style('stroke-opacity', 1);

    // Actualizar indicadores de colapso
    nodeUpdate.select('.collapse-group')
      .style('display', (d: any) => (d._children || (d.children && d.children.length > 0)) ? 'block' : 'none');

    nodeUpdate.select('.collapse-text')
      .text((d: any) => d._children ? '+' : '−');

    // Transición de salida
    const nodeExit = node.exit().transition()
      .duration(750)
      .attr('transform', (d: any) => `translate(${source.y},${source.x})`)
      .remove();

    nodeExit.select('rect')
      .style('fill-opacity', 1e-6)
      .style('stroke-opacity', 1e-6);

    // Actualizar enlaces
    const link = this.g.selectAll('path.link')
      .data(links, (d: any) => d.id);

    const linkEnter = link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('d', (d: any) => {
        const o = { x: source.x0, y: source.y0 };
        return this.diagonal(o, o);
      })
      .style('stroke-width', '3px')
      .style('stroke', '#9ca3af')
      .style('fill', 'none')
      .style('stroke-opacity', 0.8);

    const linkUpdate = linkEnter.merge(link);

    linkUpdate.transition()
      .duration(750)
      .attr('d', (d: any) => this.diagonal(d, d.parent));

    const linkExit = link.exit().transition()
      .duration(750)
      .attr('d', (d: any) => {
        const o = { x: source.x, y: source.y };
        return this.diagonal(o, o);
      })
      .remove();

    // Guardar posiciones para próxima transición
    nodes.forEach((d: any) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }



  private diagonal(s: any, d: any): string {
    const path = `M ${s.y} ${s.x}
                  C ${(s.y + d.y) / 2} ${s.x},
                    ${(s.y + d.y) / 2} ${d.x},
                    ${d.y} ${d.x}`;
    return path;
  }

  private showTooltip(event: any, d: any): void {
    const subordinados = this.countSubordinates(d.data);
    const tooltipContent = `
      <div style="font-weight: 600; margin-bottom: 8px; color: #f3f4f6;">${d.data.nombre}</div>
      <div style="margin-bottom: 4px;"><strong>Área:</strong> ${d.data.area_departamento}</div>
      <div style="margin-bottom: 4px;"><strong>Nivel Jerárquico:</strong> ${d.data.nivel_jerarquia}</div>
      <div style="margin-bottom: 4px;"><strong>Estado:</strong> 
        <span style="color: ${d.data.status === 'activo' ? '#10b981' : '#ef4444'}; font-weight: 600;">
          ${d.data.status === 'activo' ? 'Activo' : 'Inactivo'}
        </span>
      </div>
      <div><strong>Subordinados:</strong> ${subordinados}</div>
    `;
    
    this.tooltip
      .style('visibility', 'visible')
      .html(tooltipContent);
      
    this.moveTooltip(event);
  }

  private moveTooltip(event: any): void {
    this.tooltip
      .style('left', (event.pageX + 15) + 'px')
      .style('top', (event.pageY - 10) + 'px');
  }

  private hideTooltip(): void {
    this.tooltip.style('visibility', 'hidden');
  }

  private countSubordinates(nodeData: HierarchyNode): number {
    return this.data.filter(puesto => puesto.puesto_superior_id === nodeData.id).length;
  }

  private toggleNode(event: any, d: any): void {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    this.update(d);
  }

  private collapse(d: any): void {
    if (d.children) {
      d._children = d.children;
      d._children.forEach((child: any) => this.collapse(child));
      d.children = null;
    }
  }

  private getIconByLevel(nivel: number): string {
    switch (nivel) {
      case 1: return '\uf508'; // Corona para directivos
      case 2: return '\uf0c0'; // Grupo para gerentes
      case 3: return '\uf007'; // Usuario para supervisores
      default: return '\uf2c0'; // Usuario simple para operativos
    }
  }



  private getLevelColor(nivel: number): string {
    switch (nivel) {
      case 1: return '#f59e0b'; // Dorado
      case 2: return '#3b82f6'; // Azul
      case 3: return '#10b981'; // Verde
      default: return '#6b7280'; // Gris
    }
  }

  private truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  // Métodos públicos para controles
  expandAll(): void {
    if (this.root) {
      this.expandAllNodes(this.root);
      this.update(this.root);
    }
  }

  collapseAll(): void {
    if (this.root && this.root.children) {
      this.root.children.forEach((child: any) => this.collapse(child));
      this.update(this.root);
    }
  }

  centerChart(): void {
    if (!this.root || !this.g) return;
    
    try {
      const bounds = this.g.node()?.getBBox();
      if (!bounds) return;
      
      const parent = this.svg.node();
      const fullWidth = parent.clientWidth || 800;
      const fullHeight = parent.clientHeight || 600;
      const width = bounds.width;
      const height = bounds.height;
      const midX = bounds.x + width / 2;
      const midY = bounds.y + height / 2;
      
      if (width === 0 || height === 0) return;
      
      const scale = Math.min(0.9, 0.8 / Math.max(width / fullWidth, height / fullHeight));
      const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];
      
      this.svg.transition()
        .duration(750)
        .call(this.zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
    } catch (error) {
      console.warn('Error al centrar el organigrama:', error);
    }
  }

  private expandAllNodes(d: any): void {
    if (d._children) {
      d.children = d._children;
      d._children = null;
    }
    if (d.children) {
      d.children.forEach((child: any) => this.expandAllNodes(child));
    }
  }
}