import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

/* Material Imports */
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { ThemeService } from './services/theme/theme.service';
import { LightningCardComponent } from './components/lightning-card/lightning-card.component';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from './components/settings-dialog/settings-dialog.component';
import { SettingsService } from './services/settings/settings.service';
import { SettingsData } from './shared/models/settingsdata.model';
import { LocationService } from './services/location/location.service';
import { first } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    LightningCardComponent,
  ],
  providers: [ThemeService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  isLoading: boolean = false;
  isLightMode: boolean = false;

  constructor(
    private settingsService: SettingsService,
    public dialog: MatDialog,
    private themeService: ThemeService,
    private snackBar: MatSnackBar,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.themeService.toggleTheme(this.settingsService.isLightModeSignal());
  }

  /**
   * Opens the settings dialog popup.
   */
  openSettingsDialog() {
    let dialogRef = this.dialog.open(SettingsDialogComponent, {
      width: '90%',
      maxWidth: '600px',
      data: {
        isLightMode: this.settingsService.isLightModeSignal(),
        units: this.settingsService.currentUnitTypeSignal(),
      },
      panelClass: 'settings-panel'
    });

    /**
     * Updates the current temperature if any unit changes were made.
     */
    dialogRef.afterClosed().subscribe((data: SettingsData) => {
      if (data) {
        if (data.units !== this.settingsService.currentUnitTypeSignal()) {
          this.isLoading = true;
          this.settingsService.currentUnitTypeSignal.set(data.units);
          this.locationService
            .getCurrentPosition()
            .pipe(first())
            .subscribe({
              next: (position) => {
                this.locationService
                  .getCurrentTemperature(
                    position.coords.latitude,
                    position.coords.longitude
                  )
                  .pipe(first())
                  .subscribe(() => {
                    this.isLoading = false;
                  });
              },
              error: (error) => {
                this.snackBar.open('Unable to fetch current location', 'OK', {
                  panelClass: 'bolt-snackbar__warn',
                });
                this.isLoading = false;
              },
            });
        }
        this.settingsService.isLightModeSignal.set(data.isLightMode);
      }
    });
  }
}
