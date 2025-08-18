import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { take } from 'rxjs/operators';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  timestamp: Date;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

export interface NotificationConfig {
  maxNotifications?: number;
  defaultDuration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  enableSound?: boolean;
  enableAnimation?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private config: NotificationConfig = {
    maxNotifications: 5,
    defaultDuration: 5000,
    position: 'top-right',
    enableSound: false,
    enableAnimation: true
  };

  constructor() {}

  /**
   * Obtiene el observable de notificaciones
   */
  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  /**
   * Configura el servicio de notificaciones
   */
  configure(config: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Muestra una notificación de éxito
   */
  success(message: string, title?: string, options?: Partial<Notification>): string {
    return this.show({
      type: 'success',
      title: title || '¡Éxito!',
      message,
      ...options
    });
  }

  /**
   * Muestra una notificación de error
   */
  error(message: string, title?: string, options?: Partial<Notification>): string {
    return this.show({
      type: 'error',
      title: title || 'Error',
      message,
      persistent: true, // Los errores son persistentes por defecto
      ...options
    });
  }

  /**
   * Muestra una notificación de advertencia
   */
  warning(message: string, title?: string, options?: Partial<Notification>): string {
    return this.show({
      type: 'warning',
      title: title || 'Advertencia',
      message,
      duration: 7000, // Las advertencias duran más tiempo
      ...options
    });
  }

  /**
   * Muestra una notificación informativa
   */
  info(message: string, title?: string, options?: Partial<Notification>): string {
    return this.show({
      type: 'info',
      title: title || 'Información',
      message,
      ...options
    });
  }

  /**
   * Muestra una notificación personalizada
   */
  show(notification: Partial<Notification>): string {
    const id = this.generateId();
    const newNotification: Notification = {
      id,
      type: 'info',
      message: '',
      duration: this.config.defaultDuration,
      persistent: false,
      timestamp: new Date(),
      ...notification
    };

    this.addNotification(newNotification);

    // Auto-remover si no es persistente
    if (!newNotification.persistent && newNotification.duration && newNotification.duration > 0) {
      timer(newNotification.duration).pipe(take(1)).subscribe(() => {
        this.remove(id);
      });
    }

    return id;
  }

  /**
   * Remueve una notificación por ID
   */
  remove(id: string): void {
    const currentNotifications = this.notifications$.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== id);
    this.notifications$.next(updatedNotifications);
  }

  /**
   * Remueve todas las notificaciones
   */
  clear(): void {
    this.notifications$.next([]);
  }

  /**
   * Remueve todas las notificaciones de un tipo específico
   */
  clearByType(type: Notification['type']): void {
    const currentNotifications = this.notifications$.value;
    const updatedNotifications = currentNotifications.filter(n => n.type !== type);
    this.notifications$.next(updatedNotifications);
  }

  /**
   * Obtiene una notificación por ID
   */
  getById(id: string): Notification | undefined {
    return this.notifications$.value.find(n => n.id === id);
  }

  /**
   * Verifica si hay notificaciones de un tipo específico
   */
  hasNotificationsOfType(type: Notification['type']): boolean {
    return this.notifications$.value.some(n => n.type === type);
  }

  /**
   * Obtiene el conteo de notificaciones por tipo
   */
  getCountByType(type: Notification['type']): number {
    return this.notifications$.value.filter(n => n.type === type).length;
  }

  /**
   * Muestra una notificación de confirmación con acciones
   */
  confirm(
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    title?: string
  ): string {
    const actions: NotificationAction[] = [
      {
        label: 'Confirmar',
        action: () => {
          onConfirm();
          this.remove(id);
        },
        style: 'primary'
      },
      {
        label: 'Cancelar',
        action: () => {
          if (onCancel) onCancel();
          this.remove(id);
        },
        style: 'secondary'
      }
    ];

    const id = this.show({
      type: 'warning',
      title: title || 'Confirmación',
      message,
      persistent: true,
      actions
    });

    return id;
  }

  /**
   * Muestra una notificación de progreso
   */
  progress(message: string, title?: string): string {
    return this.show({
      type: 'info',
      title: title || 'Procesando...',
      message,
      persistent: true
    });
  }

  /**
   * Actualiza una notificación existente
   */
  update(id: string, updates: Partial<Notification>): void {
    const currentNotifications = this.notifications$.value;
    const notificationIndex = currentNotifications.findIndex(n => n.id === id);
    
    if (notificationIndex !== -1) {
      const updatedNotifications = [...currentNotifications];
      updatedNotifications[notificationIndex] = {
        ...updatedNotifications[notificationIndex],
        ...updates
      };
      this.notifications$.next(updatedNotifications);
    }
  }

  /**
   * Obtiene la configuración actual
   */
  getConfig(): NotificationConfig {
    return { ...this.config };
  }

  /**
   * Agrega una notificación al array
   */
  private addNotification(notification: Notification): void {
    const currentNotifications = this.notifications$.value;
    let updatedNotifications = [notification, ...currentNotifications];

    // Limitar el número máximo de notificaciones
    if (this.config.maxNotifications && updatedNotifications.length > this.config.maxNotifications) {
      updatedNotifications = updatedNotifications.slice(0, this.config.maxNotifications);
    }

    this.notifications$.next(updatedNotifications);
  }

  /**
   * Genera un ID único para la notificación
   */
  private generateId(): string {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Métodos de conveniencia para compatibilidad con MensajeService
   */
  setMensajeExitoso(message: string): void {
    this.success(message);
  }

  setMensajeErroneo(message: string): void {
    this.error(message);
  }

  /**
   * Observables para compatibilidad con MensajeService
   */
  get observableExito(): Observable<Notification[]> {
    return this.getNotifications();
  }

  get observableError(): Observable<Notification[]> {
    return this.getNotifications();
  }
}