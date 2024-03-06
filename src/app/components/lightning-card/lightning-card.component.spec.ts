import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightningCardComponent } from './lightning-card.component';

describe('LightningCardComponent', () => {
  let component: LightningCardComponent;
  let fixture: ComponentFixture<LightningCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LightningCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LightningCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
