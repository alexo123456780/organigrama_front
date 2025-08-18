import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../services/error-handler.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private errorHandler = inject(ErrorHandlerService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retry({
        count: this.shouldRetry(req) ? 2 : 0,
        delay: 1000 // Esperar 1 segundo antes del reintento
      }),
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error, req);
      })
    );
  }

  private handleError(error: HttpErrorResponse, req: HttpRequest<any>): Observable<never> {
    // Manejar errores de autenticación
    if (this.errorHandler.requiresReauth(error)) {
      this.handleUnauthorized();
    }
    
    // Delegar el manejo del error al servicio especializado
    return this.errorHandler.handleHttpError(error);
  }

  /**
   * Determina si una petición debe ser reintentada
   */
  private shouldRetry(req: HttpRequest<any>): boolean {
    // Solo reintentar peticiones GET y HEAD
    const retryableMethods = ['GET', 'HEAD'];
    return retryableMethods.includes(req.method.toUpperCase());
  }

  /**
   * Maneja errores de autorización
   */
  private handleUnauthorized(): void {
    // Limpiar token de autenticación
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirigir al login
    this.router.navigate(['/login']);
  }
}