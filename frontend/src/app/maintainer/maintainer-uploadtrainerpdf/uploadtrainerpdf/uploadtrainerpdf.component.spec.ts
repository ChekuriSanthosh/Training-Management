import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadtrainerpdfComponent } from './uploadtrainerpdf.component';

describe('UploadtrainerpdfComponent', () => {
  let component: UploadtrainerpdfComponent;
  let fixture: ComponentFixture<UploadtrainerpdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadtrainerpdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadtrainerpdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
