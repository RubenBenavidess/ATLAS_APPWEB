import { Component, input, output } from '@angular/core';
import { IconComponent } from '../ui-icon/icon.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [IconComponent],
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" (click)="closeable() && closed.emit()"></div>
        <div class="relative bg-[var(--bg-card)] rounded-lg shadow-xl border border-[var(--border-color)] w-full max-w-lg max-h-[90vh] overflow-auto">
          <div class="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
            <h3 class="text-lg font-semibold text-[var(--text-primary)]">{{ title() }}</h3>
            @if (closeable()) {
              <button
                (click)="closed.emit()"
                class="p-1 rounded hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <app-icon name="x" class="text-[var(--text-secondary)]" />
              </button>
            }
          </div>
          <div class="p-4">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  readonly open = input(false);
  readonly title = input('');
  readonly closeable = input(true);
  readonly closed = output<void>();
}
