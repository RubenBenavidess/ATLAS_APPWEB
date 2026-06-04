import { Injectable } from '@angular/core';

export interface AppConfig {
  apiUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private config: AppConfig | null = null;

  /** Load config from assets/config.json at app startup */
  async load(): Promise<void> {
    try {
      const response = await fetch('/config.json');
      if (!response.ok) {
        console.warn(`[AppConfigService] config.json not found (status ${response.status}), using environment defaults`);
        return;
      }
      this.config = await response.json();
      console.info('[AppConfigService] Runtime config loaded:', this.config);
    } catch (error) {
      console.warn('[AppConfigService] Failed to load config.json, using environment defaults', error);
    }
  }

  /** Get the API base URL. Falls back to environment.apiUrl if runtime config is not loaded. */
  get apiUrl(): string {
    return this.config?.apiUrl ?? '';
  }

  /** Whether runtime config was successfully loaded */
  get isLoaded(): boolean {
    return this.config !== null;
  }
}
