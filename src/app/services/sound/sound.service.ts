import { Injectable } from '@angular/core';
import { LocationService } from '../location/location.service';
import { SettingsService } from '../settings/settings.service';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  readonly speedOfSoundInAir: number = 331.3;
  readonly kelvin: number = 273.15;

  constructor(private locationService: LocationService, private settingsService: SettingsService) {}

  /**
   * Calculate the speed of sound at a given temperature
   *
   * The speed of sound is given by the equation:
   *   Speed = 331.3 \* sqrt(1 + (temperature + 273.15) / 273.15)
   *
   * Where temperature can be in Kelvin, Fahrenheit, or Celsius.
   *
   * @return speed - the speed of sound in air at the given temperature in meters per second (m/s)
   */
  getSpeed() {
    let kelvinTemp: number = 0; // Temperature in Kelvin
    let currentTemperature: number = Number(this.locationService.currentTemperature());
    // Converting temperature in various units to Kelvin
    if(this.settingsService.currentUnitTypeSignal() === 'imperial') {
      kelvinTemp = (currentTemperature - 32) * (5/9) + this.kelvin;
    }
    if(this.settingsService.currentUnitTypeSignal() === 'metric') {
      kelvinTemp = currentTemperature + this.kelvin;
    }
    if(this.settingsService.currentUnitTypeSignal() === 'standard') {
      kelvinTemp = currentTemperature;
    }
    let term = (1 + kelvinTemp) / this.kelvin; // temperature normalized to 0 degrees Celsius
    let speed = this.speedOfSoundInAir * Math.sqrt(term); // meters per second
    return speed;
  }
}
