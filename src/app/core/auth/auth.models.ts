export interface LoginRequest {
  nombreUsuario: string;
  contrasenia: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  idUsuario: string;
  nombreUsuario: string;
  rol: string;
}

export interface RegisterRequest {
  nombreUsuario: string;
  correo: string;
  nombre: string;
  apellido: string;
  rolId?: number;
}

export interface RegisterResponse {
  idUsuario: string;
  nombreUsuario: string;
  correo: string;
  nombreCompleto: string;
  rol: string;
  mensaje: string;
  fechaCreacion: string;
}

export interface SetPasswordRequest {
  token: string;
  nuevaContrasenia: string;
  confirmarContrasenia: string;
}

export interface ForgotPasswordRequest {
  correo: string;
}

export interface ValidateTokenResponse {
  valido: boolean;
  tipoToken: string;
  nombreUsuario: string;
  correo: string;
  fechaExpiracion: string;
  mensaje: string;
}

export interface ApiResponse<T> {
  status: number;
  mensaje: string;
  datos: T;
  errores?: string[];
  timestamp: string;
}

export interface AuthUser {
  idUsuario: string;
  nombreUsuario: string;
  rol: string;
  politicas: string[];
}

export interface JwtPayload {
  sub: string;
  idUsuario: string;
  rol: string;
  politicas: string[];
  iat: number;
  exp: number;
}
