import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthStore } from '../../../core/auth/auth.store';
import { AuthService } from '../../../core/auth/auth.service';
import { CardComponent } from '../../../shared/components/ui-card/card.component';
import { InputComponent } from '../../../shared/components/ui-input/input.component';
import { ButtonComponent } from '../../../shared/components/ui-button/button.component';
import { AlertComponent } from '../../../shared/components/ui-alert/alert.component';
import { ToastService } from '../../../shared/components/ui-toast/toast.service';

@Component({
  selector: 'app-login',
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
        Iniciar Sesión
      </h2>

      @if (authStore.error(); as error) {
        <app-alert type="error" [message]="error" class="mb-4" />
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <app-input
          formControlName="nombreUsuario"
          label="Usuario"
          placeholder="Ingresa tu usuario"
          icon="user"
          [error]="getFieldError('nombreUsuario')"
          class="block mb-3"
        />

        <app-input
          formControlName="contrasenia"
          label="Contraseña"
          type="password"
          placeholder="Ingresa tu contraseña"
          icon="lock"
          [error]="getFieldError('contrasenia')"
        />

        <div class="flex justify-end">
          <a routerLink="/recuperar-contrasena" class="text-sm text-atlas-teal dark:text-atlas-sage hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <app-button
          type="submit"
          variant="primary"
          size="lg"
          [loading]="authStore.isLoading()"
          [disabled]="form.invalid"
          class="w-full"
        >
          Ingresar
        </app-button>
      </form>

      <p class="text-center text-sm text-[var(--text-secondary)] mt-6">
        ¿No tienes cuenta?
        <a routerLink="/registro" class="text-atlas-teal dark:text-atlas-sage hover:underline font-medium">
          Regístrate
        </a>
      </p>
    </app-card>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  protected readonly authStore = inject(AuthStore);
  protected isLoading = false;

  protected readonly form = this.fb.nonNullable.group({
    nombreUsuario: ['', [Validators.required, Validators.maxLength(10)]],
    contrasenia: ['', [Validators.required]],
  });

  getFieldError(field: string): string {
    const control = this.form.get(field);
    if (!control?.touched || !control.errors) return '';

    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const credentials = this.form.getRawValue();

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        const { token } = response.datos!;
        
        // Guardar token en localStorage
        localStorage.setItem('atlas_token', token);
        
        // Decodificar token y actualizar store
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = {
          idUsuario: payload.idUsuario,
          nombreUsuario: payload.sub,
          rol: payload.rol,
          politicas: payload.politicas,
        };
        
        // Actualizar el store manualmente
        (this.authStore as any).token.set(token);
        (this.authStore as any).user.set(user);
        
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.toastService.error(error.error?.mensaje || 'Error de autenticación');
      },
    });
  }
}
