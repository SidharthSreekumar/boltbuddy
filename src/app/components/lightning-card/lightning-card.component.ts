import { Component, Input, OnInit, effect } from '@angular/core';
// Material Imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LocationService } from '../../services/location/location.service';
import { SoundService } from '../../services/sound/sound.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription, first, throttleTime } from 'rxjs';
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
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './lightning-card.component.html',
  styleUrl: './lightning-card.component.scss',
})
export class LightningCardComponent implements OnInit {
  @Input() isLoading: boolean = false; // true = fetching data or processing
  isLightning: boolean = true; // true = lightning
  isTempOverride: boolean = false;
  timeKeeper: Date = new Date();
  currentTemperature = new FormControl<number>(0);
  currentTempUnit: units = 'metric';
  currentTempSymbol: string = '';
  timeDifference: number = 0;
  boltDistance: number = 0;
  getCurrentPosition$?: Subscription;
  speedOfSound: number = 0;
  buttonTimerRef!: NodeJS.Timeout; // Button timeout reference

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
    });

    this.currentTemperature.valueChanges
      .pipe(throttleTime(500))
      .subscribe((value) => {
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
   * Calculates and displays the storm distance.
   *
   * @param isStopping if true, button was pressed 2 times.
   */
  startWaiting(isStopping: boolean = false) {
    if (!isStopping) {
      this.timeKeeper = new Date();
      this.isLightning = false;
      this.buttonTimerRef = setTimeout(() => {
        this.isLightning = true;
      }, 15000); // Resets the state of button after 15 seconds.
    } else {
      if (this.buttonTimerRef) clearTimeout(this.buttonTimerRef);
      this.timeDifference = new Date().getTime() - this.timeKeeper.getTime();
      this.boltDistance = Math.floor(
        (this.soundService.getSpeed() * this.timeDifference) / 1000
      );
      this.speedOfSound = Number(this.soundService.getSpeed());
      this.isLightning = true;
    }
  }
  /**
   * Gets temperature based on user location
   * @param refresh if user clicked in refresh button next to temperature
   */
  fetchTemperature(refresh: boolean = false) {
    this.isLoading = true;
    if (refresh) this.isTempOverride = false;
    this.getCurrentPosition$ = this.locationService
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
            .subscribe({
              next: () => {
                this.currentTemperature.setValue(
                  this.locationService.currentTemperature()
                );
                this.isLoading = false;
              },
              error: () => {
                this.snackBar.open(
                  'Unable to fetch current temperature! Enter manually.',
                  'OK',
                  {
                    duration: 3000, // 3 sec
                    panelClass: 'bolt-snackbar__warn',
                  }
                );
              },
            });
        },
        error: (error) => {
          this.snackBar.open(
            'Unable to fetch location! Enter temperature manually.',
            'OK',
            {
              duration: 3000, // 3 sec
              panelClass: 'bolt-snackbar__warn',
            }
          );
        },
      });
  }

  /**
   * Returns the storm distance string based on current unit and size
   *
   * @param distance Distance at which the lightning struck
   * @returns {string} Modified distance value with unit
   */
  getBoltDistanceString(distance: number) {
    if (!distance) return 'Not Available';
    if (distance >= 1000) {
      if (this.settingsService.currentUnitTypeSignal() === 'imperial') {
        return (distance / 1609).toFixed(2).toString() + ' mi'; // convert to miles
      } else {
        return (distance / 1000).toFixed(2).toString() + ' km';
      }
    } else {
      if (this.settingsService.currentUnitTypeSignal() === 'imperial') {
        return (distance * 3.281).toFixed(2).toString() + ' ft'; //  convert to feet
      } else {
        return (distance).toFixed(2).toString() + ' m';
      }
    }
  }

  /**
   * Returns the speed of sound based on current unit
   *
   * @param speed Speed of sound in meter per second
   * @returns Modified speed value with unit
   */
  getSoundSpeedString(speed: number) {
    if (!speed) return 'Not Available';
    if (this.settingsService.currentUnitTypeSignal() === 'imperial') {
      return (speed * 3.281).toFixed(2).toString() + '  ft/s'; // convert to feet
    } else {
      return (speed).toFixed(2).toString() + ' m/s';
    }
  }
}
