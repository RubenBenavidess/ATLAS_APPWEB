import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from './auth.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const token = authStore.token();

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // No interceptar 401 en peticiones de logout para evitar un loop:
      // el logout ya maneja su propia limpieza de estado y navegación.
      const isLogoutRequest = req.url.includes('/api/auth/logout');
      if (error.status === 401 && !isLogoutRequest) {
        authStore.logoutLocal();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
