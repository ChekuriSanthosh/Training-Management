import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerAssignNullroomStudentsComponent } from './maintainer-assign-nullroom-students.component';

describe('MaintainerAssignNullroomStudentsComponent', () => {
  let component: MaintainerAssignNullroomStudentsComponent;
  let fixture: ComponentFixture<MaintainerAssignNullroomStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintainerAssignNullroomStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerAssignNullroomStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
