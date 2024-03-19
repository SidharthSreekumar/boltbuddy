import { Component, OnDestroy, OnInit, effect } from '@angular/core';
// Material Imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { LocationService } from '../../services/location/location.service';
import { SoundService } from '../../services/sound/sound.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SettingsService } from '../../services/settings/settings.service';
import { units } from '../../shared/models/settingsdata.model';

@Component({
  selector: 'app-lightning-card',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatDividerModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './lightning-card.component.html',
  styleUrl: './lightning-card.component.scss',
})
export class LightningCardComponent implements OnInit, OnDestroy {
  isLightning: boolean = true; // true = lightning
  isLoading: boolean = false; // true = waiting for calculation
  isTempOverride: boolean = false;
  timeKeeper: Date = new Date();
  currentTemperature = new FormControl<number>(0);
  currentTempUnit: units = 'metric';
  currentTempSymbol: string = '';
  timeDifference: number = 0;
  boltDistance: number = 0;
  getCurrentPosition$?: Subscription;
  speedOfSound: number = 0;

  constructor(
    private locationService: LocationService,
    private soundService: SoundService,
    private settingsService: SettingsService,
    private snackBar: MatSnackBar
  ) {
    effect(() => {
      /**
       * If user has not overridden the temperature value,
       * set the temp from OpenWeatherMap API.
       */
      if (!this.isTempOverride) {
        this.currentTemperature.setValue(
          this.locationService.currentTemperature()
        );
      }

      this.currentTempUnit = this.settingsService.currentUnitTypeSignal();
      this.currentTempSymbol = this.settingsService.getUnitSymbol();
      // !TODO Look into this. Calling twice.
      this.fetchTemperature();
    });

    this.currentTemperature.valueChanges.subscribe((value) => {
      if (this.currentTemperature.dirty) {
        this.isTempOverride = true;
        this.locationService.currentTemperature.set(value ?? 0);
      }
    });
  }

  ngOnInit(): void {
    // Sets temperature on initial load.
    this.fetchTemperature();
  }

  /**
   * Start waiting for calculation
   *
   * Set the loading state to true, and the lightning state to false.
   * After 3 seconds, set the loading state to false, and the lightning state to true.
   *
   * @returns void
   */
  startWaiting(isStopping: boolean = false) {
    if (!isStopping) {
      this.timeKeeper = new Date();
      this.isLoading = true;
      this.isLightning = false;
    } else {
      this.timeDifference = new Date().getTime() - this.timeKeeper.getTime();
      this.boltDistance = Math.floor(
        (this.soundService.getSpeed() * this.timeDifference) / 1000
      );
      this.speedOfSound = Number(this.soundService.getSpeed());
      this.isLoading = false;
      this.isLightning = true;
    }
  }
  /**
   * Gets temperature based on user location
   * @param refresh if user clicked in refresh button next to temperature
   */
  fetchTemperature(refresh: boolean = false) {
    if (refresh) this.isTempOverride = false;
    this.getCurrentPosition$ = this.locationService
      .getCurrentPosition()
      .subscribe({
        next: (position) => {
          this.locationService
            .getCurrentTemperature(
              position.coords.latitude,
              position.coords.longitude
            )
            .subscribe({
              next: (temp) => {
                this.locationService.currentTemperature.set(temp);
                this.currentTemperature.setValue(
                  this.locationService.currentTemperature()
                );
              },
              error: () => {
                this.snackBar.open(
                  'Unable to fetch current temperature! Enter manually.',
                  'OK',
                  {
                    duration: 3000, // 3 sec
                  }
                );
              }
            });
        },
        error: (error) => {
          this.snackBar.open('Unable to fetch location! Enter temperature manually.', 'OK', {
            duration: 3000 // 3 sec
          })
        },
      });
  }

  ngOnDestroy(): void {
    this.getCurrentPosition$?.unsubscribe();
  }
}
