import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NotificationService, Notification } from '../../../core/services/notification.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast 
      position="top-right"
      [breakpoints]="{'920px': {width: '100%', right: '0', left: '0'}}"
      [showTransformOptions]="'translateY(-100%)'"
      [hideTransformOptions]="'translateY(-100%)'"
      [showTransitionOptions]="'300ms ease-out'"
      [hideTransitionOptions]="'250ms ease-in'">
    </p-toast>
  `,
  styles: [`
    :host {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 9999;
      pointer-events: none;
    }
    
    ::ng-deep .p-toast {
      pointer-events: auto;
    }
    
    ::ng-deep .p-toast .p-toast-message {
      margin: 0 0 1rem 0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border-radius: 8px;
      border: none;
    }
    
    ::ng-deep .p-toast .p-toast-message.p-toast-message-success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }
    
    ::ng-deep .p-toast .p-toast-message.p-toast-message-error {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }
    
    ::ng-deep .p-toast .p-toast-message.p-toast-message-warn {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
    }
    
    ::ng-deep .p-toast .p-toast-message.p-toast-message-info {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
    }
    
    ::ng-deep .p-toast .p-toast-message .p-toast-message-content {
      padding: 1rem 1.25rem;
    }
    
    ::ng-deep .p-toast .p-toast-message .p-toast-message-icon {
      font-size: 1.25rem;
      margin-right: 0.75rem;
    }
    
    ::ng-deep .p-toast .p-toast-message .p-toast-message-text {
      flex: 1;
    }
    
    ::ng-deep .p-toast .p-toast-message .p-toast-summary {
      font-weight: 600;
      font-size: 0.95rem;
      margin-bottom: 0.25rem;
    }
    
    ::ng-deep .p-toast .p-toast-message .p-toast-detail {
      font-size: 0.875rem;
      opacity: 0.95;
      line-height: 1.4;
    }
    
    ::ng-deep .p-toast .p-toast-message .p-toast-icon-close {
      color: rgba(255, 255, 255, 0.8);
      transition: color 0.2s ease;
    }
    
    ::ng-deep .p-toast .p-toast-message .p-toast-icon-close:hover {
      color: white;
    }
    
    @media (max-width: 920px) {
      ::ng-deep .p-toast {
        width: 100% !important;
        left: 0 !important;
        right: 0 !important;
      }
      
      ::ng-deep .p-toast .p-toast-message {
        margin: 0 1rem 1rem 1rem;
      }
    }
  `]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private notificationService = inject(NotificationService);
  private messageService = inject(MessageService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.subscribeToNotifications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToNotifications(): void {
    this.notificationService.getNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        // Limpiar notificaciones anteriores
        this.messageService.clear();
        
        // Mostrar nuevas notificaciones
        notifications.forEach(notification => {
          this.showPrimeNGToast(notification);
        });
      });
  }

  private showPrimeNGToast(notification: Notification): void {
    const severity = this.mapNotificationTypeToPrimeNG(notification.type);
    
    this.messageService.add({
      key: notification.id,
      severity,
      summary: notification.title || this.getDefaultTitle(notification.type),
      detail: notification.message,
      life: notification.persistent ? 0 : (notification.duration || 5000),
      sticky: notification.persistent
    });
  }

  private mapNotificationTypeToPrimeNG(type: Notification['type']): string {
    const typeMap = {
      'success': 'success',
      'error': 'error',
      'warning': 'warn',
      'info': 'info'
    };
    
    return typeMap[type] || 'info';
  }

  private getDefaultTitle(type: Notification['type']): string {
    const titleMap = {
      'success': '¡Éxito!',
      'error': 'Error',
      'warning': 'Advertencia',
      'info': 'Información'
    };
    
    return titleMap[type] || 'Notificación';
  }
}