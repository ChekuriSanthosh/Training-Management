import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerMakeRoomDoneComponent } from './maintainer-make-room-done.component';

describe('MaintainerMakeRoomDoneComponent', () => {
  let component: MaintainerMakeRoomDoneComponent;
  let fixture: ComponentFixture<MaintainerMakeRoomDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintainerMakeRoomDoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerMakeRoomDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
