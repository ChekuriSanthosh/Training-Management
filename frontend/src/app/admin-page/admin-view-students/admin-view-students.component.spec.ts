import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewStudentsComponent } from './admin-view-students.component';

describe('AdminViewStudentsComponent', () => {
  let component: AdminViewStudentsComponent;
  let fixture: ComponentFixture<AdminViewStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminViewStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
