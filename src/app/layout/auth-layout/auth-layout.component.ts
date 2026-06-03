import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ThemeService } from '../../core/theme/theme.service';
import { IconComponent } from '../../shared/components/ui-icon/icon.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, IconComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-6">
      <div class="w-full max-w-md">
        <div class="text-center mb-10">
          <img [src]="themeService.isDark() ? 'logo-placeholder-dark.png' : 'logo-placeholder-light.png'" alt="ATLAS" class="h-24 mx-auto mb-5" />
          <p class="text-[var(--text-secondary)] text-sm">
            Herramienta Adaptativa para Auditoría Legislativa y Estándares
          </p>
        </div>
        <router-outlet />
        <div class="text-center mt-6">
          <a routerLink="/" class="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-atlas-teal dark:hover:text-atlas-sage transition-colors">
            <app-icon name="layout-dashboard" size="sm" />
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  `,
})
export class AuthLayoutComponent {
  protected readonly themeService = inject(ThemeService);
}
