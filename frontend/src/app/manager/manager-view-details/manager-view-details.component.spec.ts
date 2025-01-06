import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerViewDetailsComponent } from './manager-view-details.component';

describe('ManagerViewDetailsComponent', () => {
  let component: ManagerViewDetailsComponent;
  let fixture: ComponentFixture<ManagerViewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerViewDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
