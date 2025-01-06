import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddMaintainerComponent } from './admin-add-maintainer.component';

describe('AdminAddMaintainerComponent', () => {
  let component: AdminAddMaintainerComponent;
  let fixture: ComponentFixture<AdminAddMaintainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddMaintainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddMaintainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
