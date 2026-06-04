import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppConfigService } from './app-config.service';
import { ApiResponse } from '../auth/auth.models';
import { Rol } from '../models/rol.model';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(AppConfigService);

  private get apiUrl(): string {
    return this.appConfig.apiUrl || environment.apiUrl;
  }

  getRoles(): Observable<ApiResponse<Rol[]>> {
    return this.http.get<ApiResponse<Rol[]>>(`${this.apiUrl}/api/roles`);
  }
}
