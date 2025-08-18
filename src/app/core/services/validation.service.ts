import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { getValidationMessage } from '../validators/custom-validators';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  /**
   * Valida un formulario completo y retorna el primer error encontrado
   */
  validateForm(form: FormGroup): {
    isValid: boolean;
    firstError?: {
      field: string;
      message: string;
      fieldName: string;
    };
  } {
    if (form.valid) {
      return { isValid: true };
    }

    // Marcar todos los campos como tocados
    form.markAllAsTouched();

    // Buscar el primer campo con error
    const firstErrorField = this.getFirstInvalidField(form);
    
    if (firstErrorField) {
      const control = form.get(firstErrorField);
      if (control?.errors) {
        const fieldName = this.getFieldDisplayName(firstErrorField);
        const message = getValidationMessage(firstErrorField, control.errors);
        
        return {
          isValid: false,
          firstError: {
            field: firstErrorField,
            message,
            fieldName
          }
        };
      }
    }

    return {
      isValid: false,
      firstError: {
        field: 'unknown',
        message: 'Por favor, complete todos los campos correctamente',
        fieldName: 'Formulario'
      }
    };
  }

  /**
   * Obtiene el primer campo inválido de un formulario
   */
  private getFirstInvalidField(form: FormGroup): string | null {
    const controls = form.controls;
    
    for (const fieldName in controls) {
      const control = controls[fieldName];
      
      if (control.invalid) {
        // Si es un FormGroup anidado, buscar recursivamente
        if (control instanceof FormGroup) {
          const nestedField = this.getFirstInvalidField(control);
          if (nestedField) {
            return `${fieldName}.${nestedField}`;
          }
        }
        return fieldName;
      }
    }
    
    return null;
  }

  /**
   * Obtiene todos los errores de un formulario
   */
  getAllFormErrors(form: FormGroup): Array<{
    field: string;
    fieldName: string;
    errors: ValidationErrors;
    messages: string[];
  }> {
    const errors: Array<{
      field: string;
      fieldName: string;
      errors: ValidationErrors;
      messages: string[];
    }> = [];

    Object.keys(form.controls).forEach(fieldName => {
      const control = form.get(fieldName);
      
      if (control && control.invalid && control.errors) {
        const messages = Object.keys(control.errors).map(errorKey => 
          getValidationMessage(fieldName, { [errorKey]: control.errors![errorKey] })
        );
        
        errors.push({
          field: fieldName,
          fieldName: this.getFieldDisplayName(fieldName),
          errors: control.errors,
          messages
        });
      }
    });

    return errors;
  }

  /**
   * Valida un campo específico y retorna sus errores
   */
  validateField(control: AbstractControl, fieldName: string): {
    isValid: boolean;
    messages: string[];
  } {
    if (!control || control.valid) {
      return { isValid: true, messages: [] };
    }

    const messages: string[] = [];
    
    if (control.errors) {
      Object.keys(control.errors).forEach(errorKey => {
        const message = getValidationMessage(fieldName, { [errorKey]: control.errors![errorKey] });
        messages.push(message);
      });
    }

    return {
      isValid: false,
      messages
    };
  }

  /**
   * Limpia espacios en blanco de los campos de texto de un formulario
   */
  trimFormValues(form: FormGroup, fieldsToTrim: string[] = []): void {
    const controls = form.controls;
    
    Object.keys(controls).forEach(fieldName => {
      const control = controls[fieldName];
      
      // Si no se especifican campos, limpiar todos los campos de texto
      if (fieldsToTrim.length === 0 || fieldsToTrim.includes(fieldName)) {
        if (typeof control.value === 'string') {
          control.setValue(control.value.trim());
        }
      }
    });
  }

  /**
   * Verifica si un formulario tiene cambios pendientes
   */
  hasUnsavedChanges(form: FormGroup): boolean {
    return form.dirty && !form.pristine;
  }

  /**
   * Resetea un formulario a su estado inicial
   */
  resetForm(form: FormGroup, initialValues?: any): void {
    if (initialValues) {
      form.reset(initialValues);
    } else {
      form.reset();
    }
    form.markAsUntouched();
    form.markAsPristine();
  }

  /**
   * Obtiene el nombre de visualización de un campo
   */
  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      // Campos de usuario
      userName: 'Usuario',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      rol: 'Rol',
      
      // Campos de puesto
      nombre: 'Nombre',
      descripcion: 'Descripción',
      nivel_jerarquia: 'Nivel jerárquico',
      area_departamento: 'Área/Departamento',
      puesto_superior_id: 'Puesto superior',
      status: 'Estado',
      
      // Campos generales
      email: 'Correo electrónico',
      telefono: 'Teléfono',
      direccion: 'Dirección',
      fecha: 'Fecha',
      fechaInicio: 'Fecha de inicio',
      fechaFin: 'Fecha de fin'
    };

    return fieldNames[fieldName] || this.capitalizeFirstLetter(fieldName);
  }

  /**
   * Capitaliza la primera letra de una cadena
   */
  private capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /**
   * Valida que las contraseñas coincidan
   */
  validatePasswordMatch(form: FormGroup, passwordField: string = 'password', confirmField: string = 'confirmPassword'): boolean {
    const password = form.get(passwordField)?.value;
    const confirmPassword = form.get(confirmField)?.value;
    
    return password === confirmPassword;
  }

  /**
   * Aplica validaciones en tiempo real a un formulario
   */
  enableRealTimeValidation(form: FormGroup): void {
    Object.keys(form.controls).forEach(fieldName => {
      const control = form.get(fieldName);
      if (control) {
        control.valueChanges.subscribe(() => {
          if (control.touched && control.invalid) {
            control.markAsTouched();
          }
        });
      }
    });
  }
}