import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerGetDoneStudentsComponent } from './maintainer-get-done-students.component';

describe('MaintainerGetDoneStudentsComponent', () => {
  let component: MaintainerGetDoneStudentsComponent;
  let fixture: ComponentFixture<MaintainerGetDoneStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintainerGetDoneStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerGetDoneStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
