import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerviewstudentComponent } from './maintainerviewstudent.component';

describe('MaintainerviewstudentComponent', () => {
  let component: MaintainerviewstudentComponent;
  let fixture: ComponentFixture<MaintainerviewstudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintainerviewstudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerviewstudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
