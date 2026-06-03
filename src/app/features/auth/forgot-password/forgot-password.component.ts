import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { CardComponent } from '../../../shared/components/ui-card/card.component';
import { InputComponent } from '../../../shared/components/ui-input/input.component';
import { ButtonComponent } from '../../../shared/components/ui-button/button.component';
import { AlertComponent } from '../../../shared/components/ui-alert/alert.component';
import { ToastService } from '../../../shared/components/ui-toast/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CardComponent,
    InputComponent,
    ButtonComponent,
    AlertComponent,
  ],
  template: `
    <app-card>
      <h2 class="text-2xl font-semibold text-center mb-2 text-[var(--text-primary)]">
        Recuperar Contraseña
      </h2>
      <p class="text-center text-[var(--text-secondary)] text-sm mb-6">
        Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
      </p>

      @if (successMessage()) {
        <app-alert type="success" [message]="successMessage()" class="mb-4" />
      }

      @if (!successMessage()) {
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <app-input
            formControlName="correo"
            label="Correo Electrónico"
            type="email"
            placeholder="tu@correo.com"
            icon="mail"
            [error]="getFieldError('correo')"
          />

          <app-button
            type="submit"
            variant="primary"
            size="lg"
            [loading]="isLoading()"
            [disabled]="form.invalid"
            class="w-full"
          >
            Enviar Enlace
          </app-button>
        </form>
      }

      <p class="text-center text-sm text-[var(--text-secondary)] mt-6">
        <a routerLink="/login" class="text-atlas-teal dark:text-atlas-sage hover:underline font-medium">
          Volver al inicio de sesión
        </a>
      </p>
    </app-card>
  `,
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  protected readonly isLoading = signal(false);
  protected readonly successMessage = signal('');

  protected readonly form = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
  });

  getFieldError(field: string): string {
    const control = this.form.get(field);
    if (!control?.touched || !control.errors) return '';

    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['email']) return 'Correo electrónico inválido';
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService.forgotPassword(this.form.getRawValue()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set(
          'Si el correo esta registrado, recibiras un enlace para restablecer tu contrasena.'
        );
        this.toastService.success('Solicitud enviada');
      },
      error: () => {
        this.isLoading.set(false);
        this.successMessage.set(
          'Si el correo esta registrado, recibiras un enlace para restablecer tu contrasena.'
        );
      },
    });
  }
}
