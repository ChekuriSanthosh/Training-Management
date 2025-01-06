import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerViewTimeTableComponent } from './trainer-view-time-table.component';

describe('TrainerViewTimeTableComponent', () => {
  let component: TrainerViewTimeTableComponent;
  let fixture: ComponentFixture<TrainerViewTimeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerViewTimeTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerViewTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
