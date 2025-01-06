import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerViewpageComponent } from './trainer-viewpage.component';

describe('TrainerViewpageComponent', () => {
  let component: TrainerViewpageComponent;
  let fixture: ComponentFixture<TrainerViewpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerViewpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerViewpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
