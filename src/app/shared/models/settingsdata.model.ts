export interface SettingsData {
  isLightMode: boolean, // true for light mode
  units: units
}


export type units = 'standard' | 'metric' | 'imperial';
