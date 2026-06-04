import { Component, inject, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyService } from '../../../core/services/policy.service';
import { User } from '../../../core/models/user.model';
import { Policy } from '../../../core/models/policy.model';
import { ModalComponent } from '../../../shared/components/ui-modal/modal.component';
import { ButtonComponent } from '../../../shared/components/ui-button/button.component';
import { IconComponent } from '../../../shared/components/ui-icon/icon.component';
import { ToastService } from '../../../shared/components/ui-toast/toast.service';

@Component({
  selector: 'app-assign-policies-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent, IconComponent],
  template: `
    <app-modal [open]="open()" title="Políticas del Rol" (closed)="closed.emit()">
      @if (isLoading()) {
        <div class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-atlas-teal"></div>
        </div>
      } @else {
        <div class="space-y-4">
          <p class="text-sm text-[var(--text-secondary)]">
            Políticas del rol
            <strong class="text-[var(--text-primary)]">{{ user()?.tipoRol }}</strong>
            (usuario: <strong class="text-[var(--text-primary)]">{{ user()?.nombreUsuario }}</strong>)
          </p>
          <p class="text-xs text-[var(--text-secondary)]">
            Nota: Las políticas se asignan al rol, no al usuario individual. Los cambios afectan a todos los usuarios con este rol.
          </p>

          <!-- Políticas asignadas -->
          @if (assignedPolicies().length > 0) {
            <div class="space-y-1">
              <p class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Asignadas
              </p>
              @for (policy of assignedPolicies(); track policy.id) {
                <div class="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                  <div class="flex items-center gap-3">
                    <app-icon name="shield" class="text-green-600 dark:text-green-400" />
                    <span class="text-sm font-medium text-[var(--text-primary)]">
                      {{ policy.nombrePolitica }}
                    </span>
                  </div>
                  <app-button
                    variant="danger"
                    size="sm"
                    icon="x"
                    [loading]="actionInProgress() === policy.id"
                    [disabled]="!!actionInProgress()"
                    (clicked)="desasignar(policy)"
                  >
                    Quitar
                  </app-button>
                </div>
              }
            </div>
          }

          <!-- Políticas disponibles -->
          @if (availablePolicies().length > 0) {
            <div class="space-y-1">
              <p class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Disponibles
              </p>
              @for (policy of availablePolicies(); track policy.id) {
                <div class="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                  <div class="flex items-center gap-3">
                    <app-icon name="shield" class="text-[var(--text-secondary)]" />
                    <span class="text-sm font-medium text-[var(--text-primary)]">
                      {{ policy.nombrePolitica }}
                    </span>
                  </div>
                  <app-button
                    variant="primary"
                    size="sm"
                    icon="plus"
                    [loading]="actionInProgress() === policy.id"
                    [disabled]="!!actionInProgress()"
                    (clicked)="asignar(policy)"
                  >
                    Asignar
                  </app-button>
                </div>
              }
            </div>
          }

          @if (assignedPolicies().length === 0 && availablePolicies().length === 0) {
            <p class="text-center text-[var(--text-secondary)] py-8">
              No hay políticas disponibles en el sistema
            </p>
          }

          <div class="flex justify-end pt-4 border-t border-[var(--border-color)]">
            <app-button variant="secondary" (clicked)="closed.emit()">
              Cerrar
            </app-button>
          </div>
        </div>
      }
    </app-modal>
  `,
})
export class AssignPoliciesModalComponent {
  private readonly policyService = inject(PolicyService);
  private readonly toastService = inject(ToastService);

  readonly open = input(false);
  readonly user = input<User | null>(null);
  readonly closed = output<void>();
  readonly saved = output<void>();

  protected readonly allPolicies = signal<Policy[]>([]);
  protected readonly assignedPolicies = signal<Policy[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly actionInProgress = signal<string | null>(null);

  protected readonly availablePolicies = () => {
    const assigned = this.assignedPolicies();
    const assignedIds = new Set(assigned.map(p => p.id));
    return this.allPolicies().filter(p => !assignedIds.has(p.id));
  };

  constructor() {
    // React to modal opening: load policies when it opens
    effect(() => {
      if (this.open() && this.user()) {
        this.loadPolicies();
      }
    });
  }

  loadPolicies(): void {
    const user = this.user();
    if (!user) return;

    this.isLoading.set(true);

    // Load all policies
    this.policyService.listarPoliticas().subscribe({
      next: (response) => {
        this.allPolicies.set(response.datos ?? []);
      },
      error: () => {
        this.toastService.error('Error al cargar políticas');
        this.isLoading.set(false);
      },
    });

    // Load assigned policies for the user's role
    this.policyService.listarPoliticasPorRol(user.rolId).subscribe({
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

  asignar(policy: Policy): void {
    const user = this.user();
    if (!user) return;

    this.actionInProgress.set(policy.id);
    this.policyService.asignarPoliticaARol(user.rolId, policy.id).subscribe({
      next: () => {
        this.toastService.success(`Política "${policy.nombrePolitica}" asignada al rol`);
        this.actionInProgress.set(null);
        this.loadPolicies();
        this.saved.emit();
      },
      error: () => {
        this.actionInProgress.set(null);
      },
    });
  }

  desasignar(policy: Policy): void {
    const user = this.user();
    if (!user) return;

    this.actionInProgress.set(policy.id);
    this.policyService.desasignarPoliticaDeRol(user.rolId, policy.id).subscribe({
      next: () => {
        this.toastService.success(`Política "${policy.nombrePolitica}" desasignada del rol`);
        this.actionInProgress.set(null);
        this.loadPolicies();
        this.saved.emit();
      },
      error: () => {
        this.actionInProgress.set(null);
      },
    });
  }
}
