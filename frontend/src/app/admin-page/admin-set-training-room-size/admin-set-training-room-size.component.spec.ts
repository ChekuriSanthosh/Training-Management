import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSetTrainingRoomSizeComponent } from './admin-set-training-room-size.component';

describe('AdminSetTrainingRoomSizeComponent', () => {
  let component: AdminSetTrainingRoomSizeComponent;
  let fixture: ComponentFixture<AdminSetTrainingRoomSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSetTrainingRoomSizeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSetTrainingRoomSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
