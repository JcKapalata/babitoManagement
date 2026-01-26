import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteLivre } from './vente-livre';

describe('VenteLivre', () => {
  let component: VenteLivre;
  let fixture: ComponentFixture<VenteLivre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenteLivre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenteLivre);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
