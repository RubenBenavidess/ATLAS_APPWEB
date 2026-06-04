import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppConfigService } from '../services/app-config.service';
import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  SetPasswordRequest,
  ForgotPasswordRequest,
  ValidateTokenResponse,
} from './auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(AppConfigService);

  private get apiUrl(): string {
    return this.appConfig.apiUrl || environment.apiUrl;
  }

  login(request: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.apiUrl}/api/auth/login`,
      request
    );
  }

  logout(): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.apiUrl}/api/auth/logout`,
      {}
    );
  }

  register(request: RegisterRequest): Observable<ApiResponse<RegisterResponse>> {
    return this.http.post<ApiResponse<RegisterResponse>>(
      `${this.apiUrl}/api/auth/register`,
      request
    );
  }

  validateToken(token: string): Observable<ApiResponse<ValidateTokenResponse>> {
    return this.http.get<ApiResponse<ValidateTokenResponse>>(
      `${this.apiUrl}/api/auth/validar-token`,
      { params: { token } }
    );
  }

  setPassword(request: SetPasswordRequest): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.apiUrl}/api/auth/establecer-contrasenia`,
      request
    );
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.apiUrl}/api/auth/recuperar-contrasenia`,
      request
    );
  }

  resendActivation(correo: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.apiUrl}/api/auth/reenviar-activacion`,
      { correo }
    );
  }
}
