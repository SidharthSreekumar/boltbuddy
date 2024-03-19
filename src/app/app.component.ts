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
export class AppComponent implements OnInit {
  isLightMode: boolean = false;


  constructor(
    private settingsService: SettingsService,
    public dialog: MatDialog,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.toggleTheme(this.settingsService.isLightModeSignal());
  }

  openSettingsDialog() {
    let dialogRef = this.dialog.open(SettingsDialogComponent, {
      width: '90%',
      maxWidth: '600px',
      data: {
        isLightMode: this.settingsService.isLightModeSignal(),
        units: this.settingsService.currentUnitTypeSignal(),
      },
    });

    dialogRef.afterClosed().subscribe((data: SettingsData ) => {
      if(data) {
         this.settingsService.currentUnitTypeSignal.set(data.units);
         this.settingsService.isLightModeSignal.set(data.isLightMode);
      }
    });
  }


}
