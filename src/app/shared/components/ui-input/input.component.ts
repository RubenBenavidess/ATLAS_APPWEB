import { Component, input, model, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent, IconName } from '../ui-icon/icon.component';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="w-full">
      @if (label()) {
        <label [for]="id()" class="label">{{ label() }}</label>
      }
      <div class="relative">
        @if (icon(); as icon) {
          <div class="absolute left-3 inset-y-0 flex items-center pointer-events-none">
            <app-icon [name]="icon" class="text-[var(--text-secondary)]" />
          </div>
        }
        <input
          [id]="id()"
          [type]="showPassword() ? 'text' : type()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [class]="getInputClasses()"
          [value]="value()"
          (input)="onInput($event)"
          (blur)="onTouched()"
        />
        @if (type() === 'password') {
          <button
            type="button"
            class="absolute right-3 inset-y-0 flex items-center p-0 m-0 border-0 bg-transparent z-10 cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            (click)="showPassword.set(!showPassword())"
          >
            <app-icon [name]="showPassword() ? 'eye-off' : 'eye'" />
          </button>
        }
      </div>
      @if (error()) {
        <p class="error-text">{{ error() }}</p>
      }
      @if (hint() && !error()) {
        <p class="text-sm text-[var(--text-secondary)] mt-1">{{ hint() }}</p>
      }
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  readonly id = input('input-' + Math.random().toString(36).slice(2));
  readonly type = input<'text' | 'email' | 'password' | 'number'>('text');
  readonly label = input('');
  readonly placeholder = input('');
  readonly disabled = input(false);
  readonly error = input('');
  readonly hint = input('');
  readonly icon = input<IconName | null>(null);

  readonly value = model('');

  protected showPassword = model(false);

  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChange(value);
  }

  getInputClasses(): string {
    const base = 'input-field';
    const leftPad = this.icon() ? 'pl-10' : 'pl-4';
    const rightPad = this.type() === 'password' ? 'pr-10' : 'pr-4';
    const errorClass = this.error() ? 'input-error' : '';

    return `${base} ${leftPad} ${rightPad} ${errorClass}`.trim();
  }
}
