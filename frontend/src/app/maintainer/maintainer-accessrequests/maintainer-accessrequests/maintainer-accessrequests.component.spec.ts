import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerAccessrequestsComponent } from './maintainer-accessrequests.component';

describe('MaintainerAccessrequestsComponent', () => {
  let component: MaintainerAccessrequestsComponent;
  let fixture: ComponentFixture<MaintainerAccessrequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintainerAccessrequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerAccessrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
