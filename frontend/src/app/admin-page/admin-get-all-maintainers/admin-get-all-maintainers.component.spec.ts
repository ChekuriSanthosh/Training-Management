import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGetAllMaintainersComponent } from './admin-get-all-maintainers.component';

describe('AdminGetAllMaintainersComponent', () => {
  let component: AdminGetAllMaintainersComponent;
  let fixture: ComponentFixture<AdminGetAllMaintainersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGetAllMaintainersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminGetAllMaintainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
