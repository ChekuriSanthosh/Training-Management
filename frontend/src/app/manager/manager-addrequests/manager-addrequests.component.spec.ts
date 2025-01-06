import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerAddrequestsComponent } from './manager-addrequests.component';

describe('ManagerAddrequestsComponent', () => {
  let component: ManagerAddrequestsComponent;
  let fixture: ComponentFixture<ManagerAddrequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerAddrequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerAddrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
