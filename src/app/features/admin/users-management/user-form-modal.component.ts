import { Component, inject, input, output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User, CreateUserRequest, UpdateUserRequest } from '../../../core/models/user.model';
import { ModalComponent } from '../../../shared/components/ui-modal/modal.component';
import { InputComponent } from '../../../shared/components/ui-input/input.component';
import { ButtonComponent } from '../../../shared/components/ui-button/button.component';
import { ToastService } from '../../../shared/components/ui-toast/toast.service';

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent, InputComponent, ButtonComponent],
  template: `
    <app-modal [open]="open()" [title]="user() ? 'Editar Usuario' : 'Crear Usuario'" (closed)="closed.emit()">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <div class="grid grid-cols-2 gap-4 block ">
          <app-input
            formControlName="nombre"
            label="Nombre"
            placeholder="Nombre"
            [error]="getFieldError('nombre')"
          />
          <app-input
            formControlName="apellido"
            label="Apellido"
            placeholder="Apellido"
            [error]="getFieldError('apellido')"
          />
        </div>

        <app-input
          formControlName="nombreUsuario"
          label="Nombre de Usuario"
          placeholder="nombre.usuario"
          [error]="getFieldError('nombreUsuario')"
          class="block"
        />

        <app-input
          formControlName="correo"
          label="Correo Electrónico"
          type="email"
          placeholder="usuario@ejemplo.com"
          [error]="getFieldError('correo')"
          class="block"
        />

        <div class="block">
          <label class="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Rol
          </label>
          <select
            formControlName="rolId"
            class="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-atlas-teal"
          >
            <option value="2">CONSULTOR</option>
            <option value="3">GESTOR_NORMAS</option>
          </select>
        </div>

        <app-input
          formControlName="contrasenia"
          label="Contraseña"
          type="password"
          placeholder="Mínimo 8 caracteres"
          [error]="getFieldError('contrasenia')"
          [hint]="user() ? 'Dejar vacío para no cambiar' : ''"
          class="block"
        />

        <div class="flex gap-3 justify-end pt-4">
          <app-button variant="secondary" (clicked)="closed.emit()">
            Cancelar
          </app-button>
          <app-button
            type="submit"
            variant="primary"
            [loading]="isSubmitting()"
            [disabled]="form.invalid"
          >
            {{ user() ? 'Actualizar' : 'Crear' }}
          </app-button>
        </div>
      </form>
    </app-modal>
  `,
})
export class UserFormModalComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  readonly open = input(false);
  readonly user = input<User | null>(null);
  readonly closed = output<void>();
  readonly saved = output<void>();

  protected readonly isSubmitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(40)]],
    apellido: ['', [Validators.required, Validators.maxLength(40)]],
    nombreUsuario: ['', [Validators.required, Validators.maxLength(10)]],
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    rolId: [2, [Validators.required]],
    contrasenia: [''],
  });

  ngOnInit(): void {
    const user = this.user();
    if (user) {
      this.form.patchValue({
        nombre: user.nombre,
        apellido: user.apellido,
        nombreUsuario: user.nombreUsuario,
        correo: user.correo,
        rolId: user.rolId,
      });
    } else {
      this.form.reset({
        nombre: '',
        apellido: '',
        nombreUsuario: '',
        correo: '',
        rolId: 2,
        contrasenia: '',
      });
    }
  }

  getFieldError(field: string): string {
    const control = this.form.get(field);
    if (!control?.touched || !control.errors) return '';

    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['email']) return 'Correo electrónico inválido';
    if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const user = this.user();
    const formData = this.form.getRawValue();

    if (user) {
      const updateData: UpdateUserRequest = {
        nombreUsuario: formData.nombreUsuario,
        correo: formData.correo,
        nombre: formData.nombre,
        apellido: formData.apellido,
        rolId: formData.rolId,
      };

      if (formData.contrasenia && formData.contrasenia.trim()) {
        updateData.contrasenia = formData.contrasenia;
      }

      this.userService.updateUser(user.id, updateData).subscribe({
        next: () => {
          this.toastService.success('Usuario actualizado correctamente');
          this.isSubmitting.set(false);
          this.saved.emit();
        },
        error: (error) => {
          this.toastService.error(error.error?.mensaje || 'Error al actualizar usuario');
          this.isSubmitting.set(false);
        },
      });
    } else {
      if (!formData.contrasenia || !formData.contrasenia.trim()) {
        this.toastService.error('La contraseña es obligatoria para nuevos usuarios');
        this.isSubmitting.set(false);
        return;
      }

      const createData: CreateUserRequest = {
        nombreUsuario: formData.nombreUsuario,
        correo: formData.correo,
        nombre: formData.nombre,
        apellido: formData.apellido,
        rolId: formData.rolId,
        contrasenia: formData.contrasenia,
      };

      this.userService.createUser(createData).subscribe({
        next: () => {
          this.toastService.success('Usuario creado correctamente');
          this.isSubmitting.set(false);
          this.saved.emit();
        },
        error: (error) => {
          this.toastService.error(error.error?.mensaje || 'Error al crear usuario');
          this.isSubmitting.set(false);
        },
      });
    }
  }
}
