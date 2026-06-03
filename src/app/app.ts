import { Component, inject, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from './core/auth/auth.store';
import { ToastContainerComponent } from './shared/components/ui-toast/toast-container.component';
import { ToastService } from './shared/components/ui-toast/toast.service';
import { ThemeService } from './core/theme/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent],
  template: `
    <app-toast-container />
    <router-outlet />
  `,
})
export class AppComponent {
  private readonly authStore = inject(AuthStore);
  private readonly toastService = inject(ToastService);
  private readonly themeService = inject(ThemeService);
  private welcomeShown = false;

  constructor() {
    effect(() => {
      const isAuthenticated = this.authStore.isAuthenticated();
      const user = this.authStore.user();
      
      if (isAuthenticated && user && !this.welcomeShown) {
        this.welcomeShown = true;
        this.toastService.success(`Bienvenido, ${user.nombreUsuario}`);
      }
    });
  }
}
