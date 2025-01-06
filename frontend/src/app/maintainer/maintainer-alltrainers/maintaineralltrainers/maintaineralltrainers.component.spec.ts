import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintaineralltrainersComponent } from './maintaineralltrainers.component';

describe('MaintaineralltrainersComponent', () => {
  let component: MaintaineralltrainersComponent;
  let fixture: ComponentFixture<MaintaineralltrainersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintaineralltrainersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintaineralltrainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
