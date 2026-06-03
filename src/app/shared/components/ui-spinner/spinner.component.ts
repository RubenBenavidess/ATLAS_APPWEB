import { Component, input } from '@angular/core';
import { IconComponent } from '../ui-icon/icon.component';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div [class]="getContainerClasses()">
      <app-icon name="loader" [size]="size()" class="animate-spin text-atlas-teal dark:text-atlas-sage" />
      @if (text()) {
        <span class="text-sm text-[var(--text-secondary)]">{{ text() }}</span>
      }
    </div>
  `,
})
export class SpinnerComponent {
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly text = input('');
  readonly overlay = input(false);

  getContainerClasses(): string {
    const base = 'flex flex-col items-center justify-center gap-2';
    return this.overlay()
      ? `${base} fixed inset-0 bg-black/50 z-50`
      : base;
  }
}
