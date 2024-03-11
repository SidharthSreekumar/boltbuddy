import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LocationService } from '../../services/location/location.service';

@Component({
  selector: 'app-lightning-card',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
  ],
  templateUrl: './lightning-card.component.html',
  styleUrl: './lightning-card.component.scss',
})
export class LightningCardComponent {
  isLightning: boolean = true; // true = lightning
  isLoading: boolean = false; // true = waiting for calculation

  constructor(private locationService: LocationService) {}

  /**
   * Start waiting for calculation
   *
   * Set the loading state to true, and the lightning state to false.
   * After 3 seconds, set the loading state to false, and the lightning state to true.
   *
   * @returns void
   */
  startWaiting() {
    this.isLoading = true;
    this.isLightning = false;

    this.locationService.getCurrentPosition().subscribe((position) => {
      console.log(position);

    });


  }
}
