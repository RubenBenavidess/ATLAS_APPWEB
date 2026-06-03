import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/components/ui-toast/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorMessage = error.error?.mensaje ?? getErrorMessage(error.status);

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
      return 'Solicitud inválida';
    case 403:
      return 'No tiene permisos para realizar esta acción';
    case 404:
      return 'Recurso no encontrado';
    case 409:
      return 'Conflicto con el estado actual';
    case 500:
      return 'Error interno del servidor';
    default:
      return 'Error inesperado';
  }
}
