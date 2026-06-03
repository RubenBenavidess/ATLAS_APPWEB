import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthUser, JwtPayload, LoginRequest } from './auth.models';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isLoading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    isAuthenticated: computed(() => !!state.token() && !!state.user()),
    userRole: computed(() => state.user()?.rol ?? null),
    userPolicies: computed(() => state.user()?.politicas ?? []),
  })),
  withMethods((store, authService = inject(AuthService), router = inject(Router)) => {
    const decodeToken = (token: string): AuthUser | null => {
      try {
        const payload = token.split('.')[1];
        const decoded: JwtPayload = JSON.parse(atob(payload));
        return {
          idUsuario: decoded.idUsuario,
          nombreUsuario: decoded.sub,
          rol: decoded.rol,
          politicas: decoded.politicas,
        };
      } catch {
        return null;
      }
    };

    const saveToken = (token: string): void => {
      localStorage.setItem('atlas_token', token);
    };

    const clearToken = (): void => {
      localStorage.removeItem('atlas_token');
    };

    const performLogout = (): void => {
      clearToken();
      patchState(store, { ...initialState });
      // Navegación explícita y única al login, reemplazando el historial
      // para evitar que el botón "Atrás" regrese a una ruta protegida.
      router.navigateByUrl('/login', { replaceUrl: true });
    };

    const loadStoredToken = (): void => {
      const storedToken = localStorage.getItem('atlas_token');
      if (storedToken) {
        const user = decodeToken(storedToken);
        if (user) {
          const payload: JwtPayload = JSON.parse(atob(storedToken.split('.')[1]));
          if (payload.exp * 1000 > Date.now()) {
            patchState(store, { token: storedToken, user });
          } else {
            clearToken();
          }
        }
      }
    };

    return {
      loadStoredToken,

      login: rxMethod<LoginRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((request) =>
            authService.login(request).pipe(
              tapResponse({
                next: (response) => {
                  const { token } = response.datos;
                  const user = decodeToken(token);
                  saveToken(token);
                  patchState(store, {
                    token,
                    user,
                    isLoading: false,
                    error: null,
                  });
                },
                error: (error: { error?: { mensaje?: string } }) => {
                  clearToken();
                  patchState(store, {
                    token: null,
                    user: null,
                    isLoading: false,
                    error: error.error?.mensaje ?? 'Error de autenticación',
                  });
                },
              })
            )
          )
        )
      ),

      logout: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() =>
            authService.logout().pipe(
              tapResponse({
                next: () => performLogout(),
                error: () => performLogout(),
              })
            )
          )
        )
      ),

      logoutLocal: () => {
        clearToken();
        patchState(store, { ...initialState });
      },

      clearError: () => {
        patchState(store, { error: null });
      },

      hasPolicy: (policy: string): boolean => {
        return store.userPolicies().includes(policy);
      },

      hasRole: (role: string): boolean => {
        return store.userRole() === role;
      },
    };
  })
);
