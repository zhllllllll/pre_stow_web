import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreStowComponent } from './pre-stow.component';

describe('PreStowComponent', () => {
  let component: PreStowComponent;
  let fixture: ComponentFixture<PreStowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreStowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreStowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
