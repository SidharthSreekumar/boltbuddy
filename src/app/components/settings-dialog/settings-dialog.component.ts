import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { SettingsService } from '../../services/settings/settings.service';
import { SettingsData } from '../../shared/models/settingsdata.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-settings-dialog',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatDialogActions,
    MatDialogContent,
    MatCardModule,
    MatDialogClose,
    MatButtonModule,
    MatDialogTitle,

    ReactiveFormsModule,
  ],
  providers: [SettingsService],
  templateUrl: './settings-dialog.component.html',
  styleUrl: './settings-dialog.component.scss',
})
export class SettingsDialogComponent implements OnInit {
  settingsForm: FormGroup = this.fb.group({
    isLightMode: false,
    units: '',
  });

  constructor(
    public dialogRef: MatDialogRef<SettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SettingsData,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Updates previous setting values
    this.settingsForm.patchValue({
      isLightMode: this.data.isLightMode ?? false,
      units: this.data.units ?? 'metric',
    });

    this.settingsForm.valueChanges.subscribe((value) => {
      this.data = value;
    })
  }

  cancel() {
    this.dialogRef.close();
  }
}
