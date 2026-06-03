import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  // 1. Rutas autenticadas: si el usuario tiene token, estas rutas hacen match primero
  {
    path: '',
    loadComponent: () =>
      import('./layout/app-layout/app-layout.component').then(
        (m) => m.AppLayoutComponent
      ),
    canMatch: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'admin/usuarios',
        loadComponent: () =>
          import('./features/admin/users-management/users-management.component').then(
            (m) => m.UsersManagementComponent
          ),
      },
      {
        path: 'admin/politicas',
        loadComponent: () =>
          import('./features/admin/policies-management/policies-management.component').then(
            (m) => m.PoliciesManagementComponent
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  // 2. Landing page: ruta exacta '/' para usuarios no autenticados
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    canMatch: [publicGuard],
  },
  // 3. Rutas públicas (login, registro, etc.): solo hacen match si NO está autenticado
  {
    path: '',
    loadComponent: () =>
      import('./layout/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    canMatch: [publicGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'registro',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
      {
        path: 'activar-cuenta',
        loadComponent: () =>
          import('./features/auth/activate/activate.component').then(
            (m) => m.ActivateComponent
          ),
      },
      {
        path: 'recuperar-contrasena',
        loadComponent: () =>
          import('./features/auth/forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent
          ),
      },
      {
        path: 'restablecer-contrasena',
        loadComponent: () =>
          import('./features/auth/reset-password/reset-password.component').then(
            (m) => m.ResetPasswordComponent
          ),
      },
    ],
  },
  // 4. Wildcard: redirige al root para re-evaluar guards
  { path: '**', redirectTo: '' },
];
