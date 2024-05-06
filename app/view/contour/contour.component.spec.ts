import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContourComponent } from './contour.component';

describe('ContourComponent', () => {
  let component: ContourComponent;
  let fixture: ComponentFixture<ContourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContourComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
