import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean;
  hasUnsavedChanges?(): boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FormValidationGuard implements CanDeactivate<CanComponentDeactivate> {

  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    // Si el componente no implementa hasUnsavedChanges, permitir navegación
    if (!component.hasUnsavedChanges) {
      return true;
    }

    // Si no hay cambios sin guardar, permitir navegación
    if (!component.hasUnsavedChanges()) {
      return true;
    }

    // Si hay cambios sin guardar, preguntar al usuario
    return this.confirmNavigation();
  }

  private confirmNavigation(): boolean {
    return confirm(
      '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.'
    );
  }
}

/**
 * Interfaz para componentes que manejan formularios
 */
export interface FormComponent {
  form: any;
  hasUnsavedChanges(): boolean;
  validateForm(): boolean;
  resetForm(): void;
}

/**
 * Mixin para agregar funcionalidad de validación a componentes
 */
export function withFormValidation<T extends new (...args: any[]) => {}>(Base: T) {
  return class extends Base implements CanComponentDeactivate {
    
    canDeactivate(): boolean {
      if (this.hasUnsavedChanges && this.hasUnsavedChanges()) {
        return confirm(
          '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.'
        );
      }
      return true;
    }

    hasUnsavedChanges?(): boolean;
  };
}