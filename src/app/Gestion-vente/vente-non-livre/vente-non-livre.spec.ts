import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteNonLivre } from './vente-non-livre';

describe('VenteNonLivre', () => {
  let component: VenteNonLivre;
  let fixture: ComponentFixture<VenteNonLivre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenteNonLivre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenteNonLivre);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
