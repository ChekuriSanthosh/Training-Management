import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerregisterstudentComponent } from './maintainerregisterstudent.component';

describe('MaintainerregisterstudentComponent', () => {
  let component: MaintainerregisterstudentComponent;
  let fixture: ComponentFixture<MaintainerregisterstudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintainerregisterstudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerregisterstudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
