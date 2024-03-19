import { Injectable } from '@angular/core';
import { LocationService } from '../location/location.service';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  readonly speedOfSoundInAir: number = 331.3;
  readonly kelvin: number = 273.15;

  constructor(private locationService: LocationService) {}

  /**
   * Calculate the speed of sound at a given temperature
   *
   * The speed of sound is given by the equation:
   *   Speed = 331.3 \* sqrt(1 + (temperature + 273.15) / 273.15)
   *
   * Where temperature is in degrees Celsius.
   *
   * @param temperature the temperature in degrees Celsius
   * @return the speed of sound at the given temperature in meters per second
   */
  getSpeed() {
    let currentTemperature: number = Number(this.locationService.currentTemperature());
    let kelvinTemp: number = currentTemperature + this.kelvin; // temperature in Kelvin
    let term = (1 + kelvinTemp) / this.kelvin; // temperature normalized to 0 degrees Celsius
    let speed = this.speedOfSoundInAir * Math.sqrt(term); // meters per second
    return speed;
  }
}
