import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../core/theme/theme.service';
import { AuthStore } from '../../core/auth/auth.store';
import { ButtonComponent } from '../../shared/components/ui-button/button.component';
import { BadgeComponent } from '../../shared/components/ui-badge/badge.component';
import { IconComponent } from '../../shared/components/ui-icon/icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, IconComponent, ButtonComponent, BadgeComponent],
  template: `
    <header class="fixed top-0 left-0 right-0 h-16 bg-atlas-teal dark:bg-atlas-navy border-b border-[var(--border-color)] z-40">
      <div class="flex items-center justify-between h-full px-4">
        <div class="flex items-center gap-4">
          <button
            (click)="toggleSidebar.emit()"
            class="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <app-icon name="menu" class="text-white" />
          </button>
          <a routerLink="/dashboard" class="flex items-center gap-2">
            <img [src]="themeService.isDark() ? 'logo-placeholder-dark.png' : 'logo-placeholder-light.png'" alt="ATLAS" class="h-8" />
          </a>
        </div>

        <div class="flex items-center gap-3">
          <app-badge variant="info">{{ authStore.userRole() }}</app-badge>

          <span class="text-white text-sm hidden sm:block">
            {{ authStore.user()?.nombreUsuario }}
          </span>

          <button
            (click)="themeService.toggle()"
            class="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            [title]="themeService.isDark() ? 'Modo claro' : 'Modo oscuro'"
          >
            <app-icon [name]="themeService.isDark() ? 'sun' : 'moon'" class="text-white" />
          </button>

          <app-button
            variant="ghost"
            size="sm"
            icon="logout"
            (clicked)="authStore.logout()"
          >
            <span class="hidden sm:inline">Salir</span>
          </app-button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host ::ng-deep .btn-ghost {
      color: white;
    }
    :host ::ng-deep .btn-ghost:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `],
})
export class HeaderComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly authStore = inject(AuthStore);

  readonly sidebarOpen = input(false);
  readonly toggleSidebar = output<void>();

  constructor() {
    console.log('✅ HeaderComponent cargado');
    console.log('Usuario autenticado:', this.authStore.user());
  }
}
