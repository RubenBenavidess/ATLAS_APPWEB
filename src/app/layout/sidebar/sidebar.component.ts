import { Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent, IconName } from '../../shared/components/ui-icon/icon.component';
import { AuthStore } from '../../core/auth/auth.store';

interface NavItem {
  label: string;
  route: string;
  icon: IconName;
  disabled?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  template: `
    <aside
      class="fixed left-0 top-16 bottom-0 w-64 bg-[var(--bg-card)] border-r border-[var(--border-color)] overflow-y-auto transition-transform duration-300 z-30"
      [class.-translate-x-full]="!open()"
    >
      <nav class="p-4">
        <p class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3 px-3">
          Principal
        </p>
        <ul class="space-y-1">
          @for (item of mainNav; track item.route) {
            <li>
              <a
                [routerLink]="item.disabled ? null : item.route"
                routerLinkActive="bg-atlas-teal/10 dark:bg-atlas-sage/20 text-atlas-teal dark:text-atlas-sage"
                class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:text-atlas-teal dark:hover:text-atlas-sage transition-colors"
                [class.opacity-50]="item.disabled"
                [class.cursor-not-allowed]="item.disabled"
              >
                <app-icon [name]="item.icon" />
                <span>{{ item.label }}</span>
                @if (item.disabled) {
                  <span class="ml-auto text-xs text-[var(--text-secondary)]">Próximamente</span>
                }
              </a>
            </li>
          }
        </ul>

        @if (isAdmin()) {
          <p class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3 px-3 mt-6">
            Administración
          </p>
          <ul class="space-y-1">
            @for (item of adminNav; track item.route) {
              <li>
                <a
                  [routerLink]="item.disabled ? null : item.route"
                  routerLinkActive="bg-atlas-teal/10 dark:bg-atlas-sage/20 text-atlas-teal dark:text-atlas-sage"
                  class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:text-atlas-teal dark:hover:text-atlas-sage transition-colors"
                  [class.opacity-50]="item.disabled"
                  [class.cursor-not-allowed]="item.disabled"
                >
                  <app-icon [name]="item.icon" />
                  <span>{{ item.label }}</span>
                  @if (item.disabled) {
                    <span class="ml-auto text-xs text-[var(--text-secondary)]">Próximamente</span>
                  }
                </a>
              </li>
            }
          </ul>
        }
      </nav>
    </aside>
  `,
})
export class SidebarComponent {
  private readonly authStore = inject(AuthStore);
  readonly open = input(true);

  readonly mainNav: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'layout-dashboard' },
    { label: 'Normas', route: '/normas', icon: 'file-text', disabled: true },
    { label: 'Evaluaciones', route: '/evaluaciones', icon: 'clipboard-check', disabled: true },
    { label: 'Reportes', route: '/reportes', icon: 'bar-chart', disabled: true },
  ];

  readonly adminNav: NavItem[] = [
    { label: 'Usuarios', route: '/admin/usuarios', icon: 'users' },
    { label: 'Políticas', route: '/admin/politicas', icon: 'shield' },
  ];

  protected isAdmin(): boolean {
    return this.authStore.hasRole('ADMIN');
  }
}
