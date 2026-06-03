import { Component, input } from '@angular/core';
import { IconComponent, IconName } from '../ui-icon/icon.component';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div [class]="getClasses()" role="alert">
      <app-icon [name]="getIcon()" class="shrink-0" />
      <div class="flex-1">
        @if (title()) {
          <p class="font-medium">{{ title() }}</p>
        }
        <p [class]="title() ? 'text-sm mt-1' : ''">{{ message() }}</p>
      </div>
    </div>
  `,
})
export class AlertComponent {
  readonly type = input<AlertType>('info');
  readonly title = input('');
  readonly message = input('');

  getClasses(): string {
    const base = 'flex items-start gap-3 p-4 rounded-lg border';
    const types: Record<AlertType, string> = {
      success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
      error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
      warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
      info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    };

    return `${base} ${types[this.type()]}`;
  }

  getIcon(): IconName {
    const icons: Record<AlertType, IconName> = {
      success: 'check-circle',
      error: 'x-circle',
      warning: 'alert-triangle',
      info: 'info',
    };
    return icons[this.type()];
  }
}
