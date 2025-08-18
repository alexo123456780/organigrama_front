import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  
  // Validador para nombres de usuario (solo letras, números y guiones bajos)
  static username(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const valid = usernameRegex.test(control.value);
    
    return valid ? null : { username: { value: control.value } };
  }
  
  // Validador para contraseñas seguras
  static strongPassword(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    const password = control.value;
    const errors: any = {};
    
    // Al menos 8 caracteres
    if (password.length < 8) {
      errors.minLength = true;
    }
    
    // Al menos una letra mayúscula
    if (!/[A-Z]/.test(password)) {
      errors.uppercase = true;
    }
    
    // Al menos una letra minúscula
    if (!/[a-z]/.test(password)) {
      errors.lowercase = true;
    }
    
    // Al menos un número
    if (!/\d/.test(password)) {
      errors.number = true;
    }
    
    // Al menos un carácter especial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.specialChar = true;
    }
    
    return Object.keys(errors).length > 0 ? { strongPassword: errors } : null;
  }
  
  // Validador para confirmar contraseña
  static confirmPassword(passwordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null;
      }
      
      const password = control.parent.get(passwordField);
      const confirmPassword = control;
      
      if (!password || !confirmPassword) {
        return null;
      }
      
      return password.value === confirmPassword.value ? null : { confirmPassword: true };
    };
  }
  
  // Validador para nombres (solo letras y espacios)
  static nameValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const valid = nameRegex.test(control.value);
    
    return valid ? null : { invalidName: { value: control.value } };
  }
  
  // Validador para números positivos
  static positiveNumber(control: AbstractControl): ValidationErrors | null {
    if (!control.value && control.value !== 0) {
      return null;
    }
    
    const value = Number(control.value);
    return value > 0 ? null : { positiveNumber: { value: control.value } };
  }
  
  // Validador para rangos numéricos
  static numberRange(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value && control.value !== 0) {
        return null;
      }
      
      const value = Number(control.value);
      
      if (value < min) {
        return { numberRange: { min, max, actual: value } };
      }
      
      if (value > max) {
        return { numberRange: { min, max, actual: value } };
      }
      
      return null;
    };
  }
  
  // Validador para texto sin espacios en blanco al inicio y final
  static noWhitespace(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    const value = control.value as string;
    const trimmed = value.trim();
    
    return value === trimmed ? null : { whitespace: { value } };
  }
  
  // Validador para longitud mínima de palabras
  static minWords(minWords: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const words = control.value.trim().split(/\s+/).filter((word: string) => word.length > 0);
      
      return words.length >= minWords ? null : { minWords: { required: minWords, actual: words.length } };
    };
  }
  
  // Validador para caracteres especiales no permitidos
  static noSpecialChars(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    const specialCharsRegex = /[<>"'&]/;
    const hasSpecialChars = specialCharsRegex.test(control.value);
    
    return hasSpecialChars ? { specialChars: { value: control.value } } : null;
  }
  
  // Validador para URLs
  static url(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    try {
      new URL(control.value);
      return null;
    } catch {
      return { url: { value: control.value } };
    }
  }
  
  // Validador para fechas futuras
  static futureDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return inputDate > today ? null : { futureDate: { value: control.value } };
  }
  
  // Validador para fechas pasadas
  static pastDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    return inputDate < today ? null : { pastDate: { value: control.value } };
  }
}

// Mensajes de error personalizados
export const VALIDATION_MESSAGES = {
  required: 'Este campo es obligatorio',
  email: 'Ingresa un email válido',
  minlength: (params: any) => `Mínimo ${params.requiredLength} caracteres`,
  maxlength: (params: any) => `Máximo ${params.requiredLength} caracteres`,
  min: (params: any) => `El valor mínimo es ${params.min}`,
  max: (params: any) => `El valor máximo es ${params.max}`,
  username: 'Solo se permiten letras, números y guiones bajos',
  strongPassword: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
  confirmPassword: 'Las contraseñas no coinciden',
  invalidName: 'Solo se permiten letras y espacios',
  positiveNumber: 'Debe ser un número positivo',
  numberRange: (params: any) => `El valor debe estar entre ${params.min} y ${params.max}`,
  whitespace: 'No se permiten espacios al inicio o final',
  minWords: (params: any) => `Mínimo ${params.required} palabras`,
  specialChars: 'No se permiten caracteres especiales como <, >, ", \'',
  url: 'Ingresa una URL válida',
  futureDate: 'La fecha debe ser futura',
  pastDate: 'La fecha debe ser pasada'
};

// Función auxiliar para obtener mensajes de error
export function getValidationMessage(fieldName: string, errors: ValidationErrors): string {
  const errorKey = Object.keys(errors)[0];
  const errorValue = errors[errorKey];
  
  if (typeof VALIDATION_MESSAGES[errorKey as keyof typeof VALIDATION_MESSAGES] === 'function') {
    return (VALIDATION_MESSAGES[errorKey as keyof typeof VALIDATION_MESSAGES] as Function)(errorValue);
  }
  
  return VALIDATION_MESSAGES[errorKey as keyof typeof VALIDATION_MESSAGES] as string || 'Campo inválido';
}