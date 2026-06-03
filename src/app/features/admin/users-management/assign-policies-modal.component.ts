import { Component, inject, input, output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { PolicyService } from '../../../core/services/policy.service';
import { User } from '../../../core/models/user.model';
import { Policy } from '../../../core/models/policy.model';
import { ModalComponent } from '../../../shared/components/ui-modal/modal.component';
import { ButtonComponent } from '../../../shared/components/ui-button/button.component';
import { ToastService } from '../../../shared/components/ui-toast/toast.service';

@Component({
  selector: 'app-assign-policies-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  template: `
    <app-modal [open]="open()" title="Asignar Políticas" (closed)="closed.emit()">
      @if (isLoading()) {
        <div class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-atlas-teal"></div>
        </div>
      } @else {
        <div class="space-y-4">
          <p class="text-sm text-[var(--text-secondary)]">
            Selecciona las políticas que deseas asignar al usuario
            <strong class="text-[var(--text-primary)]">{{ user()?.nombreUsuario }}</strong>
          </p>

          <div class="space-y-2 max-h-96 overflow-y-auto">
            @for (policy of policies(); track policy.id) {
              <label class="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  [checked]="selectedPolicies().includes(policy.id)"
                  (change)="togglePolicy(policy.id)"
                  class="w-4 h-4 rounded border-[var(--border-color)] text-atlas-teal focus:ring-atlas-teal"
                />
                <div class="flex-1">
                  <p class="text-sm font-medium text-[var(--text-primary)]">
                    {{ policy.nombrePolitica }}
                  </p>
                  <p class="text-xs text-[var(--text-secondary)]">
                    Creada: {{ policy.fechaCreacion | date:'short' }}
                  </p>
                </div>
              </label>
            } @empty {
              <p class="text-center text-[var(--text-secondary)] py-8">
                No hay políticas disponibles
              </p>
            }
          </div>

          <div class="flex gap-3 justify-end pt-4 border-t border-[var(--border-color)]">
            <app-button variant="secondary" (clicked)="closed.emit()">
              Cancelar
            </app-button>
            <app-button
              variant="primary"
              [loading]="isSubmitting()"
              (clicked)="onSubmit()"
            >
              Guardar
            </app-button>
          </div>
        </div>
      }
    </app-modal>
  `,
})
export class AssignPoliciesModalComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly policyService = inject(PolicyService);
  private readonly toastService = inject(ToastService);

  readonly open = input(false);
  readonly user = input<User | null>(null);
  readonly closed = output<void>();
  readonly saved = output<void>();

  protected readonly policies = signal<Policy[]>([]);
  protected readonly selectedPolicies = signal<string[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly isSubmitting = signal(false);

  ngOnInit(): void {
    if (this.open()) {
      this.loadPolicies();
    }
  }

  loadPolicies(): void {
    this.isLoading.set(true);
    this.policyService.getPolicies().subscribe({
      next: (response) => {
        this.policies.set(response.datos);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.toastService.error('Error al cargar políticas');
        this.isLoading.set(false);
      },
    });
  }

  togglePolicy(policyId: string): void {
    const current = this.selectedPolicies();
    if (current.includes(policyId)) {
      this.selectedPolicies.set(current.filter(id => id !== policyId));
    } else {
      this.selectedPolicies.set([...current, policyId]);
    }
  }

  onSubmit(): void {
    const user = this.user();
    if (!user) return;

    this.isSubmitting.set(true);
    this.userService.assignPolicies(user.id, this.selectedPolicies()).subscribe({
      next: (response) => {
        const data = response.datos;
        if (data.politicasNuevas.length > 0) {
          this.toastService.success(`${data.politicasNuevas.length} políticas asignadas`);
        }
        if (data.politicasDuplicadas > 0) {
          this.toastService.warning(`${data.politicasDuplicadas} políticas ya estaban asignadas`);
        }
        this.isSubmitting.set(false);
        this.saved.emit();
      },
      error: (error) => {
        this.toastService.error(error.error?.mensaje || 'Error al asignar políticas');
        this.isSubmitting.set(false);
      },
    });
  }
}
