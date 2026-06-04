import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/components/ui-toast/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorMessage = error.error?.mensaje ?? getErrorMessage(error.status);

      // Log errors to console in development for debugging
      console.error(`[HTTP Error ${error.status}]`, error.url, error.error);

      // Don't toast on 401 — the auth interceptor handles that
      if (error.status !== 401) {
        toastService.error(errorMessage);
      }

      return throwError(() => error);
    })
  );
};

function getErrorMessage(status: number): string {
  switch (status) {
    case 0:
      return 'No se pudo conectar con el servidor';
    case 400:
      return 'Error de validación en la solicitud';
    case 401:
      return 'Sesión expirada o no autenticada';
    case 403:
      return 'No tiene permisos para realizar esta acción';
    case 404:
      return 'Recurso no encontrado';
    case 409:
      return 'Conflicto: el recurso ya existe o ya fue asignado';
    case 500:
      return 'Error interno del servidor';
    default:
      return `Error inesperado (código ${status})`;
  }
}
