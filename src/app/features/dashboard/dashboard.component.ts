import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../core/auth/auth.store';
import { CardComponent } from '../../shared/components/ui-card/card.component';
import { IconComponent } from '../../shared/components/ui-icon/icon.component';
import { ButtonComponent } from '../../shared/components/ui-button/button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [IconComponent, CardComponent, ButtonComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-[var(--text-primary)]">Dashboard</h1>
        <p class="text-[var(--text-secondary)] mt-1">
          Bienvenido, {{ authStore.user()?.nombreUsuario }}
        </p>
      </div>

      @if (isAdmin()) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <app-card class="cursor-pointer hover:shadow-lg transition-shadow" (click)="navigateTo('/admin/usuarios')">
            <div class="flex flex-col items-center text-center py-8">
              <div class="w-20 h-20 rounded-full bg-atlas-teal/10 dark:bg-atlas-sage/20 flex items-center justify-center mb-4">
                <app-icon name="users" size="xl" class="text-atlas-teal dark:text-atlas-sage" />
              </div>
              <h3 class="text-xl font-semibold text-[var(--text-primary)] mb-2">
                Gestión de Usuarios
              </h3>
              <p class="text-[var(--text-secondary)] mb-4">
                Administra usuarios, roles y permisos del sistema
              </p>
              <app-button variant="primary" size="sm">
                Administrar
              </app-button>
            </div>
          </app-card>

          <app-card class="cursor-pointer hover:shadow-lg transition-shadow" (click)="navigateTo('/admin/politicas')">
            <div class="flex flex-col items-center text-center py-8">
              <div class="w-20 h-20 rounded-full bg-atlas-teal/10 dark:bg-atlas-sage/20 flex items-center justify-center mb-4">
                <app-icon name="shield" size="xl" class="text-atlas-teal dark:text-atlas-sage" />
              </div>
              <h3 class="text-xl font-semibold text-[var(--text-primary)] mb-2">
                Gestión de Políticas
              </h3>
              <p class="text-[var(--text-secondary)] mb-4">
                Administra las políticas de seguridad del sistema
              </p>
              <app-button variant="primary" size="sm">
                Administrar
              </app-button>
            </div>
          </app-card>
        </div>
      }

    </div>
  `,
})
export class DashboardComponent {
  private readonly router = inject(Router);
  protected readonly authStore = inject(AuthStore);

  protected isAdmin(): boolean {
    return this.authStore.hasRole('ADMIN');
  }

  protected navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
