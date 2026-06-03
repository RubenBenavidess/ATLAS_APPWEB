import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div [class]="getClasses()">
      @if (title()) {
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-[var(--text-primary)]">{{ title() }}</h3>
          @if (subtitle()) {
            <p class="text-sm text-[var(--text-secondary)] mt-2">{{ subtitle() }}</p>
          }
        </div>
      }
      <ng-content />
    </div>
  `,
})
export class CardComponent {
  readonly title = input('');
  readonly subtitle = input('');
  readonly padding = input<'none' | 'sm' | 'md' | 'lg'>('md');

  getClasses(): string {
    const paddings = {
      none: '',
      sm: 'p-5',
      md: 'p-8',
      lg: 'p-10',
    };

    return `card ${paddings[this.padding()]}`.trim();
  }
}
