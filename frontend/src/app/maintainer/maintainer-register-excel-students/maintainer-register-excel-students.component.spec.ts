import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerRegisterExcelStudentsComponent } from './maintainer-register-excel-students.component';

describe('MaintainerRegisterExcelStudentsComponent', () => {
  let component: MaintainerRegisterExcelStudentsComponent;
  let fixture: ComponentFixture<MaintainerRegisterExcelStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintainerRegisterExcelStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerRegisterExcelStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
