import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppConfigService } from './app-config.service';
import { ApiResponse } from '../auth/auth.models';
import { Policy } from '../models/policy.model';

@Injectable({
  providedIn: 'root',
})
export class PolicyService {
  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(AppConfigService);

  private get apiUrl(): string {
    return this.appConfig.apiUrl || environment.apiUrl;
  }

  /** Listar todas las políticas del sistema */
  listarPoliticas(): Observable<ApiResponse<Policy[]>> {
    return this.http.get<ApiResponse<Policy[]>>(`${this.apiUrl}/api/politicas`);
  }

  /** Listar políticas asignadas a un rol */
  listarPoliticasPorRol(rolId: number): Observable<ApiResponse<Policy[]>> {
    return this.http.get<ApiResponse<Policy[]>>(
      `${this.apiUrl}/api/politicas/rol/${rolId}`
    );
  }

  /** Asignar una política a un rol */
  asignarPoliticaARol(rolId: number, politicaId: string): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(
      `${this.apiUrl}/api/politicas/rol/${rolId}/asignar`,
      { politicaId }
    );
  }

  /** Desasignar una política de un rol */
  desasignarPoliticaDeRol(rolId: number, politicaId: string): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(
      `${this.apiUrl}/api/politicas/rol/${rolId}/desasignar/${politicaId}`
    );
  }

  /**
   * @deprecated Use listarPoliticas() instead. Kept for backward compatibility.
   */
  getPolicies(): Observable<ApiResponse<Policy[]>> {
    return this.listarPoliticas();
  }
}
