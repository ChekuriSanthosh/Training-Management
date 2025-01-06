import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerViewattendenceComponent } from './trainer-viewattendence.component';

describe('TrainerViewattendenceComponent', () => {
  let component: TrainerViewattendenceComponent;
  let fixture: ComponentFixture<TrainerViewattendenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerViewattendenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerViewattendenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
