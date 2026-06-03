import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/ui-button/button.component';
import { ThemeService } from '../../core/theme/theme.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  template: `
    <div class="min-h-screen bg-[var(--bg-primary)]">
      <!-- Header -->
      <header class="bg-atlas-teal dark:bg-atlas-navy text-white py-4 px-6">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          <div class="flex items-center gap-3">
            <img [src]="themeService.isDark() ? 'logo-placeholder-dark.png' : 'logo-placeholder-light.png'" alt="ATLAS" class="h-10" />
            <h1 class="text-2xl font-bold">ATLAS</h1>
          </div>
          <div class="flex gap-3">
            <app-button routerLink="/login" variant="ghost" size="sm">
              Iniciar Sesión
            </app-button>
            <app-button routerLink="/registro" variant="secondary" size="sm">
              Registrarse
            </app-button>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <main class="max-w-7xl mx-auto px-6 py-16">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-bold text-[var(--text-primary)] mb-6">
            Herramienta Adaptativa para<br />
            Auditoría Legislativa y Estándares
          </h2>
          <p class="text-xl text-[var(--text-secondary)] mb-8 max-w-3xl mx-auto">
            Plataforma integral para gestionar evaluaciones de cumplimiento normativo,
            seguimiento de normas y generación de reportes detallados.
          </p>
          <div class="flex gap-4 justify-center">
            <app-button routerLink="/registro" variant="primary" size="lg">
              Comenzar Ahora
            </app-button>
            <app-button routerLink="/login" variant="secondary" size="lg">
              Iniciar Sesión
            </app-button>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div class="card p-8">
            <div class="w-12 h-12 bg-atlas-teal/10 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-atlas-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-[var(--text-primary)] mb-3">Gestión de Normas</h3>
            <p class="text-[var(--text-secondary)]">
              Administra y organiza todas las normas legislativas y estándares de cumplimiento en un solo lugar.
            </p>
          </div>

          <div class="card p-8">
            <div class="w-12 h-12 bg-atlas-teal/10 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-atlas-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-[var(--text-primary)] mb-3">Evaluaciones Detalladas</h3>
            <p class="text-[var(--text-secondary)]">
              Realiza evaluaciones completas de cumplimiento con seguimiento detallado de cada criterio.
            </p>
          </div>

          <div class="card p-8">
            <div class="w-12 h-12 bg-atlas-teal/10 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-atlas-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-[var(--text-primary)] mb-3">Reportes y Análisis</h3>
            <p class="text-[var(--text-secondary)]">
              Genera reportes detallados y visualiza el progreso de cumplimiento con gráficos interactivos.
            </p>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="mt-16 text-center bg-atlas-teal/5 dark:bg-atlas-sage/10 rounded-2xl p-12">
          <h3 class="text-3xl font-bold text-[var(--text-primary)] mb-4">
            ¿Listo para comenzar?
          </h3>
          <p class="text-lg text-[var(--text-secondary)] mb-6">
            Únete a las organizaciones que ya utilizan ATLAS para gestionar su cumplimiento normativo.
          </p>
          <app-button routerLink="/registro" variant="primary" size="lg">
            Crear Cuenta Gratuita
          </app-button>
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-atlas-navy text-white py-8 mt-16">
        <div class="max-w-7xl mx-auto px-6 text-center">
          <p class="text-sm text-gray-400">
            © 2026 ATLAS - Herramienta Adaptativa para Auditoría Legislativa y Estándares
          </p>
        </div>
      </footer>
    </div>
  `,
})
export class HomeComponent {
  protected readonly themeService = inject(ThemeService);
}
