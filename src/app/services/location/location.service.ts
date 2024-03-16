import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, WritableSignal, signal } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { WeatherData } from '../../shared/models/weather.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  currentTemperature: WritableSignal<number> = signal(0);
  constructor(private http: HttpClient) {}

  getCurrentPosition(): Observable<any> {
    return new Observable((observer) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next(position);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {
        observer.error('Geolocation is not available in this platform.');
      }
    });
  }

  getCurrentTemperature(
    latitude: number,
    longitude: number,
    units: string
  ): Observable<number> {
    return this.http
      .get<any>(`${environment.apiBaseURL}`, {
        params: { lat: latitude, lon: longitude, units: units },
      })
      .pipe(
        map((response: WeatherData) => {
          this.currentTemperature.set(response.main.temp)
          return response.main.temp;
        }),
        catchError((error: HttpErrorResponse) => {
          let errorMsg: {
            message: string;
            errorCode: number;
          } = {
            message: error.error,
            errorCode: error.status,
          };
          return throwError(() => errorMsg);
        })
      );
  }
}
