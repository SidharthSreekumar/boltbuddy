import { DOCUMENT } from '@angular/common';
import {
  Inject,
  Injectable,
  Renderer2,
  WritableSignal,
  effect,
  signal,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  isLightModeSignal: WritableSignal<boolean> = signal(false);

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    effect(() => {
      this.toggleTheme(this.isLightModeSignal());
    });
  }

  toggleTheme(isLightMode: boolean) {
    if (!this.document) return;
    if (isLightMode) {
      if (this.document.body.classList.contains('dark-theme')) {
        this.renderer.removeClass(this.document.body, 'dark-theme');
      }
      this.renderer.addClass(this.document.body, 'light-theme');
    } else {
      if (this.document.body.classList.contains('light-theme')) {
        this.renderer.removeClass(this.document.body, 'light-theme');
      }
      this.renderer.addClass(this.document.body, 'dark-theme');
    }
  }
}
