import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NotificationService } from './notification.service';
import { environment } from '../../../environments/environment';

export interface ErrorInfo {
  message: string;
  code?: string | number;
  details?: any;
  timestamp: Date;
  url?: string;
  userAgent?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private errorLog: ErrorInfo[] = [];
  private readonly MAX_ERROR_LOG_SIZE = 50;

  constructor(private notificationService: NotificationService) {}

  /**
   * Maneja errores HTTP y los convierte en mensajes amigables
   */
  handleHttpError(error: HttpErrorResponse): Observable<never> {
    const errorInfo = this.createErrorInfo(error);
    this.logError(errorInfo);
    
    const userMessage = this.getHttpErrorMessage(error);
    this.notificationService.error(userMessage);
    
    return throwError(() => error);
  }

  /**
   * Maneja errores de aplicación generales
   */
  handleApplicationError(error: Error, context?: string): void {
    const errorInfo: ErrorInfo = {
      message: error.message,
      details: {
        stack: error.stack,
        context: context || 'Unknown',
        name: error.name
      },
      timestamp: new Date(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    this.logError(errorInfo);
    
    if (!environment.production) {
      console.error('Application Error:', errorInfo);
    }
    
    this.notificationService.error(
      'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.'
    );
  }

  /**
   * Maneja errores de validación específicos
   */
  handleValidationError(errors: { [key: string]: any }, context?: string): void {
    const errorMessages = Object.keys(errors).map(field => {
      const fieldErrors = errors[field];
      if (Array.isArray(fieldErrors)) {
        return `${field}: ${fieldErrors.join(', ')}`;
      }
      return `${field}: ${fieldErrors}`;
    });
    
    const errorInfo: ErrorInfo = {
      message: 'Validation Error',
      details: {
        errors,
        context: context || 'Form Validation'
      },
      timestamp: new Date(),
      url: window.location.href
    };
    
    this.logError(errorInfo);
    
    const userMessage = errorMessages.length > 1 
      ? `Errores de validación: ${errorMessages.slice(0, 3).join('; ')}${errorMessages.length > 3 ? '...' : ''}`
      : errorMessages[0] || 'Error de validación';
    
    this.notificationService.error(userMessage);
  }

  /**
   * Obtiene el historial de errores (solo en desarrollo)
   */
  getErrorLog(): ErrorInfo[] {
    if (!environment.production) {
      return [...this.errorLog];
    }
    return [];
  }

  /**
   * Limpia el historial de errores
   */
  clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * Reporta un error crítico que requiere atención inmediata
   */
  reportCriticalError(error: Error | string, context?: string): void {
    const errorMessage = typeof error === 'string' ? error : error.message;
    
    const errorInfo: ErrorInfo = {
      message: `CRITICAL: ${errorMessage}`,
      details: {
        context: context || 'Critical Error',
        stack: typeof error === 'object' ? error.stack : undefined
      },
      timestamp: new Date(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    this.logError(errorInfo);
    
    if (!environment.production) {
      console.error('CRITICAL ERROR:', errorInfo);
    }
    
    // En producción, aquí se podría enviar el error a un servicio de monitoreo
    // como Sentry, LogRocket, etc.
    
    this.notificationService.error(
      'Ha ocurrido un error crítico. El equipo técnico ha sido notificado.'
    );
  }

  /**
   * Crea información detallada del error HTTP
   */
  private createErrorInfo(error: HttpErrorResponse): ErrorInfo {
    return {
      message: error.message,
      code: error.status,
      details: {
        statusText: error.statusText,
        url: error.url,
        body: error.error,
        headers: this.extractHeaders(error)
      },
      timestamp: new Date(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
  }

  /**
   * Extrae headers relevantes del error HTTP
   */
  private extractHeaders(error: HttpErrorResponse): { [key: string]: string } {
    const headers: { [key: string]: string } = {};
    
    if (error.headers) {
      const relevantHeaders = ['content-type', 'authorization', 'x-request-id'];
      relevantHeaders.forEach(headerName => {
        const value = error.headers.get(headerName);
        if (value) {
          headers[headerName] = value;
        }
      });
    }
    
    return headers;
  }

  /**
   * Obtiene mensaje de error HTTP amigable para el usuario
   */
  private getHttpErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 400:
        return this.extractValidationMessage(error) || 'Los datos enviados no son válidos';
      case 401:
        return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente';
      case 403:
        return 'No tienes permisos para realizar esta acción';
      case 404:
        return 'El recurso solicitado no fue encontrado';
      case 409:
        return 'Ya existe un registro con estos datos';
      case 422:
        return this.extractValidationMessage(error) || 'Los datos proporcionados no son válidos';
      case 429:
        return 'Demasiadas solicitudes. Por favor, espera un momento e intenta nuevamente';
      case 500:
        return 'Error interno del servidor. Por favor, intenta más tarde';
      case 502:
        return 'Servicio temporalmente no disponible';
      case 503:
        return 'Servicio en mantenimiento. Intenta más tarde';
      case 0:
        return 'Sin conexión a internet. Verifica tu conexión';
      default:
        return `Error del servidor (${error.status}). Por favor, intenta más tarde`;
    }
  }

  /**
   * Extrae mensajes de validación del error HTTP
   */
  private extractValidationMessage(error: HttpErrorResponse): string | null {
    if (error.error) {
      // Formato Laravel/NestJS
      if (error.error.message) {
        return error.error.message;
      }
      
      // Formato de errores de validación
      if (error.error.errors) {
        const firstError = Object.values(error.error.errors)[0];
        if (Array.isArray(firstError)) {
          return firstError[0] as string;
        }
        return firstError as string;
      }
      
      // Mensaje directo
      if (typeof error.error === 'string') {
        return error.error;
      }
    }
    
    return null;
  }

  /**
   * Registra el error en el log interno
   */
  private logError(errorInfo: ErrorInfo): void {
    this.errorLog.unshift(errorInfo);
    
    // Mantener solo los últimos N errores
    if (this.errorLog.length > this.MAX_ERROR_LOG_SIZE) {
      this.errorLog = this.errorLog.slice(0, this.MAX_ERROR_LOG_SIZE);
    }
    
    // Log en consola solo en desarrollo
    if (!environment.production) {
      console.error('Error logged:', errorInfo);
    }
  }

  /**
   * Verifica si un error es recuperable
   */
  isRecoverableError(error: HttpErrorResponse): boolean {
    const recoverableStatuses = [408, 429, 502, 503, 504];
    return recoverableStatuses.includes(error.status);
  }

  /**
   * Verifica si un error requiere reautenticación
   */
  requiresReauth(error: HttpErrorResponse): boolean {
    return error.status === 401;
  }

  /**
   * Verifica si un error es de red
   */
  isNetworkError(error: HttpErrorResponse): boolean {
    return error.status === 0 || !navigator.onLine;
  }
}