import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentViewClassMarksComponent } from './student-view-class-marks.component';

describe('StudentViewClassMarksComponent', () => {
  let component: StudentViewClassMarksComponent;
  let fixture: ComponentFixture<StudentViewClassMarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentViewClassMarksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentViewClassMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
