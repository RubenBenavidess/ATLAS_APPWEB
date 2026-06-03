import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { CardComponent } from '../../../shared/components/ui-card/card.component';
import { InputComponent } from '../../../shared/components/ui-input/input.component';
import { ButtonComponent } from '../../../shared/components/ui-button/button.component';
import { AlertComponent } from '../../../shared/components/ui-alert/alert.component';
import { SpinnerComponent } from '../../../shared/components/ui-spinner/spinner.component';
import { IconComponent } from '../../../shared/components/ui-icon/icon.component';
import { ToastService } from '../../../shared/components/ui-toast/toast.service';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CardComponent,
    InputComponent,
    ButtonComponent,
    AlertComponent,
    SpinnerComponent,
    IconComponent,
  ],
  template: `
    <app-card>
      @if (isValidating()) {
        <div class="py-8">
          <app-spinner text="Validando token..." />
        </div>
      } @else if (!tokenValid()) {
        <app-alert
          type="error"
          title="Token inválido"
          [message]="errorMessage()"
        />
        <div class="mt-4 text-center">
          <a routerLink="/login" class="text-atlas-teal dark:text-atlas-sage hover:underline">
            Volver al inicio de sesión
          </a>
        </div>
      } @else if (success()) {
        <div class="text-center py-4">
          <app-icon name="check-circle" size="lg" class="text-green-500 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Cuenta activada
          </h3>
          <p class="text-[var(--text-secondary)] mb-4">
            Tu contraseña ha sido establecida exitosamente.
          </p>
          <a routerLink="/login" class="text-atlas-teal dark:text-atlas-sage hover:underline font-medium">
            Iniciar sesión
          </a>
        </div>
      } @else {
        <h2 class="text-2xl font-semibold text-center mb-2 text-[var(--text-primary)]">
          Establecer Contraseña
        </h2>
        <p class="text-center text-[var(--text-secondary)] mb-6 text-sm">
          Hola {{ username() }}, crea una contraseña segura para tu cuenta.
        </p>

        @if (errorMessage()) {
          <app-alert type="error" [message]="errorMessage()" class="mb-4" />
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <app-input
            formControlName="nuevaContrasenia"
            label="Nueva Contraseña"
            type="password"
            placeholder="Mínimo 8 caracteres"
            icon="lock"
            [error]="getPasswordError('nuevaContrasenia')"
            hint="Mínimo 8 caracteres, una mayúscula, una minúscula y un número"
          />

          <app-input
            formControlName="confirmarContrasenia"
            label="Confirmar Contraseña"
            type="password"
            placeholder="Repite tu contraseña"
            icon="lock"
            [error]="getConfirmError()"
          />

          <app-button
            type="submit"
            variant="primary"
            size="lg"
            [loading]="isLoading()"
            [disabled]="form.invalid"
            class="w-full"
          >
            Establecer Contraseña
          </app-button>
        </form>
      }
    </app-card>
  `,
})
export class ActivateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  protected readonly isValidating = signal(true);
  protected readonly tokenValid = signal(false);
  protected readonly success = signal(false);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly username = signal('');

  protected readonly form = this.fb.nonNullable.group({
    nuevaContrasenia: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/),
      ],
    ],
    confirmarContrasenia: ['', [Validators.required]],
  });

  private token = '';

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!this.token) {
      this.isValidating.set(false);
      this.tokenValid.set(false);
      this.errorMessage.set('Token no proporcionado');
      return;
    }

    this.authService.validateToken(this.token).subscribe({
      next: (response) => {
        this.isValidating.set(false);
        if (response.datos.valido) {
          this.tokenValid.set(true);
          this.username.set(response.datos.nombreUsuario);
        } else {
          this.tokenValid.set(false);
          this.errorMessage.set('El token no es valido');
        }
      },
      error: (error) => {
        this.isValidating.set(false);
        this.tokenValid.set(false);
        this.errorMessage.set(error.error?.mensaje ?? 'Token invalido o expirado');
      },
    });
  }

  getPasswordError(field: string): string {
    const control = this.form.get(field);
    if (!control?.touched || !control.errors) return '';

    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['minlength']) return 'Mínimo 8 caracteres';
    if (control.errors['pattern']) return 'Debe contener mayúscula, minúscula y número';
    return '';
  }

  getConfirmError(): string {
    const control = this.form.get('confirmarContrasenia');
    if (!control?.touched || !control.errors) {
      if (this.form.get('nuevaContrasenia')?.value !== this.form.get('confirmarContrasenia')?.value) {
        return 'Las contraseñas no coinciden';
      }
      return '';
    }

    if (control.errors['required']) return 'Este campo es obligatorio';
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { nuevaContrasenia, confirmarContrasenia } = this.form.getRawValue();
    if (nuevaContrasenia !== confirmarContrasenia) {
      this.errorMessage.set('Las contrasenas no coinciden');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService
      .setPassword({
        token: this.token,
        nuevaContrasenia,
        confirmarContrasenia,
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.success.set(true);
          this.toastService.success('Contrasena establecida exitosamente');
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.error?.mensaje ?? 'Error al establecer la contrasena');
        },
      });
  }
}
