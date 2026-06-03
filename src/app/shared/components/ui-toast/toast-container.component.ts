import { Component, inject, signal } from '@angular/core';
import { ToastService } from './toast.service';
import { IconComponent } from '../ui-icon/icon.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      @for (toast of toastService.toastList(); track toast.id) {
        <div
          class="flex items-center gap-3 p-4 rounded-lg shadow-lg border animate-slide-in"
          [class]="getToastClasses(toast.type)"
        >
          <app-icon [name]="getIcon(toast.type)" size="md" class="shrink-0" />
          <span class="flex-1 text-sm">{{ toast.message }}</span>
          <button
            (click)="toastService.dismiss(toast.id)"
            class="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <app-icon name="x" size="sm" />
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }
  `],
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);

  getToastClasses(type: string): string {
    const base = 'backdrop-blur-sm';
    switch (type) {
      case 'success':
        return `${base} bg-green-50 dark:bg-green-900/90 border-green-200 dark:border-green-700 text-green-800 dark:text-green-100`;
      case 'error':
        return `${base} bg-red-50 dark:bg-red-900/90 border-red-200 dark:border-red-700 text-red-800 dark:text-red-100`;
      case 'warning':
        return `${base} bg-yellow-50 dark:bg-yellow-900/90 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-100`;
      default:
        return `${base} bg-blue-50 dark:bg-blue-900/90 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-100`;
    }
  }

  getIcon(type: string): 'check-circle' | 'x-circle' | 'alert-triangle' | 'info' {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'x-circle';
      case 'warning': return 'alert-triangle';
      default: return 'info';
    }
  }
}
