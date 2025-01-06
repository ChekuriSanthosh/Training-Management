import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainercreateattendenceComponent } from './maintainercreateattendence.component';

describe('MaintainercreateattendenceComponent', () => {
  let component: MaintainercreateattendenceComponent;
  let fixture: ComponentFixture<MaintainercreateattendenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintainercreateattendenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainercreateattendenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
