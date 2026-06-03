import { Component, input, output } from '@angular/core';
import { IconComponent, IconName } from '../ui-icon/icon.component';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [IconComponent],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      [class]="getClasses()"
      (click)="clicked.emit($event)"
    >
      @if (loading()) {
        <app-icon name="loader" [size]="iconSize()" class="animate-spin" />
      } @else if (icon(); as icon) {
        <app-icon [name]="icon" [size]="iconSize()" />
      }
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly icon = input<IconName | null>(null);
  readonly clicked = output<MouseEvent>();

  getClasses(): string {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-atlas-teal text-white hover:bg-atlas-navy focus:ring-atlas-teal',
      secondary: 'bg-atlas-sage text-atlas-navy hover:bg-atlas-cream focus:ring-atlas-sage',
      ghost: 'bg-transparent text-atlas-teal hover:bg-atlas-cream focus:ring-atlas-teal dark:text-atlas-sage dark:hover:bg-atlas-teal',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return `${base} ${variants[this.variant()]} ${sizes[this.size()]}`;
  }

  iconSize(): 'sm' | 'md' | 'lg' {
    return this.size() === 'sm' ? 'sm' : 'md';
  }
}
