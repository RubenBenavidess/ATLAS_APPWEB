import { Component, input } from '@angular/core';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span [class]="getClasses()">
      <ng-content />
    </span>
  `,
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('default');

  getClasses(): string {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    const variants: Record<BadgeVariant, string> = {
      default: 'bg-atlas-sage text-atlas-navy',
      success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
      error: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
      info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
    };

    return `${base} ${variants[this.variant()]}`;
  }
}
