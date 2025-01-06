import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentViewClassAttendenceComponent } from './student-view-class-attendence.component';

describe('StudentViewClassAttendenceComponent', () => {
  let component: StudentViewClassAttendenceComponent;
  let fixture: ComponentFixture<StudentViewClassAttendenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentViewClassAttendenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentViewClassAttendenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
