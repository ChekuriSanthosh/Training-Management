import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewManagerComponent } from './admin-view-manager.component';

describe('AdminViewManagerComponent', () => {
  let component: AdminViewManagerComponent;
  let fixture: ComponentFixture<AdminViewManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminViewManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
