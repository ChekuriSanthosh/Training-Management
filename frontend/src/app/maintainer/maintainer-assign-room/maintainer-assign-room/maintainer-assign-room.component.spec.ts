import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerAssignRoomComponent } from './maintainer-assign-room.component';

describe('MaintainerAssignRoomComponent', () => {
  let component: MaintainerAssignRoomComponent;
  let fixture: ComponentFixture<MaintainerAssignRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintainerAssignRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerAssignRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
