import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipBayPlotComponent } from './ship-bay-plot.component';

describe('ShipBayPlotComponent', () => {
  let component: ShipBayPlotComponent;
  let fixture: ComponentFixture<ShipBayPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipBayPlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipBayPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
