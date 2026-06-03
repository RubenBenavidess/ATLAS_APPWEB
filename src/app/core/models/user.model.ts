export interface User {
  id: string;
  nombreUsuario: string;
  correo: string;
  nombre: string;
  apellido: string;
  rolId: number;
  tipoRol: string;
  descripcionRol: string;
  activo: boolean;
  fechaCreacion: string;
  ultimaModificacion?: string;
  ultimaEvaluacion?: string;
}

export interface CreateUserRequest {
  nombreUsuario: string;
  correo: string;
  nombre: string;
  apellido: string;
  rolId: number;
  contrasenia: string;
}

export interface UpdateUserRequest {
  nombreUsuario: string;
  correo: string;
  nombre: string;
  apellido: string;
  rolId: number;
  contrasenia?: string;
}

export interface AssignPoliciesResponse {
  nombreUsuario: string;
  tipoRol: string;
  politicasAsignadas: number;
  politicasDuplicadas: number;
  politicasNuevas: string[];
  politicasYaExistentes: string[];
}
