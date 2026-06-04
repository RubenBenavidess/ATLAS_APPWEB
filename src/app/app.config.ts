import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER, inject } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { errorInterceptor } from './core/http/error.interceptor';
import { AuthStore } from './core/auth/auth.store';
import { AppConfigService } from './core/services/app-config.service';

function initializeApp(): () => Promise<void> {
  // Capture injected dependencies synchronously (within injection context)
  const appConfigService = inject(AppConfigService);
  const authStore = inject(AuthStore);

  // Return the async initializer function
  return async () => {
    await appConfigService.load();
    authStore.loadStoredToken();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
    },
  ],
};
