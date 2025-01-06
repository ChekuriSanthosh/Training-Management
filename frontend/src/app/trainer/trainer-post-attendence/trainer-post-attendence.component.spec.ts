import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerPostAttendenceComponent } from './trainer-post-attendence.component';

describe('TrainerPostAttendenceComponent', () => {
  let component: TrainerPostAttendenceComponent;
  let fixture: ComponentFixture<TrainerPostAttendenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerPostAttendenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerPostAttendenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
