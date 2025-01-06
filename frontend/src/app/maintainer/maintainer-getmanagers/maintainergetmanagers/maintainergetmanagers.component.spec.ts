import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainergetmanagersComponent } from './maintainergetmanagers.component';

describe('MaintainergetmanagersComponent', () => {
  let component: MaintainergetmanagersComponent;
  let fixture: ComponentFixture<MaintainergetmanagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintainergetmanagersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainergetmanagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
