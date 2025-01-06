import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerviewmarksComponent } from './maintainerviewmarks.component';

describe('MaintainerviewmarksComponent', () => {
  let component: MaintainerviewmarksComponent;
  let fixture: ComponentFixture<MaintainerviewmarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintainerviewmarksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerviewmarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
