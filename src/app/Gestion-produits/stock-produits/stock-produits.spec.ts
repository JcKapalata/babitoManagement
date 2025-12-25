import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockProduits } from './stock-produits';

describe('StockProduits', () => {
  let component: StockProduits;
  let fixture: ComponentFixture<StockProduits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockProduits]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockProduits);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
