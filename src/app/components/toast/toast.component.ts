import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ToastService, ToastMessage } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div *ngFor="let toast of toasts" 
           [class]="getToastClasses(toast)"
           class="max-w-sm p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <i [class]="getIconClass(toast.type)" class="text-lg"></i>
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium">{{ toast.message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0">
            <button 
              (click)="removeToast(toast.id)"
              class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150">
              <i class="fas fa-times text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-enter {
      opacity: 0;
      transform: translateX(100%);
    }
    
    .toast-enter-active {
      opacity: 1;
      transform: translateX(0);
    }
    
    .toast-leave-active {
      opacity: 0;
      transform: translateX(100%);
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  toasts: ToastMessage[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toasts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(toasts => {
        this.toasts = toasts;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeToast(id: string): void {
    this.toastService.removeToast(id);
  }

  getToastClasses(toast: ToastMessage): string {
    const baseClasses = 'max-w-sm p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out';
    
    switch (toast.type) {
      case 'success':
        return baseClasses + ' bg-green-50 border border-green-200 text-green-800';
      case 'error':
        return baseClasses + ' bg-red-50 border border-red-200 text-red-800';
      case 'warning':
        return baseClasses + ' bg-yellow-50 border border-yellow-200 text-yellow-800';
      case 'info':
      default:
        return baseClasses + ' bg-blue-50 border border-blue-200 text-blue-800';
    }
  }

  getIconClass(type: ToastMessage['type']): string {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle text-green-500';
      case 'error':
        return 'fas fa-exclamation-circle text-red-500';
      case 'warning':
        return 'fas fa-exclamation-triangle text-yellow-500';
      case 'info':
      default:
        return 'fas fa-info-circle text-blue-500';
    }
  }
}
