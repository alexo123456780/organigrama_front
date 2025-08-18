export interface Puesto {
  id: number;
  nombre: string;
  descripcion?: string;
  nivel_jerarquia: number;
  area_departamento: string;
  status: 'activo' | 'inactivo';
  puesto_superior_id?: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  usuario_creador: string;
  usuario_modificador: string;
  
  // Propiedades adicionales para la vista
  subordinados?: Puesto[];
  puesto_superior?: Puesto;
}

export interface CreatePuestoDto {
  nombre: string;
  descripcion?: string;
  nivel_jerarquia: number;
  area_departamento: string;
  puesto_superior_id?: number;
}

export interface UpdatePuestoDto {
  nombre?: string;
  descripcion?: string;
  nivel_jerarquia?: number;
  area_departamento?: string;
  puesto_superior_id?: number;
  status?: 'activo' | 'inactivo';
}

export interface PuestoFilter {
  estatus?: string;
  area_departamento?: string;
  nivel_jerarquico?: number;
  nombre?: string;
}