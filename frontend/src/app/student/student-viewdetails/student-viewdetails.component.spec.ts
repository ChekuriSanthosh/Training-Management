import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentViewdetailsComponent } from './student-viewdetails.component';

describe('StudentViewdetailsComponent', () => {
  let component: StudentViewdetailsComponent;
  let fixture: ComponentFixture<StudentViewdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentViewdetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentViewdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
