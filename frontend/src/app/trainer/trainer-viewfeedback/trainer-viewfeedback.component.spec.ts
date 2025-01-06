import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerViewfeedbackComponent } from './trainer-viewfeedback.component';

describe('TrainerViewfeedbackComponent', () => {
  let component: TrainerViewfeedbackComponent;
  let fixture: ComponentFixture<TrainerViewfeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerViewfeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerViewfeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
