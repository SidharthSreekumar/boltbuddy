import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

/* Material Imports */
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { ThemeService } from './services/theme/theme.service';
import { LightningCardComponent } from './components/lightning-card/lightning-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    LightningCardComponent,
  ],
  providers: [ThemeService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isLightMode: boolean = false;

  constructor(private themeService: ThemeService) {}

  /**
   * Toggle the theme
   *
   * @returns void
   */
  toggleTheme() {
    this.isLightMode = !this.isLightMode;
    this.themeService.isLightModeSignal.set(this.isLightMode);
  }
}
