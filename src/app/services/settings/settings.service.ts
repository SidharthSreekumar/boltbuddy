import { Injectable, WritableSignal, effect, signal } from '@angular/core';
import { units } from '../../shared/models/settingsdata.model';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  isLightModeSignal: WritableSignal<boolean> = signal(this.storage.retrieve('isLightMode') ?? false);
  currentUnitTypeSignal: WritableSignal<units> = signal(this.storage.retrieve('unitType') ?? 'metric'); // standard, metric, imperial

  constructor(private storage: LocalStorageService) {
    effect(() => {
      this.storage.store('isLightMode', this.isLightModeSignal());
      this.storage.store('unitType', this.currentUnitTypeSignal());
    })
  }

  getUnitSymbol(): string {
    switch (this.currentUnitTypeSignal()) {
      case 'standard':
        return 'K';
      case 'metric':
        return '°C';
      case 'imperial':
        return '°F';
      default:
        return '';
    }
  }
}
