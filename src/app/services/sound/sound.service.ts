import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  speedOfSoundInAir: number = 331.3;
  kelvin: number = 273.15;

  constructor() {}

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
  getSpeed(temperature: number) {
    const kelvinTemp = temperature + this.kelvin; // temperature in Kelvin
    const term = 1 + kelvinTemp / this.kelvin; // temperature normalized to 0 degrees Celsius
    const speed = this.speedOfSoundInAir * Math.sqrt(term); // meters per second
    return speed;
  }
}

