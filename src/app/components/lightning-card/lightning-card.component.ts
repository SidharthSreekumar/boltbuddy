import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
  isLightning: boolean = true;
  isLoading: boolean = false;

  startWaiting() {
    this.isLoading = true;
    this.isLightning = false;
    setTimeout(() => {
      this.isLoading = false;
      this.isLightning = true;
    }, 3000);
  }
}
