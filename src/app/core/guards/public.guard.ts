import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthStore } from '../auth/auth.store';

export const publicGuard: CanMatchFn = () => {
  const authStore = inject(AuthStore);

  // Solo permite el match si el usuario NO está autenticado.
  // Si está autenticado, retorna false para que el router
  // continúe evaluando la siguiente ruta (la del authGuard).
  // NO redirigimos aquí para evitar loops de navegación.
  return !authStore.isAuthenticated();
};
