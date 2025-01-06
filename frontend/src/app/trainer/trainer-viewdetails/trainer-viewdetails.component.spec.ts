import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerViewdetailsComponent } from './trainer-viewdetails.component';

describe('TrainerViewdetailsComponent', () => {
  let component: TrainerViewdetailsComponent;
  let fixture: ComponentFixture<TrainerViewdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerViewdetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerViewdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
