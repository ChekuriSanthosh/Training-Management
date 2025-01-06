import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerregistertrainerComponent } from './maintainerregistertrainer.component';

describe('MaintainerregistertrainerComponent', () => {
  let component: MaintainerregistertrainerComponent;
  let fixture: ComponentFixture<MaintainerregistertrainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintainerregistertrainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerregistertrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
