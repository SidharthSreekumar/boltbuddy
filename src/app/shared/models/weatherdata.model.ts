/**
 * Interface for weather data from OpenWeatherMap API
 *
 * ref: https://openweathermap.org/current
 */
export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Weather[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  rain?: { [key: string]: number }; // Optional rain property with string key for timestamp and number value for rain amount
  clouds: { all: number };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}
