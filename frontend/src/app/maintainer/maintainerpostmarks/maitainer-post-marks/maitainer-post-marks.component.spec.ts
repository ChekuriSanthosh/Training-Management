import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaitainerPostMarksComponent } from './maitainer-post-marks.component';

describe('MaitainerPostMarksComponent', () => {
  let component: MaitainerPostMarksComponent;
  let fixture: ComponentFixture<MaitainerPostMarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaitainerPostMarksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaitainerPostMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
