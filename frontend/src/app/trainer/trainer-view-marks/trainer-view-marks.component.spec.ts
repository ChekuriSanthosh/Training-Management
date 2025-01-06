import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerViewMarksComponent } from './trainer-view-marks.component';

describe('TrainerViewMarksComponent', () => {
  let component: TrainerViewMarksComponent;
  let fixture: ComponentFixture<TrainerViewMarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerViewMarksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerViewMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
