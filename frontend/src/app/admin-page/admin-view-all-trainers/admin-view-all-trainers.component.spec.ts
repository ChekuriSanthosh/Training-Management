import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewAllTrainersComponent } from './admin-view-all-trainers.component';

describe('AdminViewAllTrainersComponent', () => {
  let component: AdminViewAllTrainersComponent;
  let fixture: ComponentFixture<AdminViewAllTrainersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminViewAllTrainersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewAllTrainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
