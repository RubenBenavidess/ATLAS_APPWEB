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
  selector: 'app-register',
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
      <h2 class="text-2xl font-semibold text-center mb-6 text-[var(--text-primary)]">
        Crear Cuenta
      </h2>

      @if (successMessage()) {
        <app-alert type="success" [message]="successMessage()" class="mb-4" />
        
        @if (resendMessage()) {
          <app-alert type="info" [message]="resendMessage()" class="mb-4" />
        }

        <div class="text-center mt-4">
          <p class="text-sm text-[var(--text-secondary)] mb-2">
            ¿No recibiste el correo de activación?
          </p>
          <button
            (click)="onResendActivation()"
            [disabled]="isResending() || resendCooldown() > 0"
            class="text-sm text-atlas-teal dark:text-atlas-sage hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
          >
            @if (isResending()) {
              Enviando...
            } @else if (resendCooldown() > 0) {
              Reenviar en {{ resendCooldown() }}s
            } @else {
              Reenviar correo de activación
            }
          </button>
        </div>
      }

      @if (errorMessage()) {
        <app-alert type="error" [message]="errorMessage()" class="mb-4" />
      }

      @if (!successMessage()) {
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-2 gap-4 mb-3">
            <app-input
              formControlName="nombre"
              label="Nombre"
              placeholder="Tu nombre"
              icon="user-circle"
              [error]="getFieldError('nombre')"

            />

            <app-input
              formControlName="apellido"
              label="Apellido"
              placeholder="Tu apellido"
              icon="user-circle"
              [error]="getFieldError('apellido')"
            />
          </div>

          <app-input
            formControlName="nombreUsuario"
            label="Usuario"
            placeholder="Elige un usuario"
            icon="user"
            [error]="getFieldError('nombreUsuario')"
            hint="Máximo 10 caracteres"
            class="block"
          />

          <app-input
            formControlName="correo"
            label="Correo Electrónico"
            type="email"
            placeholder="tu@correo.com"
            icon="mail"
            [error]="getFieldError('correo')"
            class="block"
          />

          <app-button
            type="submit"
            variant="primary"
            size="lg"
            [loading]="isLoading()"
            [disabled]="form.invalid"
            class="w-full block"
          >
            Registrarse
          </app-button>
        </form>
      }

      <p class="text-center text-sm text-[var(--text-secondary)] mt-6">
        ¿Ya tienes cuenta?
        <a routerLink="/login" class="text-atlas-teal dark:text-atlas-sage hover:underline font-medium">
          Inicia sesión.
        </a>
      </p>
    </app-card>
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  protected readonly isLoading = signal(false);
  protected readonly successMessage = signal('');
  protected readonly errorMessage = signal('');
  protected readonly isResending = signal(false);
  protected readonly resendMessage = signal('');
  protected readonly resendCooldown = signal(0);
  protected readonly registeredEmail = signal('');

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(40)]],
    apellido: ['', [Validators.required, Validators.maxLength(40)]],
    nombreUsuario: ['', [Validators.required, Validators.maxLength(10)]],
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
  });

  getFieldError(field: string): string {
    const control = this.form.get(field);
    if (!control?.touched || !control.errors) return '';

    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['email']) return 'Correo electrónico inválido';
    if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.registeredEmail.set(response.datos!.correo);
        this.successMessage.set(
          `Cuenta creada exitosamente. Se ha enviado un correo a ${response.datos!.correo} para establecer tu contrasena.`
        );
        this.toastService.success('Registro exitoso');
        this.startCooldown();
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.mensaje ?? 'Error al registrar usuario');
      },
    });
  }

  onResendActivation(): void {
    if (this.resendCooldown() > 0 || this.isResending()) {
      return;
    }

    this.isResending.set(true);
    this.resendMessage.set('');

    this.authService.resendActivation(this.registeredEmail()).subscribe({
      next: () => {
        this.isResending.set(false);
        this.resendMessage.set('Correo de activacion reenviado exitosamente');
        this.toastService.success('Correo reenviado');
        this.startCooldown();
      },
      error: (error) => {
        this.isResending.set(false);
        this.resendMessage.set(error.error?.mensaje ?? 'Error al reenviar el correo');
        this.toastService.error('Error al reenviar');
      },
    });
  }

  private startCooldown(): void {
    this.resendCooldown.set(60);
    const interval = setInterval(() => {
      const current = this.resendCooldown();
      if (current <= 1) {
        clearInterval(interval);
        this.resendCooldown.set(0);
      } else {
        this.resendCooldown.set(current - 1);
      }
    }, 1000);
  }
}
