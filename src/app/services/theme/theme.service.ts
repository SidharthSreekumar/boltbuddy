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

  /**
   * Toggle the theme
   *
   * Remove the dark-theme class from the body if the light-theme class is present,
   * and vice-versa. This ensures that only one of the two theme classes are present
   * at any given time.
   *
   * @param isLightMode indicates if the light theme should be applied
   */
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
