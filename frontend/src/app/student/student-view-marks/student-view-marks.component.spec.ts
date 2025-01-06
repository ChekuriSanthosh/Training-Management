import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentViewMarksComponent } from './student-view-marks.component';

describe('StudentViewMarksComponent', () => {
  let component: StudentViewMarksComponent;
  let fixture: ComponentFixture<StudentViewMarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentViewMarksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentViewMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
