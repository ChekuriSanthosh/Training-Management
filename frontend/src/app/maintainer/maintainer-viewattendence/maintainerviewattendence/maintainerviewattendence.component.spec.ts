import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerviewattendenceComponent } from './maintainerviewattendence.component';

describe('MaintainerviewattendenceComponent', () => {
  let component: MaintainerviewattendenceComponent;
  let fixture: ComponentFixture<MaintainerviewattendenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintainerviewattendenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerviewattendenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
