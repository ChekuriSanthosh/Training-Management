import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPostAttendenceComponent } from './student-post-attendence.component';

describe('StudentPostAttendenceComponent', () => {
  let component: StudentPostAttendenceComponent;
  let fixture: ComponentFixture<StudentPostAttendenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentPostAttendenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentPostAttendenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
