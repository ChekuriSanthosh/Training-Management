import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerDashboardComponent } from './maintainer-dashboard.component';

describe('MaintainerDashboardComponent', () => {
  let component: MaintainerDashboardComponent;
  let fixture: ComponentFixture<MaintainerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintainerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
