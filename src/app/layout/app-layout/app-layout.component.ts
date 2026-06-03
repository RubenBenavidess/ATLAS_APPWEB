import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="min-h-screen bg-[var(--bg-primary)]">
      <app-header
        [sidebarOpen]="sidebarOpen()"
        (toggleSidebar)="sidebarOpen.update(v => !v)"
      />
      <div class="flex pt-16">
        <app-sidebar [open]="sidebarOpen()" />
        <main
          class="flex-1 p-8 transition-all duration-300"
          [class.ml-64]="sidebarOpen()"
          [class.ml-0]="!sidebarOpen()"
        >
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AppLayoutComponent {
  readonly sidebarOpen = signal(true);

  constructor() {
    console.log('✅ AppLayoutComponent cargado correctamente');
  }
}
