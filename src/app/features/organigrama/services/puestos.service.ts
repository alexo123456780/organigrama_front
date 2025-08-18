import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, retry, timeout } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { API_KEYS } from '../../../core/constants/endpoints';
import { Puesto, CreatePuestoDto, UpdatePuestoDto } from '../models/puesto.model';

@Injectable({
  providedIn: 'root'
})
export class PuestosService {

  private API_URL = environment.api_url;

  constructor(private http: HttpClient) {}

  private transformStatus(status: boolean | string | number): 'activo' | 'inactivo' {
    if (typeof status === 'boolean') {
      return status ? 'activo' : 'inactivo';
    }
    if (typeof status === 'number') {
      return status === 1 ? 'activo' : 'inactivo';
    }
    if (typeof status === 'string') {
      return status.toLowerCase() === 'true' || status.toLowerCase() === 'activo' ? 'activo' : 'inactivo';
    }
    return 'inactivo'; 
  }

  private transformStatusForBackend(status: 'activo' | 'inactivo' | boolean): boolean {
    if (typeof status === 'string') {
      return status === 'activo';
    }
    return status;
  }

  private transformPuestoFromBackend(puesto: any): Puesto {
    return {
      ...puesto,
      status: this.transformStatus(puesto.status),
      subordinados: puesto.subordinados ? puesto.subordinados.map((sub: any) => this.transformPuestoFromBackend(sub)) : undefined
    };
  }

  private transformPuestoForBackend(puesto: Partial<Puesto> | CreatePuestoDto | UpdatePuestoDto): any {
    const transformed = { ...puesto };
    if ('status' in transformed && transformed.status !== undefined) {
      (transformed as any).status = this.transformStatusForBackend(transformed.status as 'activo' | 'inactivo');
    }
    return transformed;
  }

  getPuestos(filters?: {
    estatus?: string;
    area_departamento?: string;
    nivel_jerarquico?: number;
  }): Observable<Puesto[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.estatus) {
        params = params.set('estatus', filters.estatus);
      }
      if (filters.area_departamento) {
        params = params.set('area_departamento', filters.area_departamento);
      }
      if (filters.nivel_jerarquico) {
        params = params.set('nivel_jerarquico', filters.nivel_jerarquico.toString());
      }
    }

    return this.http.get<any[]>(`${this.API_URL}/${API_KEYS.PUESTOS.GET_ALL}`, { params })
      .pipe(
        timeout(10000), // 10 segundos de timeout
        retry(2), // Reintentar 2 veces en caso de error
        map(response => {
          // Validar que la respuesta sea un array
          if (!Array.isArray(response)) {
            throw new Error('La respuesta del servidor no es válida');
          }
          return response.map(puesto => this.transformPuestoFromBackend(puesto));
        })
      );
  }

  // Obtener organigrama estructurado
  getOrganigrama(): Observable<Puesto[]> {
    return this.http.get<any[]>(`${this.API_URL}/${API_KEYS.PUESTOS.ORGANIGRAMA}`)
      .pipe(
        timeout(15000), // Mayor timeout para organigrama completo
        retry(2),
        map(response => {
          if (!Array.isArray(response)) {
            throw new Error('Error al cargar el organigrama');
          }
          return response.map(puesto => this.transformPuestoFromBackend(puesto));
        })
      );
  }

  // Obtener puesto por ID
  getPuestoById(id: number): Observable<Puesto> {
    if (!id || id <= 0) {
      throw new Error('ID de puesto inválido');
    }
    
    return this.http.get<any>(`${this.API_URL}/${API_KEYS.PUESTOS.GET_BY_ID}/${id}`)
      .pipe(
        timeout(8000),
        retry(1),
        map(response => {
          if (!response || typeof response !== 'object') {
            throw new Error('Puesto no encontrado');
          }
          return this.transformPuestoFromBackend(response);
        })
      );
  }

  // Crear nuevo puesto
  createPuesto(puesto: CreatePuestoDto): Observable<Puesto> {
    // Validaciones básicas antes de enviar
    if (!puesto.nombre?.trim()) {
      throw new Error('El nombre del puesto es obligatorio');
    }
    if (!puesto.area_departamento?.trim()) {
      throw new Error('El área/departamento es obligatorio');
    }
    if (!puesto.nivel_jerarquia || puesto.nivel_jerarquia < 1) {
      throw new Error('El nivel jerárquico debe ser mayor a 0');
    }
    
    const puestoForBackend = this.transformPuestoForBackend(puesto);
    
    return this.http.post<any>(`${this.API_URL}/${API_KEYS.PUESTOS.CREATE}`, puestoForBackend)
      .pipe(
        timeout(10000),
        map(response => {
          if (!response || typeof response !== 'object') {
            throw new Error('Error al crear el puesto');
          }
          return this.transformPuestoFromBackend(response);
        })
      );
  }

  // Actualizar puesto
  updatePuesto(id: number, puesto: UpdatePuestoDto): Observable<Puesto> {
    if (!id || id <= 0) {
      throw new Error('ID de puesto inválido');
    }
    
    // Validaciones básicas
    if (puesto.nombre !== undefined && !puesto.nombre?.trim()) {
      throw new Error('El nombre del puesto no puede estar vacío');
    }
    if (puesto.area_departamento !== undefined && !puesto.area_departamento?.trim()) {
      throw new Error('El área/departamento no puede estar vacío');
    }
    if (puesto.nivel_jerarquia !== undefined && puesto.nivel_jerarquia < 1) {
      throw new Error('El nivel jerárquico debe ser mayor a 0');
    }
    
    const puestoForBackend = this.transformPuestoForBackend(puesto);
    
    return this.http.put<any>(`${this.API_URL}/${API_KEYS.PUESTOS.UPDATE}/${id}`, puestoForBackend)
      .pipe(
        timeout(10000),
        map(response => {
          if (!response || typeof response !== 'object') {
            throw new Error('Error al actualizar el puesto');
          }
          return this.transformPuestoFromBackend(response);
        })
      );
  }

  // Eliminar puesto (baja lógica)
  deletePuesto(id: number): Observable<any> {
    if (!id || id <= 0) {
      throw new Error('ID de puesto inválido');
    }
    
    return this.http.delete(`${this.API_URL}/${API_KEYS.PUESTOS.DELETE}/${id}`)
      .pipe(
        timeout(8000),
        retry(1)
      );
  }

  // Obtener áreas/departamentos únicos
  getAreas(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/${API_KEYS.PUESTOS.GET_AREAS}`)
      .pipe(
        timeout(8000),
        retry(2),
        map(response => {
          if (!Array.isArray(response)) {
            throw new Error('Error al cargar las áreas');
          }
          return response;
        })
      );
  }

  // Obtener niveles jerárquicos únicos
  getNivelesJerarquicos(): Observable<number[]> {
    return this.http.get<number[]>(`${this.API_URL}/${API_KEYS.PUESTOS.GET_NIVELES}`)
      .pipe(
        timeout(8000),
        retry(2),
        map(response => {
          if (!Array.isArray(response)) {
            throw new Error('Error al cargar los niveles jerárquicos');
          }
          return response;
        })
      );
  }
}