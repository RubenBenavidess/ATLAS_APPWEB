import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { ButtonComponent } from '../../../shared/components/ui-button/button.component';
import { CardComponent } from '../../../shared/components/ui-card/card.component';
import { ToastService } from '../../../shared/components/ui-toast/toast.service';
import { IconComponent } from '../../../shared/components/ui-icon/icon.component';
import { UserFormModalComponent } from './user-form-modal.component';
import { AssignPoliciesModalComponent } from './assign-policies-modal.component';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent,
    IconComponent,
    UserFormModalComponent,
    AssignPoliciesModalComponent,
  ],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-[var(--text-primary)]">Gestión de Usuarios</h1>
          <p class="text-[var(--text-secondary)] mt-1">
            Administra los usuarios del sistema
          </p>
        </div>
        <app-button variant="primary" icon="plus" (clicked)="openCreateModal()">
          Crear Usuario
        </app-button>
      </div>

      @if (isLoading()) {
        <div class="flex justify-center py-12">
          <app-icon name="loader" size="lg" class="animate-spin text-atlas-teal" />
        </div>
      } @else if (users().length === 0) {
        <app-card>
          <div class="text-center py-12">
            <app-icon name="users" size="lg" class="mx-auto text-[var(--text-secondary)] mb-4" />
            <p class="text-[var(--text-secondary)]">No hay usuarios registrados</p>
          </div>
        </app-card>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (user of users(); track user.id) {
            <app-card>
              <div class="space-y-4">
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-full bg-atlas-teal/10 dark:bg-atlas-sage/20 flex items-center justify-center">
                      <app-icon name="user" size="lg" class="text-atlas-teal dark:text-atlas-sage" />
                    </div>
                    <div>
                      <h3 class="font-semibold text-[var(--text-primary)]">
                        {{ user.nombre }} {{ user.apellido }}
                      </h3>
                      <p class="text-sm text-[var(--text-secondary)]">@{{ user.nombreUsuario }}</p>
                    </div>
                  </div>
                  <span class="px-2 py-1 text-xs rounded-full bg-atlas-sage/20 text-atlas-teal dark:text-atlas-sage">
                    {{ user.tipoRol }}
                  </span>
                </div>

                <div class="space-y-2 text-sm">
                  <div class="flex items-center gap-2 text-[var(--text-secondary)]">
                    <app-icon name="mail" size="sm" />
                    <span>{{ user.correo }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-[var(--text-secondary)]">
                    <app-icon name="calendar" size="sm" />
                    <span>Creado: {{ user.fechaCreacion | date:'short' }}</span>
                  </div>
                </div>

                <div class="flex gap-2 pt-2 border-t border-[var(--border-color)]">
                  @if (!isSystemAdmin(user)) {
                    <app-button
                      variant="secondary"
                      size="sm"
                      icon="edit"
                      (clicked)="openEditModal(user)"
                    >
                      Editar
                    </app-button>
                    <app-button
                      variant="danger"
                      size="sm"
                      icon="trash"
                      (clicked)="confirmDelete(user)"
                    >
                      Eliminar
                    </app-button>
                  }
                  <app-button
                    variant="ghost"
                    size="sm"
                    icon="shield"
                    (clicked)="openAssignPoliciesModal(user)"
                  >
                    Políticas
                  </app-button>
                </div>
              </div>
            </app-card>
          }
        </div>
      }
    </div>

    <app-user-form-modal
      [open]="showFormModal()"
      [user]="selectedUser()"
      (closed)="closeFormModal()"
      (saved)="onUserSaved()"
    />

    <app-assign-policies-modal
      [open]="showPoliciesModal()"
      [user]="selectedUser()"
      (closed)="closePoliciesModal()"
      (saved)="onPoliciesAssigned()"
    />

    @if (showDeleteConfirm()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" (click)="cancelDelete()"></div>
        <div class="relative bg-[var(--bg-card)] rounded-lg shadow-xl border border-[var(--border-color)] w-full max-w-md p-6">
          <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Confirmar Eliminación
          </h3>
          <p class="text-[var(--text-secondary)] mb-6">
            ¿Estás seguro de que deseas eliminar al usuario
            <strong>{{ userToDelete()?.nombre }} {{ userToDelete()?.apellido }}</strong>?
            Esta acción no se puede deshacer.
          </p>
          <div class="flex gap-3 justify-end">
            <app-button variant="secondary" (clicked)="cancelDelete()">
              Cancelar
            </app-button>
            <app-button variant="danger" (clicked)="deleteUser()">
              Eliminar
            </app-button>
          </div>
        </div>
      </div>
    }
  `,
})
export class UsersManagementComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  protected readonly users = signal<User[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly showFormModal = signal(false);
  protected readonly showPoliciesModal = signal(false);
  protected readonly showDeleteConfirm = signal(false);
  protected readonly selectedUser = signal<User | null>(null);
  protected readonly userToDelete = signal<User | null>(null);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users.set(response.datos);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.toastService.error('Error al cargar usuarios');
        this.isLoading.set(false);
      },
    });
  }

  openCreateModal(): void {
    this.selectedUser.set(null);
    this.showFormModal.set(true);
  }

  openEditModal(user: User): void {
    if (this.isSystemAdmin(user)) return;
    this.selectedUser.set(user);
    this.showFormModal.set(true);
  }

  closeFormModal(): void {
    this.showFormModal.set(false);
    this.selectedUser.set(null);
  }

  protected isSystemAdmin(user: User): boolean {
    return user.rolId === 1 || user.tipoRol?.toUpperCase() === 'ADMIN';
  }

  onUserSaved(): void {
    this.closeFormModal();
    this.loadUsers();
  }

  openAssignPoliciesModal(user: User): void {
    this.selectedUser.set(user);
    this.showPoliciesModal.set(true);
  }

  closePoliciesModal(): void {
    this.showPoliciesModal.set(false);
    this.selectedUser.set(null);
  }

  onPoliciesAssigned(): void {
    this.closePoliciesModal();
    this.toastService.success('Políticas asignadas correctamente');
  }

  confirmDelete(user: User): void {
    if (this.isSystemAdmin(user)) return;
    this.userToDelete.set(user);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.userToDelete.set(null);
  }

  deleteUser(): void {
    const user = this.userToDelete();
    if (!user) return;

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.toastService.success('Usuario eliminado correctamente');
        this.cancelDelete();
        this.loadUsers();
      },
      error: (error) => {
        this.toastService.error('Error al eliminar usuario');
        this.cancelDelete();
      },
    });
  }
}
