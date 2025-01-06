import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerNavBarComponent } from './maintainer-nav-bar.component';

describe('MaintainerNavBarComponent', () => {
  let component: MaintainerNavBarComponent;
  let fixture: ComponentFixture<MaintainerNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintainerNavBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
