import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyService } from '../../../core/services/policy.service';
import { Policy } from '../../../core/models/policy.model';
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
          Administra las políticas de seguridad del sistema
        </p>
      </div>

      @if (isLoading()) {
        <div class="flex justify-center py-12">
          <app-icon name="loader" size="lg" class="animate-spin text-atlas-teal" />
        </div>
      } @else if (policies().length === 0) {
        <app-card>
          <div class="text-center py-12">
            <app-icon name="shield" size="lg" class="mx-auto text-[var(--text-secondary)] mb-4" />
            <p class="text-[var(--text-secondary)]">No hay políticas registradas</p>
          </div>
        </app-card>
      } @else {
        <div class="space-y-3">
          @for (policy of policies(); track policy.id) {
            <app-card>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-lg bg-atlas-teal/10 dark:bg-atlas-sage/20 flex items-center justify-center">
                    <app-icon name="shield" size="lg" class="text-atlas-teal dark:text-atlas-sage" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-[var(--text-primary)]">
                      {{ policy.nombrePolitica }}
                    </h3>
                    <p class="text-sm text-[var(--text-secondary)]">
                      Creada: {{ policy.fechaCreacion | date:'medium' }}
                    </p>
                  </div>
                </div>
              </div>
            </app-card>
          }
        </div>
      }
    </div>
  `,
})
export class PoliciesManagementComponent implements OnInit {
  private readonly policyService = inject(PolicyService);
  private readonly toastService = inject(ToastService);

  protected readonly policies = signal<Policy[]>([]);
  protected readonly isLoading = signal(true);

  ngOnInit(): void {
    this.loadPolicies();
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
}
