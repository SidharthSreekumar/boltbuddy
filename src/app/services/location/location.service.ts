import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
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

  // getCurrentTemperature(
  //   latitude: number,
  //   longitude: number
  // ): Observable<number> {
  //   return this.http.get<number>(
  //     `${environment.API_URL}>lat=${latitude}&lon=${longitude}&appid=`
  //   );
  // }
}
