import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyService } from '../../../core/services/policy.service';
import { RolService } from '../../../core/services/rol.service';
import { Policy } from '../../../core/models/policy.model';
import { Rol } from '../../../core/models/rol.model';
import { ButtonComponent } from '../../../shared/components/ui-button/button.component';
import { CardComponent } from '../../../shared/components/ui-card/card.component';
import { ToastService } from '../../../shared/components/ui-toast/toast.service';
import { IconComponent } from '../../../shared/components/ui-icon/icon.component';

@Component({
  selector: 'app-policies-management',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent, IconComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-[var(--text-primary)]">Gestión de Políticas</h1>
        <p class="text-[var(--text-secondary)] mt-1">
          Administra las políticas de seguridad del sistema y asígnalas a roles
        </p>
      </div>

      <!-- Selector de Rol -->
      <app-card>
        <div class="space-y-3">
          <label class="block text-sm font-medium text-[var(--text-primary)]">
            Seleccionar Rol
          </label>
          <div class="flex flex-wrap gap-2">
            @for (rol of roles(); track rol.id) {
              <button
                (click)="selectRol(rol)"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                [class]="selectedRol()?.id === rol.id
                  ? 'bg-atlas-teal text-white shadow-md'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-atlas-teal/10 hover:text-atlas-teal dark:hover:text-atlas-sage'"
              >
                {{ rol.tipoRol }}
              </button>
            } @empty {
              <p class="text-sm text-[var(--text-secondary)]">Cargando roles...</p>
            }
          </div>
        </div>
      </app-card>

      @if (isLoading()) {
        <div class="flex justify-center py-12">
          <app-icon name="loader" size="lg" class="animate-spin text-atlas-teal" />
        </div>
      } @else if (selectedRol()) {
        <!-- Políticas asignadas al rol -->
        <div class="space-y-3">
          <h2 class="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <app-icon name="shield" class="text-atlas-teal dark:text-atlas-sage" />
            Políticas asignadas a {{ selectedRol()!.tipoRol }}
          </h2>

          @if (assignedPolicies().length === 0) {
            <app-card>
              <div class="text-center py-8">
                <app-icon name="shield" size="lg" class="mx-auto text-[var(--text-secondary)] mb-3" />
                <p class="text-[var(--text-secondary)]">Este rol no tiene políticas asignadas</p>
              </div>
            </app-card>
          } @else {
            <div class="space-y-2">
              @for (policy of assignedPolicies(); track policy.id) {
                <app-card>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <app-icon name="shield" class="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 class="font-semibold text-[var(--text-primary)] text-sm">
                          {{ policy.nombrePolitica }}
                        </h3>
                        <span class="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                          Asignada
                        </span>
                      </div>
                    </div>
                    <app-button
                      variant="danger"
                      size="sm"
                      icon="x"
                      [loading]="actionInProgress() === policy.id"
                      [disabled]="!!actionInProgress()"
                      (clicked)="desasignarPolitica(policy)"
                    >
                      Desasignar
                    </app-button>
                  </div>
                </app-card>
              }
            </div>
          }
        </div>

        <!-- Políticas disponibles para asignar -->
        <div class="space-y-3">
          <h2 class="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <app-icon name="shield" class="text-[var(--text-secondary)]" />
            Políticas disponibles para asignar
          </h2>

          @if (availablePolicies().length === 0) {
            <app-card>
              <div class="text-center py-8">
                <app-icon name="shield" size="lg" class="mx-auto text-[var(--text-secondary)] mb-3" />
                <p class="text-[var(--text-secondary)]">Todas las políticas ya están asignadas a este rol</p>
              </div>
            </app-card>
          } @else {
            <div class="space-y-2">
              @for (policy of availablePolicies(); track policy.id) {
                <app-card>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center">
                        <app-icon name="shield" class="text-[var(--text-secondary)]" />
                      </div>
                      <div>
                        <h3 class="font-semibold text-[var(--text-primary)] text-sm">
                          {{ policy.nombrePolitica }}
                        </h3>
                        <span class="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                          No asignada
                        </span>
                      </div>
                    </div>
                    <app-button
                      variant="primary"
                      size="sm"
                      icon="plus"
                      [loading]="actionInProgress() === policy.id"
                      [disabled]="!!actionInProgress()"
                      (clicked)="asignarPolitica(policy)"
                    >
                      Asignar
                    </app-button>
                  </div>
                </app-card>
              }
            </div>
          }
        </div>
      } @else {
        <app-card>
          <div class="text-center py-12">
            <app-icon name="shield" size="lg" class="mx-auto text-[var(--text-secondary)] mb-4" />
            <p class="text-[var(--text-secondary)]">Selecciona un rol para ver y administrar sus políticas</p>
          </div>
        </app-card>
      }
    </div>
  `,
})
export class PoliciesManagementComponent implements OnInit {
  private readonly policyService = inject(PolicyService);
  private readonly rolService = inject(RolService);
  private readonly toastService = inject(ToastService);

  protected readonly roles = signal<Rol[]>([]);
  protected readonly selectedRol = signal<Rol | null>(null);
  protected readonly allPolicies = signal<Policy[]>([]);
  protected readonly assignedPolicies = signal<Policy[]>([]);
  protected readonly isLoading = signal(false);
  /** Holds the ID of the policy currently being assigned/unassigned */
  protected readonly actionInProgress = signal<string | null>(null);

  protected readonly availablePolicies = () => {
    const assigned = this.assignedPolicies();
    const assignedIds = new Set(assigned.map(p => p.id));
    return this.allPolicies().filter(p => !assignedIds.has(p.id));
  };

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.rolService.getRoles().subscribe({
      next: (response) => {
        this.roles.set(response.datos ?? []);
      },
      error: () => {
        this.toastService.error('Error al cargar los roles');
      },
    });
  }

  selectRol(rol: Rol): void {
    this.selectedRol.set(rol);
    this.loadPoliciesForRol(rol.id);
  }

  loadPoliciesForRol(rolId: number): void {
    this.isLoading.set(true);

    // Load all policies and assigned policies in parallel
    this.policyService.listarPoliticas().subscribe({
      next: (response) => {
        this.allPolicies.set(response.datos ?? []);
      },
      error: () => {
        this.toastService.error('Error al cargar políticas del sistema');
        this.isLoading.set(false);
      },
    });

    this.policyService.listarPoliticasPorRol(rolId).subscribe({
      next: (response) => {
        this.assignedPolicies.set(response.datos ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastService.error('Error al cargar políticas del rol');
        this.assignedPolicies.set([]);
        this.isLoading.set(false);
      },
    });
  }

  asignarPolitica(policy: Policy): void {
    const rol = this.selectedRol();
    if (!rol) return;

    this.actionInProgress.set(policy.id);
    this.policyService.asignarPoliticaARol(rol.id, policy.id).subscribe({
      next: () => {
        this.toastService.success(`Política "${policy.nombrePolitica}" asignada correctamente`);
        this.actionInProgress.set(null);
        this.refreshPolicies();
      },
      error: () => {
        // Error message is already handled by the error interceptor
        this.actionInProgress.set(null);
      },
    });
  }

  desasignarPolitica(policy: Policy): void {
    const rol = this.selectedRol();
    if (!rol) return;

    this.actionInProgress.set(policy.id);
    this.policyService.desasignarPoliticaDeRol(rol.id, policy.id).subscribe({
      next: () => {
        this.toastService.success(`Política "${policy.nombrePolitica}" desasignada correctamente`);
        this.actionInProgress.set(null);
        this.refreshPolicies();
      },
      error: () => {
        // Error message is already handled by the error interceptor
        this.actionInProgress.set(null);
      },
    });
  }

  private refreshPolicies(): void {
    const rol = this.selectedRol();
    if (rol) {
      this.loadPoliciesForRol(rol.id);
    }
  }
}
