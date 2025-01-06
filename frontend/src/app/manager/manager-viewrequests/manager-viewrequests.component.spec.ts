import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerViewrequestsComponent } from './manager-viewrequests.component';

describe('ManagerViewrequestsComponent', () => {
  let component: ManagerViewrequestsComponent;
  let fixture: ComponentFixture<ManagerViewrequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerViewrequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerViewrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
