import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  constructor() { }

  /**
   * Show a success toast
   */
  showSuccess(message: string, duration: number = 5000): void {
    this.showToast(message, 'success', duration);
  }

  /**
   * Show an error toast
   */
  showError(message: string, duration: number = 7000): void {
    this.showToast(message, 'error', duration);
  }

  /**
   * Show an info toast
   */
  showInfo(message: string, duration: number = 5000): void {
    this.showToast(message, 'info', duration);
  }

  /**
   * Show a warning toast
   */
  showWarning(message: string, duration: number = 6000): void {
    this.showToast(message, 'warning', duration);
  }

  /**
   * Show a toast with custom type
   */
  private showToast(message: string, type: ToastMessage['type'], duration: number): void {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const toast: ToastMessage = {
      id,
      message,
      type,
      duration
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    }
  }

  /**
   * Remove a specific toast
   */
  removeToast(id: string): void {
    const currentToasts = this.toastsSubject.value;
    const filteredToasts = currentToasts.filter(toast => toast.id !== id);
    this.toastsSubject.next(filteredToasts);
  }

  /**
   * Clear all toasts
   */
  clearAll(): void {
    this.toastsSubject.next([]);
  }
}
