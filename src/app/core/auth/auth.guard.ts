import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthStore } from './auth.store';

export const authGuard: CanMatchFn = () => {
  const authStore = inject(AuthStore);

  // canMatch debe retornar boolean, NO UrlTree.
  // false = "esta ruta no aplica, evalúa la siguiente definición de ruta"
  // Un UrlTree aquí causaría un redirect loop infinito.
  return authStore.isAuthenticated();
};

export const roleGuard = (requiredRole: string): CanMatchFn => {
  return () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (!authStore.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }

    if (authStore.hasRole(requiredRole)) {
      return true;
    }

    return router.createUrlTree(['/dashboard']);
  };
};

export const policyGuard = (requiredPolicy: string): CanMatchFn => {
  return () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (!authStore.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }

    if (authStore.hasPolicy(requiredPolicy)) {
      return true;
    }

    return router.createUrlTree(['/dashboard']);
  };
};
