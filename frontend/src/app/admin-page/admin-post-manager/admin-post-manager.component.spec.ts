import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPostManagerComponent } from './admin-post-manager.component';

describe('AdminPostManagerComponent', () => {
  let component: AdminPostManagerComponent;
  let fixture: ComponentFixture<AdminPostManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPostManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPostManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
