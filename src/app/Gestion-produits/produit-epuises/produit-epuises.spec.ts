import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitEpuises } from './produit-epuises';

describe('ProduitEpuises', () => {
  let component: ProduitEpuises;
  let fixture: ComponentFixture<ProduitEpuises>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitEpuises]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduitEpuises);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
